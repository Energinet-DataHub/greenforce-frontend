//#region License
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
//#endregion
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, inject, Injectable } from '@angular/core';
import { catchError, EMPTY, from, Observable, switchMap, throwError } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

import { EoAuthService } from './auth.service';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';

@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  private apiBase: string = inject(eoApiEnvironmentToken).apiBase;
  private authService: EoAuthService = inject(EoAuthService);
  private toastService: WattToastService = inject(WattToastService);
  private transloco: TranslocoService = inject(TranslocoService);

  private tokenRefreshCalls = ['PUT', 'POST', 'DELETE'];
  private ignoreTokenRefreshUrls = [
    '/api/auth/token',
    '/api/authorization/consent/grant',
    '/api/authorization/terms/accept',
  ];
  private apiBaseUrls = [this.apiBase, this.apiBase.replace('/api', '/wallet-api')];

  intercept(req: HttpRequest<unknown>, handler: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isApiRequest(this.apiBaseUrls, req)) {
      return handler.handle(req);
    }

    const authorizedRequest = this.addAuthorizationHeader(req);
    const shouldRefresh = this.shouldRefreshToken(req);

    const request$ = shouldRefresh
      ? this.handleTokenRefresh(authorizedRequest, handler)
      : handler.handle(authorizedRequest);

    return this.handleRequestErrors(request$);
  }

  private addAuthorizationHeader(req: HttpRequest<unknown>): HttpRequest<unknown> {
    return req.clone({
      headers: req.headers.append(
        'Authorization',
        `Bearer ${this.authService.user()?.access_token}`
      ),
    });
  }

  private handleTokenRefresh(
    authorizedRequest: HttpRequest<unknown>,
    handler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.authService.renewToken()).pipe(
      catchError((error) => {
        if (this.is400BadRequestResponse(error)) {
          this.authService.logout().then(() => {
            this.redirectToContactSupport();
          });
        }
        return throwError(() => error);
      }),
      switchMap(() => handler.handle(authorizedRequest))
    );
  }

  private handleRequestErrors(
    request$: Observable<HttpEvent<unknown>>
  ): Observable<HttpEvent<unknown>> {
    return request$.pipe(
      catchError((error) => {
        if (this.is403ForbiddenResponse(error)) this.displayPermissionError();
        if (this.is401UnauthorizedResponse(error)) this.authService.logout();
        if (this.is400BadRequestResponse(error)) this.authService.logout();
        return throwError(() => error);
      })
    );
  }

  private isApiRequest(apiBaseUrls: string[], req: HttpRequest<unknown>): boolean {
    return !!apiBaseUrls.find((apiBaseUrl) => {
      return req.url.startsWith(apiBaseUrl);
    });
  }

  private redirectToContactSupport(): void {
    window.location.href = `/${this.transloco.getActiveLang()}/${eoRoutes.contactSupport}`;
  }

  private shouldRefreshToken(req: HttpRequest<unknown>): boolean {
    const path = new URL(req.url, window.location.origin).pathname;
    return (
      this.tokenRefreshCalls.includes(req.method) && !this.ignoreTokenRefreshUrls.includes(path)
    );
  }

  private displayPermissionError() {
    this.toastService.open({
      message: this.transloco.translate('You do not have permission to perform this action.'),
      type: 'danger',
    });
  }

  private is403ForbiddenResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Forbidden;
  }

  private is401UnauthorizedResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
  }

  private is400BadRequestResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest;
  }
}

export const eoAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthorizationInterceptor,
};
