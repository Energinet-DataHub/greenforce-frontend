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
import { Injectable, computed } from '@angular/core';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { GetReleaseTogglesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Injectable({
  providedIn: 'root',
})
export class DhReleaseToggleService {
  // Apollo query setup with retry configuration
  private readonly togglesQuery = query(GetReleaseTogglesDocument, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    pollInterval: 60_000, // Poll every minute
  });

  // Computed signal that converts the array to a Set for efficient lookup
  private readonly togglesSet = computed<Set<string>>(() => {
    const toggles = this.togglesQuery.data()?.releaseToggles ?? [];
    return new Set(toggles);
  });

  // Public API - Read-only signals
  readonly toggles = computed(() => Array.from(this.togglesSet()));
  readonly loading = computed(() =>  !this.togglesQuery.called() ? true : this.togglesQuery.loading());
  readonly error = this.togglesQuery.error;
  readonly hasError = this.togglesQuery.hasError;

  /**
   * Checks if a specific toggle is enabled
   * @param name The name of the toggle
   * @returns true if the toggle is enabled, false otherwise
   */
  isEnabled(name: string): boolean {
    return this.togglesSet().has(name);
  }

  /**
   * Gets all enabled toggles
   * @returns Array of toggle names that are enabled
   */
  getEnabledToggles(): string[] {
    return this.toggles();
  }

  /**
   * Checks if at least one of the given toggles is enabled
   * @param names Array of toggle names
   * @returns true if at least one toggle is enabled
   */
  hasAnyEnabled(names: string[]): boolean {
    return names.some((name) => this.isEnabled(name));
  }

  /**
   * Checks if all of the given toggles are enabled
   * @param names Array of toggle names
   * @returns true if all toggles are enabled
   */
  areAllEnabled(names: string[]): boolean {
    return names.every((name) => this.isEnabled(name));
  }

  /**
   * Manually refetch toggles from the server
   * @returns Promise that resolves when data is fetched
   */
  async refetch() {
    return this.togglesQuery.refetch();
  }
}
