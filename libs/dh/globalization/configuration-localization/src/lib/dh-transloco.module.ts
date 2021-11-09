import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { dhTranslocoHttpLoaderProvider } from '@energinet-datahub/dh/globalization/data-access-localization';
import { environment } from '@energinet-datahub/dh/shared/environments';
import {
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';

@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['da', 'en'],
        defaultLang: 'da',
        fallbackLang: ['da', 'en'],
        flatten: {
          aot: environment.production,
        },
        missingHandler: {
          useFallbackTranslation: true,
        },
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
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
    throw new Error(
      'Do not import DhTranslocoModule directly. Use DhTranslocoModule.forRoot.'
    );
  }
}
