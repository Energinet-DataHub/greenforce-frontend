/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
      EttBrowserConfigurationModule.forRoot(),
      ...(config.defaultImports ?? []),
    ],
  });
}
