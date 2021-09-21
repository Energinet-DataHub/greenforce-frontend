import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WattModule } from '@energinet/watt';

import { Dh3AdminAppComponent } from './dh3-admin-app.component';

@NgModule({
  bootstrap: [Dh3AdminAppComponent],
  declarations: [Dh3AdminAppComponent],
  imports: [BrowserModule, WattModule],
  providers: [],
})
export class Dh3AdminAppModule {}
