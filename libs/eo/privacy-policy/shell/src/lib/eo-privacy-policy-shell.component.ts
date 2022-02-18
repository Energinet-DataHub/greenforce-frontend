import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

const selector = 'eo-privacy-policy-shell';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `
    <p>
      eo-privacy-policy-shell works!
    </p>
  `,
  styles: [
    `
      ${selector} {
        display: block;
      }
    `
  ]
})
export class EoPrivacyPolicyShellComponent { }

@NgModule({
  declarations: [EoPrivacyPolicyShellComponent]
})
export class EoPrivacyPolicyShellScam {}
