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
  exhaustMap,
  filter,
  map,
  mergeMap,
  Observable,
  take,
} from 'rxjs';
import { AuthHttp } from '@energinet-datahub/eo/auth/data-access-api';
import { browserLocationToken } from './browser-location.token';

interface EoAuthTermsState {
  readonly version: string | null;
}
@Injectable()
export class EoAuthTermsStore extends ComponentStore<EoAuthTermsState> {
  #authState$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params.state
  );

  #version$: Observable<string> = this.select((state) => state.version).pipe(
    filter((version) => version !== null),
    map((version) => version as string)
  );

  constructor(
    private authHttp: AuthHttp,
    private route: ActivatedRoute,
    @Inject(browserLocationToken) private location: Location
  ) {
    super(initialState);
  }

  onVersionChange = this.updater<string>(
    (state, version): EoAuthTermsState => ({
      ...state,
      version,
    })
  );

  onAcceptTerms = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() =>
        combineLatest([this.#authState$, this.#version$]).pipe(
          take(1),
          mergeMap(([state, version]) =>
            this.authHttp.postAcceptTerms({
              state,
              version,
              accepted: true,
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
};
