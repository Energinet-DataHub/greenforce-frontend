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
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDateFnsModule, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import * as daLocale from 'date-fns/locale/da/index.js';

import { WattDateAdapter } from './watt-date-adapter';

@NgModule({
  imports: [MatDateFnsModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: daLocale },
    {
      provide: DateAdapter,
      useClass: WattDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
  ],
})
export class WattDanishDatetimeRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: WattDanishDatetimeRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'WattDanishDatetimeRootModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `WattDanishDatetimeModule.forRoot`.
 */
@NgModule()
export class WattDanishDatetimeModule {
  /**
   * Registers root-level dependencies.
   */
  static forRoot(): ModuleWithProviders<WattDanishDatetimeModule> {
    return {
      ngModule: WattDanishDatetimeRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import WattDanishDatetimeModule directly. Use WattDanishDatetimeModule.forRoot.'
    );
  }
}
