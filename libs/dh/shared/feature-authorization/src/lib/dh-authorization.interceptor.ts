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
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { Observable, switchMap } from 'rxjs';
import { ActorTokenService } from './actor-token.service';

@Injectable()
export class DhAuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private actorTokenService: ActorTokenService,
    private featureFlag: DhFeatureFlagsService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.featureFlag.isEnabled('grant_full_authorization')) {
      return nextHandler.handle(request);
    }

    const authorizationHeader = 'Authorization';

    if (!this.hasAuthorizationHeader(request)) {
      return nextHandler.handle(request);
    }

    if (this.actorTokenService.isPartOfAuthFlow(request)) {
      return this.actorTokenService.handleAuthFlow(request, nextHandler);
    }

    return this.actorTokenService.acquireToken().pipe(
      switchMap((internalToken) => {
        return nextHandler.handle(
          request.clone({
            headers: request.headers.set(
              authorizationHeader,
              `Bearer ${internalToken}`
            ),
          })
        );
      })
    );
  }

  private hasAuthorizationHeader(request: HttpRequest<unknown>): boolean {
    const authorizationHeader = 'Authorization';
    const externalToken = request.headers.get(authorizationHeader);
    return !!externalToken;
  }
}

export const dhAuthorizationInterceptor: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: DhAuthorizationInterceptor,
};
