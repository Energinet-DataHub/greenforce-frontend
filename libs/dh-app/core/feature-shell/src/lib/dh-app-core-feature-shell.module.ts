import { NgModule } from '@angular/core';

import { DhAppCoreFeatureShellRoutingModule } from './dh-app-core-feature-shell-routing.module';
import { PageModule } from './page/page.module';

@NgModule({
  imports: [PageModule, DhAppCoreFeatureShellRoutingModule],
})
export class DhAppCoreFeatureShellModule {}
