import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

import { EoPrivacyPolicyStore } from './eo-privacy-policy.store';
import { EoScrollViewScam } from '@energinet-datahub/eo/shared/ui-presentational-components';
import { Observable } from 'rxjs';
import { PushModule } from '@rx-angular/template';

const selector = 'eo-privacy-policy-shell';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `
    <div>
      <h1>Read our privacy policy</h1>
      <eo-scroll-view>
        <div [innerHTML]="'<h3>Privacy policy section header</h3><p>Content of section one goes here..</p>'"></div>
      </eo-scroll-view>
    </div>
  `,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        > div:nth-of-type(1) {
          display: block;
          width: calc(200 * var(--watt-space-xs));
          // margin: 0 auto;
          margin-bottom: var(--watt-space-l);

          > h1 {
            @include watt.typography-watt-headline-1; // Mis-match with styles in Figma(?)
            text-transform: none; // Override .watt-headline-1
            margin-bottom: var(--watt-space-l);
          }
        }
      }
    `
  ]
})
export class EoPrivacyPolicyShellComponent {
  constructor(private store: EoPrivacyPolicyStore) {}
}

@NgModule({
  providers: [EoPrivacyPolicyStore],
  declarations: [EoPrivacyPolicyShellComponent],
  imports: [EoScrollViewScam]
})
export class EoPrivacyPolicyShellScam {}
