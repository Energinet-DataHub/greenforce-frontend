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
import { Router } from '@angular/router';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/shared/utilities';
import { catchError, from, Observable, switchMapTo, throwError } from 'rxjs';

/**
 * Redirects to the login page when the user is not authenticated or their
 * credentials have expired.
 */
@Injectable()
export class EoAuthenticationInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return nextHandler
      .handle(request)
      .pipe(
        catchError(
          (error: unknown): Observable<never> =>
            this.#is401UnauthorizedResponse(error)
              ? this.#navigateToLoginPage().pipe(switchMapTo(throwError(() => error)))
              : throwError(() => error)
        )
      );
  }

  #is401UnauthorizedResponse(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;
  }

  #navigateToLoginPage(): Observable<boolean> {
    return from(this.router.navigateByUrl(eoLandingPageRelativeUrl));
  }
}

export const eoAuthenticationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthenticationInterceptor,
};
