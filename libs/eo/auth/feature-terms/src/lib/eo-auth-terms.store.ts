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
import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {combineLatest, exhaustMap, mergeMap, Observable, take} from 'rxjs';
import {AuthHttp} from '@energinet-datahub/ett/auth/data-access-api';
import {browserLocationToken} from './browser-location.token';

interface EoAuthTermsState {
  readonly version: string | null;
  readonly state: string | null;
}
@Injectable()
export class EoAuthTermsStore extends ComponentStore<EoAuthTermsState> {
  #acceptTermsUrl$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params.terms_accept_url
  );
  #state$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params.state
  );

  constructor(
    private authHttp: AuthHttp,
    private route: ActivatedRoute,
    @Inject(browserLocationToken) private location: Location
  ) {
    super(initialState);
  }

  // @todo This is triggered every second time now(?)
  onAcceptTerms = this.effect<string>((version$) =>
    version$.pipe(
      exhaustMap(() =>
        combineLatest([
          this.#acceptTermsUrl$,
          version$,
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
  version: null,
  state: null,
};
