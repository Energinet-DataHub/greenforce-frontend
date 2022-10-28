import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { WattClipboardIntlService } from '@energinet-datahub/watt/clipboard';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class DhWattClipboardIntlService extends WattClipboardIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco
      .selectTranslate('clipboard.success')
      .subscribe((value) => (this.success = value));

    transloco
      .selectTranslate('clipboard.error')
      .subscribe((value) => (this.error = value));
  }
}

/**
 * Do not import directly. Use `DhConfigurationLocalization.forRoot`.
 */
@NgModule({})
export class DhGlobalizationUiWattTranslationModule {
  static forRoot(): ModuleWithProviders<DhGlobalizationUiWattTranslationModule> {
    return {
      ngModule: DhGlobalizationUiWattTranslationModule,
      providers: [
        {
          provide: WattClipboardIntlService,
          useClass: DhWattClipboardIntlService,
        },
      ],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule?: DhGlobalizationUiWattTranslationModule
  ) {
    if (parentModule) {
      throw new Error(
        'DhGlobalizationUiWattTranslationModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
