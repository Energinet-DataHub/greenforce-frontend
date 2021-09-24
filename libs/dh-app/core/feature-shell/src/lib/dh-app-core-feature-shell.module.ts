import { NgModule } from '@angular/core';

import { DhAppCoreFeatureShellRoutingModule } from './dh-app-core-feature-shell-routing.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  imports: [ShellModule, DhAppCoreFeatureShellRoutingModule],
})
export class DhAppCoreFeatureShellModule {}
