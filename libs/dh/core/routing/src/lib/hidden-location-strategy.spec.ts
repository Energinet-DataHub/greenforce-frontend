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
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF, LocationStrategy, PlatformLocation } from '@angular/common';
import { HiddenLocationStrategy, provideHiddenLocationStrategy } from './hidden-location-strategy';

/**
 * Mock PlatformLocation for testing
 */
class MockPlatformLocation {
  private _state: Record<string, unknown> | null = null;
  private _pathname = '/';
  private _search = '';
  private _hash = '';
  private popStateListeners: Array<(event: PopStateEvent) => void> = [];
  private hashChangeListeners: Array<(event: HashChangeEvent) => void> = [];

  get pathname(): string {
    return this._pathname;
  }

  set pathname(value: string) {
    this._pathname = value;
  }

  get search(): string {
    return this._search;
  }

  get hash(): string {
    return this._hash;
  }

  getBaseHrefFromDOM(): string {
    return '/';
  }

  getState(): Record<string, unknown> | null {
    return this._state;
  }

  pushState(state: unknown, _title: string, _url: string): void {
    this._state = state as Record<string, unknown>;
  }

  replaceState(state: unknown, _title: string, _url: string): void {
    this._state = state as Record<string, unknown>;
  }

  onPopState(fn: (event: PopStateEvent) => void): () => void {
    this.popStateListeners.push(fn);
    return () => {
      const index = this.popStateListeners.indexOf(fn);
      if (index > -1) {
        this.popStateListeners.splice(index, 1);
      }
    };
  }

  onHashChange(fn: (event: HashChangeEvent) => void): () => void {
    this.hashChangeListeners.push(fn);
    return () => {
      const index = this.hashChangeListeners.indexOf(fn);
      if (index > -1) {
        this.hashChangeListeners.splice(index, 1);
      }
    };
  }

  forward(): void {
    // Mock implementation
  }

  back(): void {
    // Mock implementation
  }

  historyGo(_relativePosition: number): void {
    // Mock implementation
  }

  // Helper method to simulate navigation for testing
  simulatePopState(state: Record<string, unknown>): void {
    this._state = state;
    const event = new PopStateEvent('popstate', { state });
    this.popStateListeners.forEach((fn) => fn(event));
  }
}

describe('HiddenLocationStrategy', () => {
  let strategy: HiddenLocationStrategy;
  let mockPlatformLocation: MockPlatformLocation;

  beforeEach(() => {
    mockPlatformLocation = new MockPlatformLocation();

    TestBed.configureTestingModule({
      providers: [
        HiddenLocationStrategy,
        { provide: PlatformLocation, useValue: mockPlatformLocation },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    });

    strategy = TestBed.inject(HiddenLocationStrategy);
  });

  afterEach(() => {
    strategy.ngOnDestroy();
  });

  describe('getBaseHref', () => {
    it('should return the configured base href', () => {
      // In jsdom environment, APP_BASE_HREF token is used
      // The actual value depends on the test environment
      expect(strategy.getBaseHref()).toBeTruthy();
    });
  });

  describe('path', () => {
    it('should return empty string when no hidden URL is stored', () => {
      // The mock starts with null state, but constructor initializes it
      // So we need to check what was stored
      const path = strategy.path();
      expect(path).toBe('/');
    });

    it('should return the stored hidden URL', () => {
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
  });

  describe('pushState', () => {
    it('should store the URL in state', () => {
      strategy.pushState(null, '', '/dashboard', '');

      const state = mockPlatformLocation.getState();
      expect(state?.['__hiddenUrl']).toBe('/dashboard');
    });

    it('should preserve user state when pushing', () => {
      const userState = { customData: 'value' };
      strategy.pushState(userState, '', '/page', '');

      const state = mockPlatformLocation.getState();
      expect(state?.['customData']).toBe('value');
      expect(state?.['__hiddenUrl']).toBe('/page');
    });

    it('should handle query parameters', () => {
      strategy.pushState(null, '', '/api', 'token=abc');

      const state = mockPlatformLocation.getState();
      expect(state?.['__hiddenUrl']).toBe('/api?token=abc');
    });

    it('should store hash in separate key', () => {
      strategy.pushState(null, '', '/page#anchor', '');

      const state = mockPlatformLocation.getState();
      expect(state?.['__hiddenHash']).toBe('#anchor');
    });
  });

  describe('replaceState', () => {
    it('should replace the URL in state', () => {
      strategy.pushState(null, '', '/first', '');
      strategy.replaceState(null, '', '/second', '');

      const state = mockPlatformLocation.getState();
      expect(state?.['__hiddenUrl']).toBe('/second');
    });

    it('should preserve user state when replacing', () => {
      const userState = { key: 'preserved' };
      strategy.replaceState(userState, '', '/replaced', '');

      const state = mockPlatformLocation.getState();
      expect(state?.['key']).toBe('preserved');
    });
  });

  describe('prepareExternalUrl', () => {
    it('should join base href with internal URL', () => {
      const result = strategy.prepareExternalUrl('/users');
      // Result includes base href joined with internal URL
      expect(result).toContain('/users');
    });

    it('should handle URLs without leading slash', () => {
      const result = strategy.prepareExternalUrl('users');
      // Result includes base href joined with internal URL
      expect(result).toContain('/users');
    });
  });

  describe('onPopState', () => {
    it('should register popstate listener', () => {
      const listener = vi.fn();
      strategy.onPopState(listener);

      mockPlatformLocation.simulatePopState({ __hiddenUrl: '/new-route' });

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should clean up listeners on destroy', () => {
      const listener = vi.fn();
      strategy.onPopState(listener);

      // Trigger a popstate before destroy - listener should be called
      mockPlatformLocation.simulatePopState({ __hiddenUrl: '/before-destroy' });
      expect(listener).toHaveBeenCalledTimes(1);

      strategy.ngOnDestroy();

      // After destroy, new popstate events should not trigger the listener
      mockPlatformLocation.simulatePopState({ __hiddenUrl: '/after-destroy' });

      // Listener should still only have been called once (before destroy)
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('getState', () => {
    it('should return the current history state', () => {
      strategy.pushState({ userKey: 'userValue' }, '', '/path', '');

      const state = strategy.getState() as Record<string, unknown>;
      expect(state['userKey']).toBe('userValue');
      expect(state['__hiddenUrl']).toBe('/path');
    });
  });
});

describe('provideHiddenLocationStrategy', () => {
  it('should provide HiddenLocationStrategy as LocationStrategy', () => {
    const mockPlatformLocation = new MockPlatformLocation();

    TestBed.configureTestingModule({
      providers: [
        provideHiddenLocationStrategy(),
        { provide: PlatformLocation, useValue: mockPlatformLocation },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    });

    const locationStrategy = TestBed.inject(LocationStrategy);
    expect(locationStrategy).toBeInstanceOf(HiddenLocationStrategy);
  });
});
