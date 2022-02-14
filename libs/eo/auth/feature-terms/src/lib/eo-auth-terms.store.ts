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
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  combineLatest,
  filter,
  map,
  mergeMap,
  take,
  Observable,
  switchMap,
  exhaustMap,
} from 'rxjs';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { browserLocationToken } from './browser-location.token';

interface EoAuthTermsState {
  readonly headline: string | null;
  readonly terms: string | null;
  readonly version: string | null;
  readonly state: string | null;
}
@Injectable()
export class EoAuthTermsStore extends ComponentStore<EoAuthTermsState> {
  #termsUrl$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params.terms_url
  );
  #acceptTermsUrl$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params.terms_accept_url
  );
  #state$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params.state
  );

  #version$: Observable<string> = this.select((state) => state.version).pipe(
    filter((version) => version !== null),
    map((version) => version as string)
  );

  headline$: Observable<string> = this.select((state) => state.headline).pipe(
    filter((headline) => headline !== null),
    map((headline) => headline as string)
  );
  terms$: Observable<string> = this.select((state) => state.terms).pipe(
    filter((terms) => terms !== null),
    map((terms) => terms as string)
  );

  constructor(
    private authHttp: AuthHttp,
    private route: ActivatedRoute,
    @Inject(browserLocationToken) private location: Location
  ) {
    super(initialState);
    this.#getTerms(this.#termsUrl$);
  }

  #getTerms = this.effect<string>((termsUrl$) =>
    termsUrl$.pipe(
      switchMap((termsUrl) =>
        this.authHttp.getTerms(termsUrl).pipe(
          tapResponse(
            (response) =>
              this.patchState({
                headline: response.headline,
                terms: response.terms,
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

  onAcceptTerms = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() =>
        combineLatest([
          this.#acceptTermsUrl$,
          this.#version$,
          this.#state$,
        ]).pipe(
          take(1),
          mergeMap(([acceptTermsUrl, version, state]) =>
            this.authHttp.postAcceptTerms(acceptTermsUrl, {
              version,
              accepted: true,
              state,
            })
          ),
          tapResponse(
            (response) => this.location.replace(response.next_url),
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

const initialState: EoAuthTermsState = {
  headline: null,
  terms: null,
  version: null,
  state: null,
};
