import { Inject, Injectable, InjectionToken } from '@angular/core';
import { SelectionActor } from './dh-selected-actor.component';

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

  private readonly selectedActorIdKey = 'actorStorage.selectedActorId';
  private readonly selectedActorKey = 'actorStorage.selectedActorObjectKey';

  private actorIds: string[] = [];

  setUserAssociatedActors = (actorIds: string[]) => (this.actorIds = actorIds);

  getSelectedActorId = () => {
    const selectedActorInLS = this._localStorage.getItem(this.selectedActorIdKey);
    const selectedActorInSS = this._sessionStorage.getItem(this.selectedActorIdKey);

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
    this._sessionStorage.setItem(this.selectedActorIdKey, actorId);
    this._localStorage.setItem(this.selectedActorIdKey, actorId);
  };

  setSelectedActor = (actor: SelectionActor) => {
    this._sessionStorage.setItem(this.selectedActorKey, JSON.stringify(actor));
    this._localStorage.setItem(this.selectedActorKey, JSON.stringify(actor));
    this.setSelectedActorId(actor.id);
  };

  getSelectedActor = (): SelectionActor | null => {
    const selectedActorInLS = this._localStorage.getItem(this.selectedActorKey);
    const selectedActorInSS = this._sessionStorage.getItem(this.selectedActorKey);

    if (selectedActorInSS) {
      return JSON.parse(selectedActorInSS);
    }

    if (selectedActorInLS) {
      return JSON.parse(selectedActorInLS);
    }

    return null;
  };
}
