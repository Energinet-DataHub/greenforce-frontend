import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { DataHubAppComponent } from './datahub-app.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@energinet/dh-app-core-feature-shell').then(
        (module) => module.DhAppCoreFeatureShellModule
      ),
  },
];

@NgModule({
  bootstrap: [DataHubAppComponent],
  declarations: [DataHubAppComponent],
  imports: [BrowserAnimationsModule, RouterModule.forRoot(routes)],
})
export class DataHubAppModule {}
