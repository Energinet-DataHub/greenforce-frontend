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
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';

import { DhReleaseToggleService } from './dh-release-toggle.service';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

describe('DhReleaseToggleService', () => {
  let service: DhReleaseToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DhReleaseToggleService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideApollo(() => {
          const httpLink = TestBed.inject(HttpLink);
          return {
            link: httpLink.create({ uri: '/graphql' }),
            cache: new InMemoryCache(),
          };
        }),
        {
          provide: DhApplicationInsights,
          useValue: {
            trackException: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(DhReleaseToggleService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have all required methods', () => {
      expect(service.isEnabled).toBeDefined();
      expect(service.getEnabledToggles).toBeDefined();
      expect(service.hasAnyEnabled).toBeDefined();
      expect(service.areAllEnabled).toBeDefined();
      expect(service.refetch).toBeDefined();
    });

    it('should have all required signals', () => {
      expect(service.toggles).toBeDefined();
      expect(service.loading).toBeDefined();
      expect(service.error).toBeDefined();
      expect(service.hasError).toBeDefined();
    });
  });

  describe('Initial State', () => {
    it('should start with loading state', () => {
      // When the service is first created, it should be in loading state
      // because the query hasn't completed yet
      expect(service.loading()).toBe(true);
    });

    it('should start with empty toggles', () => {
      expect(service.getEnabledToggles()).toEqual([]);
    });

    it('should return false for any toggle check initially', () => {
      expect(service.isEnabled('anyToggle')).toBe(false);
    });

    it('should handle hasAnyEnabled correctly with empty state', () => {
      expect(service.hasAnyEnabled(['toggle1', 'toggle2'])).toBe(false);
      expect(service.hasAnyEnabled([])).toBe(false);
    });

    it('should handle areAllEnabled correctly with empty state', () => {
      expect(service.areAllEnabled(['toggle1', 'toggle2'])).toBe(false);
      expect(service.areAllEnabled([])).toBe(true); // vacuous truth
    });
  });

  describe('Method Return Types', () => {
    it('should return boolean from isEnabled', () => {
      const result = service.isEnabled('test');
      expect(typeof result).toBe('boolean');
    });

    it('should return array from getEnabledToggles', () => {
      const result = service.getEnabledToggles();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return boolean from hasAnyEnabled', () => {
      const result = service.hasAnyEnabled(['test']);
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean from areAllEnabled', () => {
      const result = service.areAllEnabled(['test']);
      expect(typeof result).toBe('boolean');
    });

    it('should return promise from refetch', () => {
      const result = service.refetch();
      expect(result).toBeDefined();
      expect(result.then).toBeDefined();
      expect(result.catch).toBeDefined();
    });
  });

  describe('Signal Types', () => {
    it('should return function from toggles signal', () => {
      expect(typeof service.toggles).toBe('function');
      const value = service.toggles();
      expect(Array.isArray(value)).toBe(true);
    });

    it('should return function from loading signal', () => {
      expect(typeof service.loading).toBe('function');
      const value = service.loading();
      expect(typeof value).toBe('boolean');
    });

    it('should return function from error signal', () => {
      expect(typeof service.error).toBe('function');
    });

    it('should return function from hasError signal', () => {
      expect(typeof service.hasError).toBe('function');
      const value = service.hasError();
      expect(typeof value).toBe('boolean');
    });
  });
});
