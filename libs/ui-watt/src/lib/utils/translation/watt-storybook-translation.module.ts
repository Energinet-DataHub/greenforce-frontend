import { NgModule } from '@angular/core';
import {
  translocoConfig,
  TranslocoModule,
  TRANSLOCO_CONFIG,
} from '@ngneat/transloco';

/**
 * Import this module in stories for Watt components using translations.
 *
 * __Only for use within stories, do not import directly in components.__
 */
@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'da'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: false,
      }),
    },
  ],
})
export class WattStorybookTranslationModule {}
