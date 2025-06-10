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
import { TestBed } from '@angular/core/testing';
import { ApolloQueryResult } from '@apollo/client';
import { signal } from '@angular/core';

import { DhReleaseToggleService } from './dh-release-toggle.service';
import { GetReleaseTogglesQuery } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

// Mock query function
const mockQuery = {
  data: signal<GetReleaseTogglesQuery | null>(null),
  loading: signal(false),
  error: signal<unknown>(undefined),
  hasError: signal(false),
  called: signal(false), // Back to signal since service calls called()
  refetch: jest.fn(),
};

// Mock application insights
const mockApplicationInsights = {
  trackException: jest.fn(),
};

// Helper function to create properly typed Apollo query results
function createMockApolloResult<T>(data: T): ApolloQueryResult<T> {
  return {
    data,
    loading: false,
    networkStatus: 7, // NetworkStatus.ready
    error: undefined,
    partial: false,
  };
}

// Mock data that matches the new flat array format
const MOCK_ENABLED_TOGGLES = ['toggle1', 'toggle3', 'featureX', 'featureY'];

const mockReleaseTogglesData: GetReleaseTogglesQuery = {
  __typename: 'Query' as const,
  releaseToggles: MOCK_ENABLED_TOGGLES, // Flat array of enabled release toggle names
};

// Properly typed Apollo result
const mockApolloResult = createMockApolloResult<GetReleaseTogglesQuery>(mockReleaseTogglesData);

// Mock the query utility
jest.mock('@energinet-datahub/dh/shared/util-apollo', () => ({
  query: jest.fn(() => mockQuery),
}));

