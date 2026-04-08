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

describe(StateLocationStrategy, () => {
  let strategy: StateLocationStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: { baseURI: '/custom-base-uri' },
        },
        provideStateLocationStrategy(),
      ],
    });

    strategy = TestBed.inject(StateLocationStrategy);
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
    it('should return base href regardless of internal URL', () => {
      expect(strategy.prepareExternalUrl('/users')).toBe(strategy.getBaseHref());
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
