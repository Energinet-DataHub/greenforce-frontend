/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { EoAuthService } from './auth.service';
import { EoAuthStore } from './auth.store';

@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  TokenRefreshCalls = ['PUT', 'POST', 'DELETE'];

  constructor(
    private snackBar: MatSnackBar,
    private authService: EoAuthService,
    private authStore: EoAuthStore
  ) {}

  intercept(req: HttpRequest<unknown>, nextHandler: HttpHandler) {
    const request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authStore.token.getValue()}`),
    });
    return nextHandler.handle(request).pipe(
      tap({
        next: (httpEvent) => this.#HandleTokenRefresh(httpEvent, request),
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) this.#displayPermissionError();
          if (this.#is401UnauthorizedResponse(error)) this.authService.logout();
          if (this.TokenRefreshCalls.includes(request.method)) this.authService.refreshToken();
        },
      })
    );
  }

  #HandleTokenRefresh(event: HttpEvent<unknown>, request: HttpRequest<unknown>) {
    if (event instanceof HttpResponse && this.TokenRefreshCalls.includes(request.method))
      this.authService.refreshToken();
  }

  #displayPermissionError() {
    return this.snackBar.open('You do not have permission to perform this action.').afterOpened();
  }

  #is403ForbiddenResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden;
  }

  #is401UnauthorizedResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
  }
}

export const eoAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthorizationInterceptor,
};
