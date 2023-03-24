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
import { dhTranslocoHttpLoaderProvider } from '@energinet-datahub/dh/globalization/data-access-localization';
import { DisplayLanguage } from '@energinet-datahub/dh/globalization/domain';
import { environment } from '@energinet-datahub/dh/shared/environments';
import { TRANSLOCO_CONFIG, translocoConfig, TranslocoModule } from '@ngneat/transloco';

export const dhTranslocoConfig = {
  availableLangs: [DisplayLanguage.Danish, DisplayLanguage.English],
  defaultLang: DisplayLanguage.Danish,
  fallbackLang: [DisplayLanguage.Danish, DisplayLanguage.English],
  flatten: {
    aot: environment.production,
  },
  missingHandler: {
    useFallbackTranslation: true,
  },
  // Remove this option if your application doesn't support changing language in runtime.
  reRenderOnLangChange: true,
  prodMode: environment.production,
};

@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig(dhTranslocoConfig),
    },
    dhTranslocoHttpLoaderProvider,
  ],
})
export class DhTranslocoRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: DhTranslocoRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'DhTranslocoModule.forRoot registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }
  }
}
/**
 * Do not import directly. Use `DhTranslocoModule.forRoot`.
 */
@NgModule()
export class DhTranslocoModule {
  /**
   * Registers root-level HTTP dependencies.
   */
  static forRoot(): ModuleWithProviders<DhTranslocoRootModule> {
    return {
      ngModule: DhTranslocoRootModule,
    };
  }

  constructor() {
    throw new Error('Do not import DhTranslocoModule directly. Use DhTranslocoModule.forRoot.');
  }
}
