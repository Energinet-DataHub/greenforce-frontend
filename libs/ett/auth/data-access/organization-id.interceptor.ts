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
import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ClassProvider, Injectable, inject } from '@angular/core';

import { ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';

import { EttActorService } from './actor.service';

@Injectable()
export class EttOrganizationIdInterceptor implements HttpInterceptor {
  private apiBase: string = inject(ettApiEnvironmentToken).apiBase;
  private actor = inject(EttActorService).actor;

  private apiBaseUrls = [this.apiBase, this.apiBase.replace('/api', '/wallet-api')];

  intercept(req: HttpRequest<unknown>, handler: HttpHandler) {
    // Only requests to the API should be handled by this interceptor
    if (!this.isApiRequest(this.apiBaseUrls, req)) return handler.handle(req);

    const currentActor = this.actor()?.org_id;
    if (!currentActor) return handler.handle(req);

    const modifiedReq = req.clone({
      setParams: {
        organizationId: currentActor,
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

export const ettOrganizationIdInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EttOrganizationIdInterceptor,
};
