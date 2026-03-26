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
import { inject, Injectable, OnDestroy, Provider, assertInInjectionContext } from '@angular/core';
import {
  APP_BASE_HREF,
  DOCUMENT,
  LocationChangeListener,
  LocationStrategy,
  PlatformLocation,
} from '@angular/common';

/**
 * Key used to store the hidden URL in the history state object.
 * This is prefixed with double underscore to avoid conflicts with user state.
 */
const HIDDEN_URL_KEY = '__hiddenUrl';

/**
 * Key used to store the hash portion of the URL in the history state object.
 */
const HIDDEN_HASH_KEY = '__hiddenHash';

/**
 * Key used to store the session ID in the history state object.
 */
const SESSION_ID_KEY = '__sessionId';

/**
 * Key used to store the session ID in sessionStorage.
 */
const SESSION_STORAGE_KEY = 'dh_routing_session_id';

/**
 * Generates a random session ID using crypto API.
 */
function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Normalizes query parameters by prepending with `?` if needed.
 */
function normalizeQueryParams(params: string): string {
  return params && params[0] !== '?' ? `?${params}` : params;
}

/**
 * Joins two URL path segments with a slash if needed.
 */
function joinWithSlash(start: string, end: string): string {
  if (start.length === 0) {
    return end;
  }
  if (end.length === 0) {
    return start;
  }
  let slashes = 0;
  if (start.endsWith('/')) {
    slashes++;
  }
  if (end.startsWith('/')) {
    slashes++;
  }
  if (slashes === 2) {
    return start + end.substring(1);
  }
  if (slashes === 1) {
    return start + end;
  }
  return start + '/' + end;
}

/**
 * A custom LocationStrategy that hides the URL from the browser's address bar.
 *
 * Instead of displaying the actual route URL in the browser, this strategy:
 * 1. Always shows the base URL (e.g., "/" or the configured base href) in the address bar
 * 2. Stores the actual route path in the `History.state` object
 * 3. Retrieves the route path from `History.state` when needed for routing decisions
 *
 * This is useful for security requirements where URLs should not be visible to users
 * or recorded in browser history as readable paths.
 *
 * @usageNotes
 *
 * To use this strategy, provide it as the `LocationStrategy` in your application:
 *
 * ```typescript
 * import { LocationStrategy } from '@angular/common';
 * import { HiddenLocationStrategy } from '@energinet-datahub/dh/core/routing';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     { provide: LocationStrategy, useClass: HiddenLocationStrategy },
 *     // ... other providers
 *   ],
 * });
 * ```
 *
 * @publicApi
 */
@Injectable({ providedIn: 'root' })
export class HiddenLocationStrategy extends LocationStrategy implements OnDestroy {
  private readonly platformLocation = inject(PlatformLocation);
  private readonly baseHref: string;
  private readonly removeListenerFns: Array<() => void> = [];
  private readonly document = inject(DOCUMENT);
  private sessionId: string;

  constructor() {
    super();

    // Get the base href from APP_BASE_HREF token, or from DOM, or from document origin
    const href = inject(APP_BASE_HREF, { optional: true });
    this.baseHref =
      href ?? this.platformLocation.getBaseHrefFromDOM() ?? this.document.location?.origin ?? '';

    // Initialize or retrieve session ID
    this.sessionId = this.initializeSessionId();

    // Initialize the hidden URL from current browser state if not already set
    this.initializeHiddenUrl();
  }

  /**
   * Initializes the session ID from sessionStorage or creates a new one.
   * @returns The current session ID.
   */
  private initializeSessionId(): string {
    const existingSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existingSessionId) {
      return existingSessionId;
    }

