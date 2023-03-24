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
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { AuthHttp } from '@energinet-datahub/eo/auth/data-access-api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EoPrivacyPolicyState {}

@Injectable()
export class EoPrivacyPolicyStore extends ComponentStore<EoPrivacyPolicyState> {
  #response = this.select(
    this.authHttp.getTerms().pipe(
      tapResponse(
        (response) => response,
        (error) => {
          // We only support the happy path for now
          throw error;
        }
      )
    ),
    (resp) => resp
  );

  version$: Observable<string> = this.select(this.#response, (response) => response.version);
  privacyPolicy$: Observable<string> = this.select(this.#response, (response) => response.terms);

  constructor(private authHttp: AuthHttp) {
    super(initialState);
  }
}

const initialState: EoPrivacyPolicyState = {};
