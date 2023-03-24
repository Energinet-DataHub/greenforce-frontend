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

  readonly getScope$ = this.select((state) => state.scope?.split(' ') ?? []);
  readonly getTokenExpiry$ = this.select((state) => state.exp);
  readonly getTermsVersion$ = this.select((state) => state.trm);

  readonly setTokenClaims = this.updater(
    (state, claim: EoLoginToken): AuthState => ({ ...state, ...claim })
  );
}
