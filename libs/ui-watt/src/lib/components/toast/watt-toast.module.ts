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
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { WattToastComponent } from './watt-toast.component';

@NgModule({
  imports: [MatSnackBarModule, WattToastComponent],
})
export class WattToastRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: WattToastRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'WattToastRootModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}

/**
 * Do not import directly. Use `WattToastModule.forRoot`.
 */
@NgModule()
export class WattToastModule {
  /**
   * Registers root-level dependencies.
   */
  static forRoot(): ModuleWithProviders<WattToastModule> {
    return {
      ngModule: WattToastRootModule,
    };
  }

  constructor() {
    throw new Error('Do not import WattToastModule directly. Use WattToastModule.forRoot.');
  }
}
