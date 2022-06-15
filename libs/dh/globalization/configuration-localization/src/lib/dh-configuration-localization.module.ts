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
import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';

import { DanishLocaleModule } from '@energinet-datahub/gf/configuration-danish-locale';

@NgModule({
  imports: [DanishLocaleModule],
})
export class DhConfigurationLocalizationRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: DhConfigurationLocalizationRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'DhConfigurationLocalizationRootModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `DhConfigurationLocalization.forRoot`.
 */
@NgModule()
export class DhConfigurationLocalizationModule {
  /**
   * Registers root-level HTTP dependencies.
   */
  static forRoot(): ModuleWithProviders<DhConfigurationLocalizationModule> {
    return {
      ngModule: DhConfigurationLocalizationRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import DhConfigurationLocalizationModule directly. Use DhConfigurationLocalizationModule.forRoot.'
    );
  }
}
