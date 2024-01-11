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
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { EovAuthService } from './auth.service';
import { EovAuthStore } from './auth.store';

@Injectable()
export class EovAuthorizationInterceptor implements HttpInterceptor {
  TokenRefreshCalls = ['PUT', 'POST', 'DELETE'];

  constructor(
    private snackBar: MatSnackBar,
    private authService: EovAuthService,
    private authStore: EovAuthStore
  ) {}

  // eslint-disable-next-line sonarjs/cognitive-complexity
  intercept(req: HttpRequest<unknown>, nextHandler: HttpHandler) {
    const tokenRefreshTrigger = this.TokenRefreshCalls.includes(req.method);
    this.authService.checkForExistingToken();
    const authorizedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authStore.token.getValue()}`),
    });

    // if (tokenRefreshTrigger) {
    //   return nextHandler.handle(authorizedRequest).pipe(
    //     filter((event) => event instanceof HttpResponse),
    //     concatMap((httpEvent) => this.authService.refreshToken().pipe(map(() => httpEvent))),
    //     catchError((error) => {
    //       if (this.#is403ForbiddenResponse(error)) this.#displayPermissionError();
    //       if (this.#is401UnauthorizedResponse(error)) this.authService.logout();
    //       this.authService.refreshToken().pipe(take(1)).subscribe();
    //       return throwError(() => new Error(`An error occurred`));
    //     })
    //   );
    // }

    return nextHandler.handle(authorizedRequest).pipe(
      tap({
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) this.#displayPermissionError();
          if (this.#is401UnauthorizedResponse(error)) this.authService.logout();
          tokenRefreshTrigger && this.authService.refreshToken();
        },
      })
    );
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

export const eovAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EovAuthorizationInterceptor,
};
