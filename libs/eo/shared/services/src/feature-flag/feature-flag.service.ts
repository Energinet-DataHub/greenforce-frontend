import { Injectable } from '@angular/core';

export enum allowedFeatureFlags {
  'test',
  'winter',
  'summer',
}

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  #enabledFlags = new Set<allowedFeatureFlags>();

  getEnabledFlags() {
    return this.#enabledFlags;
  }

  #addFlag(name: allowedFeatureFlags) {
    this.#enabledFlags.add(name);
    this.#saveFlagsToMemory();
  }

  #removeFlag(name: allowedFeatureFlags) {
    this.#enabledFlags.delete(name);
    this.#saveFlagsToMemory();
  }

  #saveFlagsToMemory() {
    localStorage.setItem(
      'featureFlagsEnabled',
      JSON.stringify([...this.#enabledFlags])
    );
  }

  enableFeatureFlag(name: any) {
    if (name in allowedFeatureFlags) {
      this.#addFlag(name);
    }
  }

  disableFeatureFlag(name: any) {
    if (name in allowedFeatureFlags) {
      this.#removeFlag(name);
    }
  }
}
