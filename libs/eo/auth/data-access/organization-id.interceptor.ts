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
import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ClassProvider, Injectable, inject } from '@angular/core';

import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

import { EoAuthService } from './auth.service';

@Injectable()
export class EoOrganizationIdInterceptor implements HttpInterceptor {
  private apiBase: string = inject(eoApiEnvironmentToken).apiBase;
  private authService: EoAuthService = inject(EoAuthService);

  private apiBaseUrls = [this.apiBase, this.apiBase.replace('/api', '/wallet-api')];

  intercept(req: HttpRequest<unknown>, handler: HttpHandler) {
    // Only requests to the API should be handled by this interceptor
    if (!this.isApiRequest(this.apiBaseUrls, req)) return handler.handle(req);

    const org_ids = this.authService.user()?.org_ids;
    if (!org_ids) return handler.handle(req);

    const modifiedReq = req.clone({
      setParams: {
        organizationId: org_ids,
      },
    });
    return handler.handle(modifiedReq);
  }

  private isApiRequest(apiBaseUrls: string[], req: HttpRequest<unknown>): boolean {
    return !!apiBaseUrls.find((apiBaseUrl) => {
      return req.url.startsWith(apiBaseUrl);
    });
  }
}

export const eoOrganizationIdInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoOrganizationIdInterceptor,
};
