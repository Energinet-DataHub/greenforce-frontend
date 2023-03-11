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

interface AuthState {
  loginToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthStore extends ComponentStore<AuthState> {
  constructor() {
    super({ loginToken: '' });
  }

  readonly loginToken$ = this.select((state) => state.loginToken);
  readonly setLoginToken = this.updater(
    (state, loginToken: string): AuthState => ({ ...state, loginToken })
  );
}
