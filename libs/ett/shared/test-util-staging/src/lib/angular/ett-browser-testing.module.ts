import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EttBrowserConfigurationModule } from '@energinet-datahub/ett/core/util-browser';

@NgModule({
  imports: [NoopAnimationsModule, EttBrowserConfigurationModule.forRoot()],
})
export class EttBrowserTestingModule {}
