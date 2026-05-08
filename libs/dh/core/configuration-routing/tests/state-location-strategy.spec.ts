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
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT, LocationStrategy } from '@angular/common';

import {
  ROUTER_URL_KEY,
  StateLocationStrategy,
  provideStateLocationStrategy,
} from '../src/state-location-strategy';
import { dhRedactionPatterns } from '../src/dhUrlRules';

describe(StateLocationStrategy, () => {
  let strategy: StateLocationStrategy;

  /** Configures the TestBed with the supplied patterns and returns a fresh strategy. */
  const setupWith = (patterns: readonly string[] = []): StateLocationStrategy => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: { baseURI: '/custom-base-uri' },
        },
        provideStateLocationStrategy(patterns),
      ],
    });
    return TestBed.inject(StateLocationStrategy);
  };

  beforeEach(() => {
    strategy = setupWith();
  });

  describe('path', () => {
    it('should fall back to browser path when no state URL exists', () => {
      const path = strategy.path();
      expect(path).toBe('/');
    });

    it('should return the stored state URL', () => {
      strategy.pushState(null, '', '/users/123', '');
      expect(strategy.path()).toBe('/users/123');
    });

    it('should return URL with query params', () => {
      strategy.pushState(null, '', '/search', 'q=test&page=1');
      expect(strategy.path()).toBe('/search?q=test&page=1');
    });

    it('should include hash when requested', () => {
      strategy.pushState(null, '', '/page#section', '');
      expect(strategy.path(true)).toBe('/page#section');
    });

    it('should strip hash when not requested', () => {
      strategy.pushState(null, '', '/page#section', '');
      expect(strategy.path()).toBe('/page');
    });
  });

  describe('pushState', () => {
    it('should store the URL in state', () => {
      strategy.pushState(null, '', '/dashboard', '');

      const state = strategy.getState() as Record<string, unknown>;
      expect(state[ROUTER_URL_KEY]).toBe('/dashboard');
    });

    it('should preserve user state', () => {
      strategy.pushState({ customData: 'value' }, '', '/page', '');

      const state = strategy.getState() as Record<string, unknown>;
      expect(state['customData']).toBe('value');
      expect(state[ROUTER_URL_KEY]).toBe('/page');
    });

    it('should normalize query params', () => {
      strategy.pushState(null, '', '/api', 'token=abc');

      const state = strategy.getState() as Record<string, unknown>;
      expect(state[ROUTER_URL_KEY]).toBe('/api?token=abc');
    });
  });

  describe('replaceState', () => {
    it('should replace the URL in state', () => {
      strategy.pushState(null, '', '/first', '');
      strategy.replaceState(null, '', '/second', '');

      const state = strategy.getState() as Record<string, unknown>;
      expect(state[ROUTER_URL_KEY]).toBe('/second');
    });

    it('should preserve user state', () => {
      strategy.replaceState({ key: 'preserved' }, '', '/replaced', '');

      const state = strategy.getState() as Record<string, unknown>;
      expect(state['key']).toBe('preserved');
    });
  });

  describe('prepareExternalUrl', () => {
    it('should show URL as-is when no patterns match (default-show)', () => {
      strategy = setupWith([]);
      expect(strategy.prepareExternalUrl('/secret/123')).toBe('/custom-base-uri/secret/123');
    });

    it('redacts URLs matching a pattern', () => {
      strategy = setupWith(['/metering-point/(?!search|create)([^/?#]+)']);

      expect(strategy.prepareExternalUrl('/metering-point/abc-123/master-data')).toBe(
        '/custom-base-uri/metering-point/~/master-data'
      );

      // The internal router URL is still the real one (preserved in state).
      strategy.pushState(null, '', '/metering-point/abc-123/master-data', '');
      expect(strategy.path()).toBe('/metering-point/abc-123/master-data');
    });

    it('skips safe sub-paths via negative lookahead', () => {
      strategy = setupWith(['/metering-point/(?!search|create)([^/?#]+)']);

      expect(strategy.prepareExternalUrl('/metering-point/search')).toBe(
        '/custom-base-uri/metering-point/search'
      );
    });

    it('redacts user IDs in admin paths', () => {
      strategy = setupWith(['/admin/users/details/([^/?#]+)']);

      expect(strategy.prepareExternalUrl('/admin/users/details/abc-user-guid/edit')).toBe(
        '/custom-base-uri/admin/users/details/~/edit'
      );
    });
  });

  describe('cold-load fallback', () => {
    it('returns the browser path when no state and no redaction marker', () => {
      // No prior pushState → state is empty; super.path() returns '/'.
      expect(strategy.path()).toBe('/');
    });

    it('falls back to / when the URL bar contains the redaction marker', () => {
      // Simulate a cold load on a redacted URL by directly invoking the
      // browser's history API (bypassing the strategy, so no state is stashed).
      window.history.replaceState(null, '', '/metering-point/~/master-data');
      strategy = setupWith([]);

      expect(strategy.path()).toBe('/');

      // Restore for other tests.
      window.history.replaceState(null, '', '/');
    });
  });

  describe('url redaction', () => {
    beforeEach(() => {
      strategy = setupWith(dhRedactionPatterns);
    });

    describe('passes through — URLs without sensitive segments', () => {
      const cases: ReadonlyArray<[string, string]> = [
        ['landing', '/'],
        ['grid-areas', '/grid-areas'],
        ['grid-areas with sub-path', '/grid-areas/some-area'],
        ['imbalance-prices', '/imbalance-prices'],
        ['reports', '/reports/overview'],
        ['wholesale calculations', '/wholesale/calculations'],
        ['esett outgoing', '/esett/outgoing-messages'],
        ['message archive', '/message-archive'],
        ['message queue', '/message-queue'],
        ['admin roles', '/admin/roles'],
        ['admin permissions', '/admin/permissions'],
        ['metering-point search', '/metering-point/search'],
        ['metering-point create', '/metering-point/create'],
        ['login', '/login'],
        ['login with query', '/login?dhRedirectTo=%2Fmetering-point%2Fabc'],
        ['unknown future route', '/some-future-feature/abc'],
      ];

      it.each(cases)('passes through %s', (_name, url) => {
        expect(strategy.prepareExternalUrl(url)).toBe(`/custom-base-uri${url}`);
      });
    });

    describe('redacts — sensitive ID segments', () => {
      const cases: ReadonlyArray<[string, string, string]> = [
        [
          'metering-point EM1 ID',
          '/metering-point/123456/master-data',
          '/metering-point/~/master-data',
        ],
        [
          'metering-point EM2 ID',
          '/metering-point/abc1234567/measurements/day',
          '/metering-point/~/measurements/day',
        ],
        [
          'metering-point with query string',
          '/metering-point/abc1234567/measurements/day?filter=2024-01-01',
          '/metering-point/~/measurements/day?filter=2024-01-01',
        ],
        [
          'admin user details',
          '/admin/users/details/00000000-0000-0000-0000-000000000001',
          '/admin/users/details/~',
        ],
        [
          'admin user details edit',
          '/admin/users/details/00000000-0000-0000-0000-000000000001/edit',
          '/admin/users/details/~/edit',
        ],
      ];

      it.each(cases)('redacts %s', (_name, url, expected) => {
        expect(strategy.prepareExternalUrl(url)).toBe(`/custom-base-uri${expected}`);
      });
    });
  });
});

describe('provideStateLocationStrategy', () => {
  it('should provide StateLocationStrategy as LocationStrategy', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: { location: { origin: '' } },
        },
        provideStateLocationStrategy(),
      ],
    });

    const locationStrategy = TestBed.inject(LocationStrategy);
    expect(locationStrategy).toBeInstanceOf(StateLocationStrategy);
  });
});
