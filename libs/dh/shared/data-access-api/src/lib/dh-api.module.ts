import { HttpClient } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { environment } from '@energinet-datahub/dh/shared/environments';

import { ApiModule, Configuration } from './generated/v1';

/**
 * Do not import directly. Use `EttHttpModule.forRoot`.
 */
@NgModule({
  imports: [
    ApiModule.forRoot(
      () =>
        new Configuration({
          basePath: environment.apiBase,
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
    throw new Error(
      'Do not import DhApiModule directly. Use DhApiModule.forRoot.'
    );
  }
}
