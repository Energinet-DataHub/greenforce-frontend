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
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { catchError, concatMap, filter, map, take, tap, throwError } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { EoAuthService } from './auth.service';
import { EoAuthStore } from './auth.store';
import { WattToastService } from '@energinet-datahub/watt/toast';

// These URLS are using the new auth flow and should not trigger a token refresh
const ignoreTokenRefreshUrls = ['/api/authorization/consent/grant'];

@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  TokenRefreshCalls = ['PUT', 'POST', 'DELETE'];

  constructor(
    private authService: EoAuthService,
    private authStore: EoAuthStore,
    private toastService: WattToastService,
    private transloco: TranslocoService
  ) {}

  // eslint-disable-next-line sonarjs/cognitive-complexity
  intercept(req: HttpRequest<unknown>, nextHandler: HttpHandler) {
    const tokenRefreshTrigger = this.TokenRefreshCalls.includes(req.method);
    const authorizedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authStore.token.getValue()}`),
    });

    if (tokenRefreshTrigger && this.#shouldRefreshToken(req.urlWithParams)) {
      return nextHandler.handle(authorizedRequest).pipe(
        filter((event) => event instanceof HttpResponse),
        concatMap((httpEvent) => this.authService.refreshToken().pipe(map(() => httpEvent))),
        catchError((error) => {
          if (this.#is403ForbiddenResponse(error)) this.#displayPermissionError();
          if (this.#is401UnauthorizedResponse(error)) this.authService.logout();

          this.authService.refreshToken().pipe(take(1)).subscribe();

          return throwError(() => error);
        })
      );
    }

    return nextHandler.handle(authorizedRequest).pipe(
      tap({
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) this.#displayPermissionError();
          if (this.#is401UnauthorizedResponse(error)) this.authService.logout();

          if (tokenRefreshTrigger && this.#shouldRefreshToken(req.urlWithParams)) {
            this.authService.refreshToken();
          }
        },
      })
    );
  }

  #shouldRefreshToken(url: string): boolean {
    const path = new URL(url).pathname;
    console.log('should refresh token', path, !ignoreTokenRefreshUrls.includes(path));
    return !ignoreTokenRefreshUrls.includes(path);
  }

  #displayPermissionError() {
    this.toastService.open({
      message: this.transloco.translate('You do not have permission to perform this action.'),
      type: 'danger',
    });
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
