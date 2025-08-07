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
import { Injectable, InjectionToken, inject } from '@angular/core';
import { SelectionMarketParticipant } from './dh-selected-actor.component';

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
  private readonly localStorage = inject<Storage>(localStorageToken);
  private readonly sessionStorage = inject<Storage>(sessionStorageToken);

  private readonly selectedActorIdKey = 'actorStorage.selectedActorId';
  private readonly selectedActorKey = 'actorStorage.selectedActorObjectKey';

  private actorIds: string[] = [];

  setUserAssociatedActors = (actorIds: string[]) => (this.actorIds = actorIds);

  getSelectedActorId = () => {
    const selectedActorInLS = this.localStorage.getItem(this.selectedActorIdKey);
    const selectedActorInSS = this.sessionStorage.getItem(this.selectedActorIdKey);

    if (selectedActorInSS && this.actorIds.includes(selectedActorInSS)) {
      return selectedActorInSS;
    }

    let actorToSelect = null;

    if (!selectedActorInLS || !this.actorIds.includes(selectedActorInLS)) {
      actorToSelect = this.actorIds[0];
    } else {
      actorToSelect = selectedActorInLS;
    }

    this.setSelectedActorId(actorToSelect);

    return actorToSelect;
  };

  setSelectedActorId = (actorId: string) => {
    this.sessionStorage.setItem(this.selectedActorIdKey, actorId);
    this.localStorage.setItem(this.selectedActorIdKey, actorId);
  };

  setSelectedActor = (actor: SelectionMarketParticipant) => {
    this.sessionStorage.setItem(this.selectedActorKey, JSON.stringify(actor));
    this.localStorage.setItem(this.selectedActorKey, JSON.stringify(actor));
    this.setSelectedActorId(actor.id);
  };

  haveSelectedActor = (): boolean => {
    try {
      this.getSelectedActor();
      return true;
    } catch {
      return false;
    }
  };

  getSelectedActor = (): SelectionMarketParticipant => {
    const selectedActorInLS = this.localStorage.getItem(this.selectedActorKey);
    const selectedActorInSS = this.sessionStorage.getItem(this.selectedActorKey);

    if (selectedActorInSS) {
      return JSON.parse(selectedActorInSS);
    }

    if (selectedActorInLS) {
      return JSON.parse(selectedActorInLS);
    }

    throw new Error(
      'No selected actor found in local or session storage. Please set a selected actor before calling getSelectedActor().'
    );
  };
}
