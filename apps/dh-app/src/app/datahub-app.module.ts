import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WattModule } from '@energinet/watt';

import { DataHubAppComponent } from './datahub-app.component';

@NgModule({
  bootstrap: [DataHubAppComponent],
  declarations: [DataHubAppComponent],
  imports: [BrowserModule, WattModule],
})
export class DataHubAppModule {}
