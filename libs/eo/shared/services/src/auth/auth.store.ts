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

export interface EoLoginToken {
  acl?: boolean;
  aud?: string;
  eat?: string;
  eit?: string;
  exp?: number;
  ext?: string;
  iat?: number;
  iss?: string;
  name?: string;
  nbf?: number;
  /** @example "accepted-terms dashboard production meters certificates" */
  scope?: string;
  sub?: string;
  trm?: number;
}

type AuthState = EoLoginToken;

@Injectable({
  providedIn: 'root',
})
export class EoAuthStore extends ComponentStore<AuthState> {
  constructor() {
    super({});
  }

  readonly getScope$ = this.select((state) => state.scope?.split(' ') ?? []);
  readonly getTokenExpiry$ = this.select((state) => state.exp);

  readonly loginToken$ = this.select((state) => state);
  readonly setLoginToken = this.updater(
    (state, loginToken: EoLoginToken): AuthState => ({ ...state, ...loginToken })
  );
}
