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
import { Injectable, computed, DestroyRef, inject } from '@angular/core';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { catchError, EMPTY, filter, from, interval, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GetReleaseTogglesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

@Injectable({
  providedIn: 'root',
})
export class DhReleaseToggleService {
  private static readonly POLLING_INTERVAL_MS = 60_000; // Poll every minute
  private static readonly MAX_CONSECUTIVE_RETRIES = 10; // Stop after 10 consecutive failures

  private readonly destroyRef = inject(DestroyRef);
  private readonly applicationInsights = inject(DhApplicationInsights);

  // Service configuration
  private readonly pollingInterval = DhReleaseToggleService.POLLING_INTERVAL_MS;
  private readonly maxRetries = DhReleaseToggleService.MAX_CONSECUTIVE_RETRIES;

  // Internal state
  private failureCount = 0;

  // Apollo query setup
  private readonly togglesQuery = query(GetReleaseTogglesDocument, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all', // Continue even if there are errors
  });

  // Computed signal that converts the array to a Set for efficient lookup
  private readonly togglesSet = computed<Set<string>>(() => {
    const toggles = this.togglesQuery.data()?.releaseToggles ?? [];
    return new Set(toggles);
  });

  // Public API - Read-only signals
  readonly toggles = computed(() => Array.from(this.togglesSet()));
  readonly loading = this.togglesQuery.loading;
  readonly error = this.togglesQuery.error;
  readonly hasError = this.togglesQuery.hasError;
  readonly pollingFailed = computed(() => this.failureCount >= this.maxRetries);

  constructor() {
    this.initializePolling();
  }

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
   * Reloads toggles from the server and resets failure counter
   * @returns Promise that resolves when data is fetched
   */
  async refetch() {
    try {
      const result = await this.togglesQuery.refetch();
      this.handleRefetchSuccess();
      return result;
    } catch (error) {
      this.handleRefetchError(error);
      throw error;
    }
  }

  /**
   * Getter to see the number of consecutive failures
   */
  get consecutiveFailures(): number {
    return this.failureCount;
  }

  /**
   * Initialize polling setup
   */
  private initializePolling(): void {
    this.setupPollingInterval();
  }

  /**
   * Set up the polling interval with proper cleanup
   */
  private setupPollingInterval(): void {
    interval(this.pollingInterval)
      .pipe(
        filter(() => !this.shouldStopPolling()),
        switchMap(() => this.executeToggleRefetch()),
        tap(() => this.handlePollingSuccess()),
        catchError((error) => {
          this.handlePollingError(error);
          return EMPTY; // Continue the stream
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Check if polling should stop due to too many failures
   */
  private shouldStopPolling(): boolean {
    return this.failureCount >= this.maxRetries;
  }

  /**
   * Execute the toggle refetch operation (now returns Observable)
   */
  private executeToggleRefetch() {
    return from(this.togglesQuery.refetch());
  }

  /**
   * Handle successful polling attempt
   */
  private handlePollingSuccess(): void {
    if (this.failureCount > 0) {
      this.resetFailureCount();
    }
  }

  /**
   * Handle polling error
   */
  private handlePollingError(error: unknown): void {
    this.incrementFailureCount();
    this.applicationInsights.trackException(
      new Error(`Release toggle polling error ${this.failureCount}/${this.maxRetries}: ${error}`),
      SeverityLevel.Error
    );

    if (this.shouldStopPolling()) {
      this.applicationInsights.trackException(
        new Error(`Release toggle polling stopped due to too many failures.`),
        SeverityLevel.Critical
      );
    }
  }

  /**
   * Handle successful manual refetch
   */
  private handleRefetchSuccess(): void {
    this.resetFailureCount();
  }

  /**
   * Handle manual refetch error
   */
  private handleRefetchError(error: unknown): void {
    this.incrementFailureCount();
    this.applicationInsights.trackException(
      new Error(`Manual refetch failed (${this.failureCount}/${this.maxRetries}): ${error}`),
      SeverityLevel.Error
    );
  }

  /**
   * Reset the failure counter
   */
  private resetFailureCount(): void {
    this.failureCount = 0;
  }

  /**
   * Increment the failure counter
   */
  private incrementFailureCount(): void {
    this.failureCount++;
  }
}
