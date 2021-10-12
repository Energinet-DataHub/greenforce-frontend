import { NgModule } from '@angular/core';

import { detectBaseHrefProvider } from './detect-base-href.provider';

@NgModule({
  providers: [detectBaseHrefProvider],
})
export class EttBrowserConfigurationModule {}
