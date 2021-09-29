import { ComponentFixtureAutoDetect, getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

const testbed = getTestBed();

testbed.resetTestEnvironment();
testbed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: {
      destroyAfterEach: true,
    },
  }
);
testbed.configureCompiler({
  providers: [
    {
      provide: ComponentFixtureAutoDetect,
      useValue: true,
    },
  ],
});
