import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';

import { DhApplicationInsights } from './dh-application-insights.service';

@NgModule()
export class DhSharedUtilApplicationInsightsRootModule {
  constructor(
    private applicationInsights: DhApplicationInsights,
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: DhSharedUtilApplicationInsightsRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'DhSharedUtilApplicationInsightsRootModule.forRoot() registered in multiple injectors. Only call it from the core feature shell module or in the Angular testing module.'
      );
    }

    this.applicationInsights.init();
  }
}

/**
 * Do not import directly. Use `DhSharedUtilApplicationInsightsModule.forRoot()`.
 */
@NgModule()
export class DhSharedUtilApplicationInsightsModule {
  static forRoot(): ModuleWithProviders<DhSharedUtilApplicationInsightsModule> {
    return {
      ngModule: DhSharedUtilApplicationInsightsRootModule,
    };
  }

  constructor() {
    throw new Error(
      'Do not import DhSharedUtilApplicationInsightsModule directly. Use DhSharedUtilApplicationInsightsModule.forRoot().'
    );
  }
}
