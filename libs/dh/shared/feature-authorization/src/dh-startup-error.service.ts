//#region License
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
//#endregion
import { Injectable, computed, signal } from '@angular/core';

/**
 * Categorisation of fatal startup failures. Currently we only model a
 * `GetUserActors` failure, but new variants can be added as the bootstrap
 * flow grows.
 */
export type DhStartupErrorKind = 'get-user-actors';

export interface DhStartupErrorState {
  readonly kind: DhStartupErrorKind;
  readonly cause: unknown;
}

@Injectable({ providedIn: 'root' })
export class DhStartupErrorService {
  private readonly state = signal<DhStartupErrorState | null>(null);

  readonly hasError = computed(() => this.state() !== null);

  setError(kind: DhStartupErrorKind, cause: unknown): void {
    this.state.set({ kind, cause });
  }

  clear(): void {
    this.state.set(null);
  }
}
