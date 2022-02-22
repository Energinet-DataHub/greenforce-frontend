import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { EoPrivacyPolicyScam } from '@energinet-datahub/eo/shared/atomic-design/molecules';

const selector = 'eo-privacy-policy-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `<eo-privacy-policy></eo-privacy-policy>`,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: block;
        > eo-privacy-policy {
          margin-bottom: var(--watt-space-l);
        }
      }
    `,
  ],
})
export class EoPrivacyPolicyShellComponent {}

@NgModule({
  imports: [EoPrivacyPolicyScam],
  declarations: [EoPrivacyPolicyShellComponent],
})
export class EoPrivacyPolicyShellScam {}
