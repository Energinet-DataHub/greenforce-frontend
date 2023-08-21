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
import { HttpClient } from '@angular/common/http';
import { inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { ApiModule } from '@energinet-datahub/dh/shared/domain/api';
import { Configuration } from '@energinet-datahub/dh/shared/domain/configuration';

/**
 * Do not import directly. Use `DhApiModule.forRoot`.
 */
@NgModule({
  imports: [
    ApiModule.forRoot(
      () =>
        new Configuration({
          basePath: inject(dhApiEnvironmentToken).apiBase,
        })
    ),
  ],
})
export class DhApiRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: DhApiRootModule,
    @Optional()
    maybeHttp?: HttpClient
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'DhApiRootModule.forRoot registered in multiple injectors. Only call it from the core shell module or in the Angular testing module.'
      );
    }

    if (!maybeHttp) {
      throw new Error(
        'HttpClientModule has not been imported. Import it in the core shell module or the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `DhApiModule.forRoot`.
 */
@NgModule()
export class DhApiModule {
  /**
   * Registers root-level DataHub API dependencies.
   */
  static forRoot(): ModuleWithProviders<DhApiRootModule> {
    return {
      ngModule: DhApiRootModule,
    };
  }

  constructor() {
    throw new Error('Do not import DhApiModule directly. Use DhApiModule.forRoot.');
  }
}
