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
import { ComponentStore } from '@ngrx/component-store';
import { BehaviorSubject } from 'rxjs';

export interface EoLoginToken {
  atv?: number;
  exp?: number;
  name?: string;
  nbf?: number;
  /** @example "accepted-terms dashboard production meters certificates" */
  scope?: string;
  sub?: string;
  /** @example 3 - To indicate that the latest terms version is 3 */
  trm?: number;
}

type AuthState = EoLoginToken;

@Injectable({
  providedIn: 'root',
})
export class EoAuthStore extends ComponentStore<AuthState> {
  public token = new BehaviorSubject<string>('');

  constructor() {
    super({});
  }

  getScope$ = this.select((state) => state.scope?.split(' ') ?? []);
  getTokenNotBefore$ = this.select((state) => state.nbf ?? 0);
  getTokenExpiry$ = this.select((state) => state.exp ?? 0);
  getTermsVersion$ = this.select((state) => state.trm);
  isTokenExpired$ = this.select((state) => Date.now() / 1000 > (state.exp ?? 0));

  setTokenClaims = this.updater(
    (state, claim: EoLoginToken): AuthState => ({ ...state, ...claim })
  );
}
