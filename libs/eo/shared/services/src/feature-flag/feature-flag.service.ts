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

enum FeatureFlags {
  'test',
  'daterange',
  'resolution',
  'help',
}
export type allowedFeatureFlags = keyof typeof FeatureFlags;

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  #enabledFlags = new Set();

  /**
   * In case the user had previously saved a flag as enabled, get it from
   * storage and then reset the storage to null, incase user tampered with
   * it or has 'illegal' features set in localStorage.
   */
  constructor() {
    const savedFlags = JSON.parse(
      localStorage.getItem('featureFlagsEnabled') ?? '[]'
    );
    localStorage.removeItem('featureFlagsEnabled');

    savedFlags.forEach((element: string) => {
      if (element in FeatureFlags) {
        this.enableFeatureFlag(element);
      }
    });
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

  getEnabledFlags() {
    return this.#enabledFlags;
  }

  isFlagEnabled(name: string) {
    return this.#enabledFlags.has(name);
  }

  enableFeatureFlag(name: string) {
    if (name in FeatureFlags) {
      this.#addFlag(name as allowedFeatureFlags);
    }
  }

  disableFeatureFlag(name: string) {
    if (name in FeatureFlags) {
      this.#removeFlag(name as allowedFeatureFlags);
    }
  }
}
