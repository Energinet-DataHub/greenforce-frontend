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
  HttpStatusCode,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/shared/utilities';
import { Observable, tap } from 'rxjs';

/**
 * Displays an error when the user has insufficient permissions.
 */
@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  callsThatAllowRefresh = ['PUT', 'POST', 'DELETE'];

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: EoAuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return nextHandler.handle(request).pipe(
      tap({
        next: () => {
          if (this.callsThatAllowRefresh.includes(request.method)) {
            this.authService.refreshToken();
          }
        },
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) {
            this.#displayPermissionError();
          }
          if (this.#is401UnauthorizedResponse(error)) {
            this.#navigateToLoginPage();
          }
        },
      })
    );
  }

  #displayPermissionError(): Observable<void> {
    return this.snackBar.open('You do not have permission to perform this action.').afterOpened();
  }

  #is403ForbiddenResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden;
  }

  #is401UnauthorizedResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
  }

  #navigateToLoginPage() {
    return this.router.navigateByUrl(eoLandingPageRelativeUrl);
  }
}

export const eoAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthorizationInterceptor,
};
