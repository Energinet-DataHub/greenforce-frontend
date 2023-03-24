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
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { detectBaseHrefProvider } from './detect-base-href.provider';

/**
 * Do not import directly, use `GfBrowserConfigurationModule.forRoot`.
 */
@NgModule({
  providers: [detectBaseHrefProvider],
})
export class GfBrowserConfigurationRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: GfBrowserConfigurationRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'GfBrowserConfigurationModule.forRoot is registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly, use `GfBrowserConfigurationModule.forRoot`.
 */
@NgModule()
export class GfBrowserConfigurationModule {
  /**
   * Provides `APP_BASE_HREF` at runtime.
   */
  static forRoot(): ModuleWithProviders<GfBrowserConfigurationRootModule> {
    return {
      ngModule: GfBrowserConfigurationRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import GfBrowserConfigurationModule directly. Use GfBrowserConfigurationModule.forRoot.'
    );
  }
}
