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
import { afterEach, beforeEach } from 'vitest';

import {
  ComponentFixtureAutoDetect,
  getTestBed,
  TestBed,
  TestModuleMetadata,
  ɵgetCleanupHook as getCleanupHook,
} from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 */
import 'zone.js/plugins/zone-error';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

/**
 * Set up localStorage mock for test environments where it may not be available.
 */
function setupLocalStorageMock(): void {
  if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage?.getItem) {
    const store: Record<string, string> = {};
    globalThis.localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    };
  }
}

/**
 * Patch MutationObserver so that instances always expose `observe`,
 * `disconnect`, and `takeRecords` as proper functions.
 *
 * happy-dom's MutationObserver implementation may return instances whose
 * methods are undefined or non-callable, which causes:
 * - Angular CDK's OverlayRef._completeDetachContent to throw on `disconnect`
 * - @testing-library/dom's waitFor to throw on `observe`
 *
 * We also need to patch `window.MutationObserver` (used by
 * `@testing-library/dom` via `getWindowFromNode`) in addition to
 * `globalThis.MutationObserver`.
 */
function patchMutationObserver(): void {
  if (typeof MutationObserver === 'undefined') return;

  const OriginalMutationObserver = MutationObserver;

  class PatchedMutationObserver extends OriginalMutationObserver {
    override observe(target: Node, options?: MutationObserverInit): void {
      try {
        super.observe(target, options);
      } catch {
        // swallow — happy-dom may throw on observe
      }
    }

    override disconnect(): void {
      try {
        super.disconnect();
      } catch {
        // swallow — happy-dom may throw on disconnect
      }
    }

    override takeRecords(): MutationRecord[] {
      try {
        return super.takeRecords();
      } catch {
        return [];
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).MutationObserver = PatchedMutationObserver;

  // @testing-library/dom reads MutationObserver from window via
  // getWindowFromNode(container), so we must also patch it there.
  if (typeof window !== 'undefined' && window !== (globalThis as unknown)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).MutationObserver = PatchedMutationObserver;
  }
}

/**
 * Disable CSS animations and transitions in tests by injecting a global style.
 * This is the modern replacement for provideNoopAnimations() which is deprecated in Angular 20.2.
 */
function disableAnimationsInTests(): void {
  const styleId = 'gf-test-disable-animations';
  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Symbol used to mark a patched configureTestingModule so we can detect it
// across setup file re-evaluations (which happen with isolate: false).
const PATCHED_MARKER = Symbol.for('gf-testbed-patched');

function patchTestbed(): void {
  // With isolate: false, setup files are re-evaluated on every test file while
  // the TestBed singleton persists. After initTestEnvironment(), the TestBed's
  // configureTestingModule instance property may still be a previously-patched
  // wrapper. Detect that via the PATCHED_MARKER to avoid double-wrapping.
  const currentCTM = testbed.configureTestingModule as typeof testbed.configureTestingModule & {
    [PATCHED_MARKER]?: true;
  };
  if (currentCTM[PATCHED_MARKER]) {
    // Already patched — re-register the beforeEach/afterEach for this file
    // context (clearCollectorContext wiped the previous registrations) but do
    // NOT re-wrap configureTestingModule.
    beforeEach(() => testbed.configureTestingModule({}));
    afterEach(getCleanupHook(true));
    return;
  }

  // First time patching in this process: capture the real Angular CTM.
  const realCTM = testbed.configureTestingModule;

  const patched = (moduleDef: TestModuleMetadata): TestBed => {
    realCTM.call(testbed, {
      ...moduleDef,
      imports: [MatIconTestingModule, ...(moduleDef.imports ?? [])],
      providers: [
        // Use automatic change detection in tests
        { provide: ComponentFixtureAutoDetect, useValue: true },
        ...(moduleDef.providers ?? []),
        browserConfigurationProviders,
        // Mark as NoopAnimations for Angular Material components that check this token
        { provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' },
        provideRouter([]),
      ],
    });

    return testbed;
  };
  (patched as typeof patched & { [PATCHED_MARKER]?: true })[PATCHED_MARKER] = true;
  testbed.configureTestingModule = patched;

  // Run at least once in case `TestBed.inject` is called without calling
  // `TestBed.configureTestingModule`
  beforeEach(() => testbed.configureTestingModule({}));
}

/**
 * This function must be called in all `test-setup.ts` files to ensure
 * consistent test runs.
 *
 * Use Angular testing module teardown.
 *
 * Use automatic change detection in tests
 *
 * Disable animations, provide `APP_BASE_HREF` at runtime, and isolate routing
 * from the DOM.
 *
 * Automatically import testing Angular modules for Angular Material.
 */
export function setUpTestbed(): void {
  // Set up browser API mocks before initializing testbed
  setupLocalStorageMock();
  patchMutationObserver();

  testbed.resetTestEnvironment();
  testbed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: {
      destroyAfterEach: true,
    },
  });

  // Disable CSS animations in tests
  disableAnimationsInTests();

  patchTestbed();
}

const testbed = getTestBed();
