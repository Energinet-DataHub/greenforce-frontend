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

import { Inject, Injectable, InjectionToken } from '@angular/core';

export const localStorageToken = new InjectionToken('localStorageToken', {
  factory: (): Storage => localStorage,
});

export const sessionStorageToken = new InjectionToken('sessionStorageToken', {
  factory: (): Storage => sessionStorage,
});

@Injectable({
  providedIn: 'root',
})
export class DhActorStorage {
  constructor(
    @Inject(localStorageToken) private _localStorage: Storage,
    @Inject(sessionStorageToken) private _sessionStorage: Storage
  ) {}

  private readonly selectedActorKey = 'actorStorage.selectedActor';

  private actorIds: string[] = [];

  setUserAssociatedActors = (actorIds: string[]) => (this.actorIds = actorIds);

  getSelectedActor = () => {
    const selectedActorInLS = this._localStorage.getItem(this.selectedActorKey);
    const selectedActorInSS = this._sessionStorage.getItem(this.selectedActorKey);

    if (selectedActorInSS) {
      return selectedActorInSS;
    }

    let actorToSelect = null;

    if (!selectedActorInLS || !this.actorIds.includes(selectedActorInLS)) {
      actorToSelect = this.actorIds[0];
    } else {
      actorToSelect = selectedActorInLS;
    }

    this.setSelectedActor(actorToSelect);

    return actorToSelect;
  };

  setSelectedActor = (actorId: string) => {
    this._sessionStorage.setItem(this.selectedActorKey, actorId);
    this._localStorage.setItem(this.selectedActorKey, actorId);
  };
}
