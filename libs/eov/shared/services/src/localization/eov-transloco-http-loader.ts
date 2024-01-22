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
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable()
export class EovTranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  #apiBase = inject(eovApiEnvironmentToken).customerApiUrl;
  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`${this.#apiBase}/api/translation/get/${lang}`);
  }
}
