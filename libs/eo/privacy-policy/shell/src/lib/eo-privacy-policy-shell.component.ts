import {ChangeDetectionStrategy, Component, NgModule, ViewEncapsulation,} from '@angular/core';
import {EoPrivacyPolicyScam} from '@energinet-datahub/eo/shared/atomic-design/molecules';

const selector = 'eo-privacy-policy-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `<eo-privacy-policy></eo-privacy-policy>`,
  styles: [
    `
      ${selector} {
        display: block;
      }
    `
  ]
})
export class EoPrivacyPolicyShellComponent {}

@NgModule({
  imports: [EoPrivacyPolicyScam],
  declarations: [EoPrivacyPolicyShellComponent]
})
export class EoPrivacyPolicyShellScam {}
