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
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { EoAuthService } from './auth.service';
import { EoAuthStore } from './auth.store';
import { WattToastService } from '@energinet-datahub/watt/toast';
@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  private authService: EoAuthService = inject(EoAuthService);
  private authStore: EoAuthStore = inject(EoAuthStore);
  private toastService: WattToastService = inject(WattToastService);
  private transloco: TranslocoService = inject(TranslocoService);

  private tokenRefreshCalls = ['PUT', 'POST', 'DELETE'];
  private ignoreTokenRefreshUrls = ['/api/auth/token', '/api/authorization/consent/grant'];

  intercept(req: HttpRequest<unknown>, handler: HttpHandler) {
    console.log('INTERCEPT - AUTH');
    if (this.#shouldRefreshToken(req)) {
      this.authService.refreshToken().subscribe();
    }

    const authorizedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authStore.token.getValue()}`),
    });
    return handler.handle(authorizedRequest).pipe(
      tap((event) => {
        if (event.type !== HttpEventType.Response) return;
        if (this.#is403ForbiddenResponse(event)) this.#displayPermissionError();
        console.log('AUTH - 401');
        if (this.#is401UnauthorizedResponse(event)) this.authService.logout();

        console.log('AUTH - nothing triggered');
      })
    );
  }

  #shouldRefreshToken(req: HttpRequest<unknown>): boolean {
    const path = new URL(req.urlWithParams).pathname;
    return (
      this.tokenRefreshCalls.includes(req.method) && !this.ignoreTokenRefreshUrls.includes(path)
    );
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
