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

import { Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

@Injectable()
export class EoApiVersioningInterceptor implements HttpInterceptor {
  constructor(@Inject(eoApiEnvironmentToken) private apiEnvironment: EoApiEnvironment) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('assets')) return next.handle(request);

    const apiVersions = this.apiEnvironment.apiVersions;
    const versionedPaths = Object.keys(apiVersions);

    const isVersioned = versionedPaths.find((path) => {
      if (request.url.includes('wallet-api') && path === 'wallet-api') return true;

      return request.url.startsWith(`${this.apiEnvironment.apiBase}/${path}`);
    });

    if (isVersioned) {
      const modifiedRequest = request.clone({
        setHeaders: {
          'X-API-Version': apiVersions[isVersioned],
        },
      });
      return next.handle(modifiedRequest);
    } else {
      return next.handle(request);
    }
  }
}

export const eoApiVersioningInterceptorProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoApiVersioningInterceptor,
};
