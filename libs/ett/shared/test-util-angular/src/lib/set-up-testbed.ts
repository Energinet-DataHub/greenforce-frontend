import { ComponentFixtureAutoDetect, getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

export interface TestbedSetupOptions {
  readonly autoDetectChanges?: boolean;
  readonly destroyAfterEach?: boolean;
}

export function setUpTestbed({
  autoDetectChanges = true,
  destroyAfterEach = true,
}: TestbedSetupOptions = {}): void {
  const testbed = getTestBed();

  testbed.resetTestEnvironment();
  testbed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      teardown: {
        destroyAfterEach,
      },
    }
  );
  testbed.configureCompiler({
    providers: [
      { provide: ComponentFixtureAutoDetect, useValue: autoDetectChanges },
    ],
  });
}