    const newSessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    return newSessionId;
  }

  /**
   * Clears the current session, causing all existing history entries to become invalid.
   * Call this method on logout to prevent back navigation to authenticated routes.
   *
   * @usageNotes
   *
   * ```typescript
   * import { LocationStrategy } from '@angular/common';
   * import { HiddenLocationStrategy } from '@energinet-datahub/dh/core/routing';
   *
   * @Injectable({ providedIn: 'root' })
   * export class AuthService {
   *   private locationStrategy = inject(LocationStrategy) as HiddenLocationStrategy;
   *
   *   logout(): void {
   *     // Clear the session to invalidate history entries
   *     this.locationStrategy.clearSession();
   *     // Perform other logout logic...
   *   }
   * }
   * ```
   */
  clearSession(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    // Generate a new session ID for any subsequent navigations
    this.sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, this.sessionId);
  }

  /**
   * Validates that the given state has a matching session ID.
   * @param state The history state to validate.
   * @returns True if the session ID matches, false otherwise.
   */
  private isValidSession(state: Record<string, unknown> | null): boolean {
    if (!state || typeof state[SESSION_ID_KEY] !== 'string') {
      return false;
    }
    return state[SESSION_ID_KEY] === this.sessionId;
  }

  /**
   * Initializes the hidden URL from the current browser location on first load.
   * This handles the case where the user navigates directly to a URL or refreshes the page.
   */
  private initializeHiddenUrl(): void {
    const currentState = this.platformLocation.getState() as Record<string, unknown> | null;

    // If we already have a hidden URL in state with a valid session, we're good
    if (
      currentState &&
      typeof currentState[HIDDEN_URL_KEY] === 'string' &&
      this.isValidSession(currentState)
    ) {
      return;
    }

    // Otherwise, capture the current pathname as the hidden URL and reset the visible URL
    const currentPath =
      this.platformLocation.pathname + this.platformLocation.search + this.platformLocation.hash;

    const newState = {
      ...(currentState || {}),
      [HIDDEN_URL_KEY]: currentPath,
      [HIDDEN_HASH_KEY]: this.platformLocation.hash || '',
      [SESSION_ID_KEY]: this.sessionId,
    };

    // Replace the current state with our hidden URL state, showing only base href
    this.platformLocation.replaceState(newState, '', this.baseHref || '/');
  }

  /** @docs-private */
  ngOnDestroy(): void {
    while (this.removeListenerFns.length) {
      this.removeListenerFns.pop()?.();
    }
  }

  /**
   * Registers a callback to be called when the browser's popstate event is fired.
   * If the session ID doesn't match, redirects to root.
   * @param fn The callback function to invoke on popstate events.
   */
  onPopState(fn: LocationChangeListener): void {
    const wrappedFn: LocationChangeListener = (event) => {
      const state = this.platformLocation.getState() as Record<string, unknown> | null;

      // Check if the session ID matches
      if (!this.isValidSession(state)) {
        // Invalid session - redirect to root
        const newState = {
          [HIDDEN_URL_KEY]: '/',
          [HIDDEN_HASH_KEY]: '',
          [SESSION_ID_KEY]: this.sessionId,
        };
        this.platformLocation.replaceState(newState, '', this.baseHref || '/');

        // Call the listener with the modified state to trigger navigation to root
        fn({
          type: event.type,
          state: newState,
        });
        return;
      }

      // Valid session - proceed normally
      fn(event);
    };

    this.removeListenerFns.push(
      this.platformLocation.onPopState(wrappedFn),
      this.platformLocation.onHashChange(wrappedFn)
    );
  }

  /**
   * Returns the base href configured for the application.
   */
  getBaseHref(): string {
    return this.baseHref;
  }

  /**
   * Prepares an external URL for display.
   * Since we're hiding URLs, this always returns the base href.
   * @param internal The internal URL to prepare.
   * @returns The base href (hides the actual URL).
   */
  prepareExternalUrl(internal: string): string {
    // For external use (e.g., links), we could optionally return the full URL
    // But for the POC, we return the base href to hide the URL
    return joinWithSlash(this.baseHref, internal);
  }

  /**
   * Returns the current route path from the history state.
   * @param includeHash Whether to include the hash fragment.
   * @returns The current route path stored in history state.
   */
  path(includeHash = false): string {
    const state = this.platformLocation.getState() as Record<string, unknown> | null;

    if (!state || typeof state[HIDDEN_URL_KEY] !== 'string') {
      // Fallback: return empty path if no hidden URL is stored
      return '';
    }

    const hiddenUrl = state[HIDDEN_URL_KEY] as string;
    const hiddenHash = (state[HIDDEN_HASH_KEY] as string) || '';

    if (includeHash && hiddenHash) {
      // If hash is not already in the URL, append it
      if (!hiddenUrl.includes('#')) {
        return hiddenUrl + hiddenHash;
      }
    }

    return hiddenUrl;
  }

  /**
   * Pushes a new state onto the browser history.
   * The URL is stored in the state object, not in the visible URL.
   * @param state The state object to push.
   * @param title The title for the history entry (typically ignored by browsers).
   * @param url The route URL to store in state.
   * @param queryParams Query parameters to append to the URL.
   */
  pushState(state: unknown, title: string, url: string, queryParams: string): void {
    const fullUrl = url + normalizeQueryParams(queryParams);

    // Extract hash from the URL if present
    const hashIndex = fullUrl.indexOf('#');
    const hash = hashIndex >= 0 ? fullUrl.substring(hashIndex) : '';

    const newState = {
      ...(state as Record<string, unknown> | null),
      [HIDDEN_URL_KEY]: fullUrl,
      [HIDDEN_HASH_KEY]: hash,
      [SESSION_ID_KEY]: this.sessionId,
    };

    // Push state but keep the visible URL as the base href
    this.platformLocation.pushState(newState, title, this.baseHref || '/');
  }

  /**
   * Replaces the current state in the browser history.
   * The URL is stored in the state object, not in the visible URL.
   * @param state The state object to set.
   * @param title The title for the history entry (typically ignored by browsers).
   * @param url The route URL to store in state.
   * @param queryParams Query parameters to append to the URL.
   */
  replaceState(state: unknown, title: string, url: string, queryParams: string): void {
    const fullUrl = url + normalizeQueryParams(queryParams);

    // Extract hash from the URL if present
    const hashIndex = fullUrl.indexOf('#');
    const hash = hashIndex >= 0 ? fullUrl.substring(hashIndex) : '';

    const newState = {
      ...(state as Record<string, unknown> | null),
      [HIDDEN_URL_KEY]: fullUrl,
      [HIDDEN_HASH_KEY]: hash,
      [SESSION_ID_KEY]: this.sessionId,
    };

    // Replace state but keep the visible URL as the base href
    this.platformLocation.replaceState(newState, title, this.baseHref || '/');
  }

  /**
   * Navigates forward in the browser history.
   */
  forward(): void {
    this.platformLocation.forward();
  }

  /**
   * Navigates back in the browser history.
   */
  back(): void {
    this.platformLocation.back();
  }

  /**
   * Returns the current history state.
   * This returns the full state object, including the hidden URL.
   */
  getState(): unknown {
    return this.platformLocation.getState();
  }

  /**
   * Navigates to a specific point in the browser history.
   * @param relativePosition The number of entries to move (negative for back, positive for forward).
   */
  override historyGo(relativePosition = 0): void {
    this.platformLocation.historyGo?.(relativePosition);
  }
}