describe('DhReleaseToggleService Integration Tests', () => {
  let service: DhReleaseToggleService;
  const NETWORK_ERROR_MESSAGE = 'Network error';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockQuery.data.set(mockReleaseTogglesData);
    mockQuery.loading.set(false);
    mockQuery.error.set(undefined);
    mockQuery.hasError.set(false);
    mockQuery.called.set(true); // Back to signal.set()

    TestBed.configureTestingModule({
      providers: [
        DhReleaseToggleService,
        { provide: DhApplicationInsights, useValue: mockApplicationInsights },
      ],
    });

    service = TestBed.inject(DhReleaseToggleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DhReleaseToggleService', () => {
    it('should provide toggle state for release decisions', () => {
      // Given: A set of release toggles are configured
      // When: I check various toggle states
      // Then: I get the correct enabled/disabled state
      expect(service.isEnabled('toggle1')).toBe(true);
      expect(service.isEnabled('nonExistentRelease')).toBe(false);
      expect(service.getEnabledToggles()).toContain('featureX');
    });

    it('should support conditional release rollouts', () => {
      // Given: Multiple releases that might be enabled
      // When: I need to check if any experimental releases are enabled
      // Then: I can make decisions based on toggle combinations
      expect(service.hasAnyEnabled(['experimentalRelease', 'toggle1'])).toBe(true);
      expect(service.areAllEnabled(['toggle1', 'featureX'])).toBe(true);
      expect(service.areAllEnabled(['toggle1', 'disabledRelease'])).toBe(false);
    });

    it('should handle release toggle updates in real-time', () => {
      // Given: Initial release configuration
      expect(service.isEnabled('newRelease')).toBe(false);

      // When: Release toggles are updated (simulating server response)
      const updatedToggles: GetReleaseTogglesQuery = {
        __typename: 'Query',
        releaseToggles: ['toggle1', 'newRelease'],
      };
      mockQuery.data.set(updatedToggles);

      // Then: The service reflects the new state immediately
      expect(service.isEnabled('newRelease')).toBe(true);
      expect(service.isEnabled('featureX')).toBe(false); // No longer enabled
    });
  });

  it('should handle server errors gracefully', async () => {
    // Given: The server returns an error
    const serverError = new Error(NETWORK_ERROR_MESSAGE);
    mockQuery.refetch.mockRejectedValue(serverError);

    // When: I try to refresh toggle data
    // Then: The error is propagated but the service remains functional
    await expect(service.refetch()).rejects.toThrow(NETWORK_ERROR_MESSAGE);

    // And: Previous toggle state is still available
    expect(service.isEnabled('toggle1')).toBe(true);
  });

  it('should recover from temporary network issues', async () => {
    // Given: A temporary network failure
    mockQuery.refetch.mockRejectedValueOnce(new Error(NETWORK_ERROR_MESSAGE));

    // When: The first request fails but the second succeeds
    await expect(service.refetch()).rejects.toThrow(NETWORK_ERROR_MESSAGE);

    mockQuery.refetch.mockResolvedValue(mockApolloResult);
    const result = await service.refetch();

    // Then: The service recovers and functions normally
    expect(result.data.releaseToggles).toEqual(MOCK_ENABLED_TOGGLES);
  });

  it('should provide loading state during data fetching', () => {
    // Given: A loading state
    mockQuery.loading.set(true);

    // When: I check the loading status
    // Then: The service indicates it's loading
    expect(service.loading()).toBe(true);

    // When: Loading completes
    mockQuery.loading.set(false);

    // Then: The service indicates loading is complete
    expect(service.loading()).toBe(false);
  });

describe('Loading state behavior', () => {
  it('should show loading state before first query is called', () => {
    // Destroy existing TestBed to get a fresh start
    TestBed.resetTestingModule();

    // Set up mock state BEFORE creating the service
    mockQuery.called.set(false); // Back to signal.set()
    mockQuery.loading.set(false);
    mockQuery.data.set(null);
    mockQuery.error.set(undefined);
    mockQuery.hasError.set(false);

    // Configure TestBed with fresh state
    TestBed.configureTestingModule({
      providers: [
        DhReleaseToggleService,
        { provide: DhApplicationInsights, useValue: mockApplicationInsights },
      ],
    });

    // Create service instance that will see the initial state
    const testService = TestBed.inject(DhReleaseToggleService);

    // Test: Service should report loading=true when called=false
    expect(testService.loading()).toBe(true);
  });

  it('should show normal loading state after query is called', () => {
    // Destroy existing TestBed to get a fresh start
    TestBed.resetTestingModule();

    // Set up mock state BEFORE creating the service - query has been called
    mockQuery.called.set(true); // Back to signal.set()
    mockQuery.loading.set(false);
    mockQuery.data.set(mockReleaseTogglesData);
    mockQuery.error.set(undefined);
    mockQuery.hasError.set(false);

    // Configure TestBed with fresh state
    TestBed.configureTestingModule({
      providers: [
        DhReleaseToggleService,
        { provide: DhApplicationInsights, useValue: mockApplicationInsights },
      ],
    });

    // Create service instance that will see the called=true state
    const testService = TestBed.inject(DhReleaseToggleService);

    // Test: Service should use Apollo's loading state when called=true
    expect(testService.loading()).toBe(false);
  });
});

  it('should handle empty toggle configurations', () => {
    // Given: No toggles are enabled
    mockQuery.data.set({
      __typename: 'Query',
      releaseToggles: [],
    });

    // When: I check for any toggles
    // Then: All checks return appropriate defaults
    expect(service.getEnabledToggles()).toEqual([]);
    expect(service.isEnabled('anyToggle')).toBe(false);
    expect(service.hasAnyEnabled(['feature1', 'feature2'])).toBe(false);
    expect(service.areAllEnabled([])).toBe(true); // Vacuous truth
  });

  it('should handle malformed server responses', () => {
    // Given: Server returns unexpected data
    mockQuery.data.set(null);

    // When: I check toggle states
    // Then: Service provides safe defaults
    expect(service.isEnabled('anyToggle')).toBe(false);
    expect(service.getEnabledToggles()).toEqual([]);
  });

  it('should work with various toggle naming conventions', () => {
    // Given: Toggles with different naming patterns
    mockQuery.data.set({
      __typename: 'Query',
      releaseToggles: [
        'kebab-case-release',
        'snake_case_release',
        'camelCaseRelease',
        'UPPER_CASE_RELEASE',
        'release123',
        'release.with.dots',
      ],
    });

    // When: I check these various toggle formats
    // Then: All are handled correctly
    expect(service.isEnabled('kebab-case-release')).toBe(true);
    expect(service.isEnabled('snake_case_release')).toBe(true);
    expect(service.isEnabled('camelCaseRelease')).toBe(true);
    expect(service.isEnabled('UPPER_CASE_RELEASE')).toBe(true);
    expect(service.isEnabled('release123')).toBe(true);
    expect(service.isEnabled('release.with.dots')).toBe(true);
  });
});
