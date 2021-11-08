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
import { HttpClientModule } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  ettAuthenticationInterceptorProvider,
  ettAuthorizationInterceptorProvider,
} from '@energinet-datahub/ett/security/data-access-security';

/**
 * Do not import directly. Use `EttHttpModule.forRoot`.
 */
@NgModule({
  imports: [HttpClientModule],
  providers: [
    ettAuthenticationInterceptorProvider,
    ettAuthorizationInterceptorProvider,
  ],
})
export class EttHttpRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: EttHttpRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'EttHttpModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `EttHttpModule.forRoot`.
 */
@NgModule()
export class EttHttpModule {
  /**
   * Registers root-level HTTP dependencies.
   */
  static forRoot(): ModuleWithProviders<EttHttpRootModule> {
    return {
      ngModule: EttHttpRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import EttHttpModule directly. Use EttHttpModule.forRoot.'
    );
  }
}
