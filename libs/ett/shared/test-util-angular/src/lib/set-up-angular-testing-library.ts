import { NgModule } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { EttBrowserConfigurationModule } from '@energinet-datahub/ett/core/util-browser';
import { Config, configure } from '@testing-library/angular';

import { TestbedSetupOptions } from './set-up-testbed';

export function setUpAngularTestingLibrary(
  config: Partial<Config> = {},
  { autoDetectChanges = true }: TestbedSetupOptions = {}
): void {
  @NgModule({
    providers: [
      { provide: ComponentFixtureAutoDetect, useValue: autoDetectChanges },
    ],
  })
  class ComponentFixtureAutoDetectModule {}

  configure({
    // Assume SCAMs
    excludeComponentDeclaration: false,
    ...config,
    defaultImports: [
      ComponentFixtureAutoDetectModule,
      EttBrowserConfigurationModule,
      ...(config.defaultImports ?? []),
    ],
  });
}
