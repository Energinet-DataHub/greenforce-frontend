import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DhAppCoreFeatureShellModule } from '@energinet/dh-app/core/feature-shell';

import { DataHubAppComponent } from './datahub-app.component';

@NgModule({
  bootstrap: [DataHubAppComponent],
  declarations: [DataHubAppComponent],
  imports: [BrowserAnimationsModule, DhAppCoreFeatureShellModule],
})
export class DataHubAppModule {}
