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
  /** @example "dashboard production meters certificates" */
  scope?: string;
  cpn?: string;
  sub?: string;
  tin?: string;
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
  getUserInfo$ = this.select((state) => state);
  getTokenNotBefore$ = this.select((state) => state.nbf ?? 0);
  getTokenExpiry$ = this.select((state) => state.exp ?? 0);
  getTin$ = this.select((state) => state.tin);
  isTokenExpired$ = this.select((state) => Date.now() / 1000 > (state.exp ?? 0));

  setTokenClaims = this.updater(
    (state, claim: EoLoginToken): AuthState => ({ ...state, ...claim })
  );
}
