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
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import { detectBaseHrefProvider } from './detect-base-href.provider';

@NgModule({
  providers: [detectBaseHrefProvider],
})
export class EttBrowserConfigurationRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: EttBrowserConfigurationRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'EttBrowserConfigurationRootModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

@NgModule()
export class EttBrowserConfigurationModule {
  static forRoot(): ModuleWithProviders<EttBrowserConfigurationRootModule> {
    return {
      ngModule: EttBrowserConfigurationRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import EttBrowserConfigurationModule directly. Use EttBrowserConfigurationModule.forRoot.'
    );
  }
}
