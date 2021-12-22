import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';

import { DanishLocaleModule } from './danish-locale/danish-locale.module';

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
