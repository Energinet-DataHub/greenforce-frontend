import {
  ComponentFixtureAutoDetect,
  getTestBed,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';

import { gfAngularMaterialTestingProviders } from './angular-material/gf-angular-material-testing.module';
import { gfRxAngularTestingProviders } from './rx-angular/gf-rx-angular-testing.providers';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 */
import 'zone.js/plugins/zone-error';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

function patchTestbed(): void {
  const isUnpatched = testbed.configureTestingModule === realConfigureTestingModule;

  if (isUnpatched) {
    testbed.configureTestingModule = (moduleDef: TestModuleMetadata): TestBed => {
      realConfigureTestingModule.call(testbed, {
        ...moduleDef,
        imports: [
          MatIconTestingModule,
          NoopAnimationsModule,
          RouterTestingModule,
          ...(moduleDef.imports ?? []),
        ],
        providers: [
          // Use automatic change detection in tests
          { provide: ComponentFixtureAutoDetect, useValue: true },
          ...(moduleDef.providers ?? []),
          browserConfigurationProviders,
          gfRxAngularTestingProviders,
          gfAngularMaterialTestingProviders,
        ],
      });
      return testbed;
    };

    // Run at least once in case `TestBed.inject` is called without calling
    // `TestBed.configureTestingModule`
    beforeEach(() => {
      testbed.configureTestingModule({});
    });
  }
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
 * Automatically import testing Angular modules for Angular Material and
 * RxAngular.
 *
 *
 */
export function setUpTestbed(): void {
  testbed.resetTestEnvironment();
  testbed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: {
      destroyAfterEach: true,
    },
  });

  patchTestbed();
}

const testbed = getTestBed();
const realConfigureTestingModule = getTestBed().configureTestingModule;
