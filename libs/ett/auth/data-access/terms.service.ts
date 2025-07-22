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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EttApiEnvironment, ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class EttTermsService {
  private currentVersion = -1;
  #apiEnvironment: EttApiEnvironment = inject(ettApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #apiBase = this.#apiEnvironment.apiBase;

  setVersion(version: number) {
    this.currentVersion = version;
  }

  acceptTerms() {
    return this.#http.put(`${this.#apiBase}/terms/user/accept/${this.currentVersion}`, null);
  }
}