/**
 * Provides the HiddenLocationStrategy as the LocationStrategy for the application.
 *
 * @usageNotes
 *
 * Add this to your application's providers array:
 *
 * ```typescript
 * import { provideHiddenLocationStrategy } from '@energinet-datahub/dh/core/routing';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideHiddenLocationStrategy(),
 *     provideRouter(routes),
 *     // ... other providers
 *   ],
 * });
 * ```
 *
 * @returns A provider that configures HiddenLocationStrategy as the LocationStrategy.
 *
 * @publicApi
 */
export function provideHiddenLocationStrategy(): Provider {
  return { provide: LocationStrategy, useClass: HiddenLocationStrategy };
}

/**
 * Injects the HiddenLocationStrategy instance.
 *
 * This is a convenience function that provides typed access to the HiddenLocationStrategy,
 * including the `clearSession()` method, without needing to cast from LocationStrategy.
 *
 * @usageNotes
 *
 * Use this in services or components that need to clear the session (e.g., on logout):
 *
 * ```typescript
 * import { injectHiddenLocationStrategy } from '@energinet-datahub/dh/core/routing';
 *
 * @Injectable({ providedIn: 'root' })
 * export class AuthService {
 *   private hiddenLocationStrategy = injectHiddenLocationStrategy();
 *
 *   logout(): void {
 *     // Clear the session to invalidate history entries
 *     this.hiddenLocationStrategy.clearSession();
 *     // Perform other logout logic...
 *   }
 * }
 * ```
 *
 * @returns The HiddenLocationStrategy instance.
 * @throws Error if called outside of an injection context.
 *
 * @publicApi
 */
export function injectHiddenLocationStrategy(): HiddenLocationStrategy {
  assertInInjectionContext(injectHiddenLocationStrategy);
  const locationStrategy = inject(LocationStrategy);

  if (!(locationStrategy instanceof HiddenLocationStrategy)) {
    throw new Error(
      'injectHiddenLocationStrategy() requires HiddenLocationStrategy to be provided. ' +
        'Make sure to use provideHiddenLocationStrategy() in your application providers.'
    );
  }

  return locationStrategy;
}
