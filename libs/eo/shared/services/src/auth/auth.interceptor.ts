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
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { EoAuthService } from './auth.service';
import { EoAuthStore } from './auth.store';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  private apiBase: string = inject(eoApiEnvironmentToken).apiBase;
  private authService: EoAuthService = inject(EoAuthService);
  private authStore: EoAuthStore = inject(EoAuthStore);
  private toastService: WattToastService = inject(WattToastService);
  private transloco: TranslocoService = inject(TranslocoService);
  private tokenRefreshCalls = ['PUT', 'POST', 'DELETE'];
  private ignoreTokenRefreshUrls = ['/api/auth/token', '/api/authorization/consent/grant'];

  intercept(req: HttpRequest<unknown>, handler: HttpHandler) {
    // Only requests to the API should be handled by this interceptor
    if (!req.url.includes(this.apiBase)) return handler.handle(req);

    if (this.shouldRefreshToken(req)) {
      console.log('AUTH - refreshToken');
      this.authService.refreshToken().subscribe();
    }

    console.log('ADD AUTH HEADER');
    const authorizedRequest = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${this.authStore.token.getValue()}`),
    });
    return handler.handle(authorizedRequest).pipe(
      catchError((error) => {
        console.log('AUTH - catchError', error);
        if (this.is403ForbiddenResponse(error)) this.displayPermissionError();
        if (this.is401UnauthorizedResponse(error)) {
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }

  private shouldRefreshToken(req: HttpRequest<unknown>): boolean {
    const path = new URL(req.urlWithParams).pathname;
    console.log('AUTH - shouldRefreshToken', path, req);
    return (
      this.tokenRefreshCalls.includes(req.method) && !this.ignoreTokenRefreshUrls.includes(path)
    );
  }

  private displayPermissionError() {
    console.log('AUTH - displayPermissionError');
    this.toastService.open({
      message: this.transloco.translate('You do not have permission to perform this action.'),
      type: 'danger',
    });
  }

  private is403ForbiddenResponse(error: unknown): boolean {
    console.log('AUTH - is403ForbiddenResponse', error);
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden;
  }

  private is401UnauthorizedResponse(error: unknown): boolean {
    console.log('AUTH - is401UnauthorizedResponse', error);
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
  }
}

export const eoAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthorizationInterceptor,
};
