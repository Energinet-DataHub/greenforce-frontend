import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { NgModule } from '@angular/core';

function baseUriFactory(document: Document): string {
  return document.baseURI;
}

@NgModule({
  providers: [
    { deps: [DOCUMENT], provide: APP_BASE_HREF, useFactory: baseUriFactory },
  ],
})
export class EttBrowserConfigurationModule {}
