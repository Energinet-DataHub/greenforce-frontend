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
  ErrorHandler,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { applicationInsightsInitializer } from './dh-application-insights.initializer';

@NgModule({
  providers: [
    applicationInsightsInitializer,
    {
      provide: ErrorHandler,
      useClass: ApplicationinsightsAngularpluginErrorService,
    },
  ],
})
export class DhSharedConfigurationApplicationInsightsRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: DhSharedConfigurationApplicationInsightsRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'DhSharedConfigurationApplicationInsightsRootModule.forRoot() registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `DhSharedConfigurationApplicationInsightsModule.forRoot()`.
 */
@NgModule()
export class DhSharedConfigurationApplicationInsightsModule {
  static forRoot(): ModuleWithProviders<DhSharedConfigurationApplicationInsightsRootModule> {
    return {
      ngModule: DhSharedConfigurationApplicationInsightsRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import DhSharedConfigurationApplicationInsightsModule directly. Use DhSharedConfigurationApplicationInsightsModule.forRoot().'
    );
  }
}
