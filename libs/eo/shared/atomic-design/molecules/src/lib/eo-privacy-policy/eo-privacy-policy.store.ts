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
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { browserLocationToken } from './browser-location.token';

interface EoPrivacyPolicyState {
  readonly headline: string | null;
  readonly privacyPolicy: string | null;
  readonly version: string | null;
  readonly state: string | null;
}
@Injectable()
export class EoPrivacyPolicyStore extends ComponentStore<EoPrivacyPolicyState> {
  /**
   * @todo (1) Discuss with backend if can use a fixed endpoint value inside the AuthHttp client here - What benefit do we have by parsing this in as a dynamic value?
   */
  #privacyPolicyUrl$: Observable<string> = of('terms');

  version$: Observable<string> = this.select((state) => state.version).pipe(
    filter((version) => version !== null),
    map((version) => version as string)
  );

  headline$: Observable<string> = this.select((state) => state.headline).pipe(
    filter((headline) => headline !== null),
    map((headline) => headline as string)
  );

  privacyPolicy$: Observable<string> = this.select(
    (state) => state.privacyPolicy
  ).pipe(
    filter((terms) => terms !== null),
    map((terms) => terms as string)
  );

  constructor(
    private authHttp: AuthHttp,
    @Inject(browserLocationToken) private location: Location
  ) {
    super(initialState);
    this.#getPrivacyPolicy(this.#privacyPolicyUrl$); // @todo (1)
  }

  #getPrivacyPolicy = this.effect<string>((privacyPolicyUrl$) =>
    privacyPolicyUrl$.pipe(
      switchMap((privacyPolicyUrl) =>
        this.authHttp.getTerms(privacyPolicyUrl).pipe(
          tapResponse(
            (response) =>
              this.patchState({
                headline: response.headline,
                privacyPolicy: response.terms,
                version: response.version,
              }),
            (error) => {
              // We only support the happy path for now
              throw error;
            }
          )
        )
      )
    )
  );
}

const initialState: EoPrivacyPolicyState = {
  headline: null,
  privacyPolicy: null,
  version: null,
  state: null,
};
