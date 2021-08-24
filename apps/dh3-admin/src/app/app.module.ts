import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WattModule } from '@energinet/watt';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, WattModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
