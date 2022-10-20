import {
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';
import { NgModule } from '@angular/core';

@NgModule({
  exports: [TranslocoModule],
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
export class StorybookTranslocoRootModule {}
