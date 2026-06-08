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
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassProvider, Injectable, inject } from '@angular/core';

import { DhLanguageService } from './language-service/dh-language.service';

@Injectable()
export class DhLanguageInterceptor implements HttpInterceptor {
  private readonly languageService = inject(DhLanguageService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(
      request.clone({
        headers: request.headers.set('Accept-Language', this.languageService.selectedLanguage()),
      })
    );
  }
}

export const dhLanguageInterceptor: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: DhLanguageInterceptor,
};
