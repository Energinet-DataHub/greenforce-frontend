import {EoPrivacyPolicyShellComponent, EoPrivacyPolicyShellScam} from './eo-privacy-policy-shell.component';
import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';

const routes: Routes = [{
  path: '',
  component: EoPrivacyPolicyShellComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes), EoPrivacyPolicyShellScam]
})
export class EoPrivacyPolicyShellModule {}
