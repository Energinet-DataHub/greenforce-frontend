import {
  Component,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  EoLandingPageColumnLayoutScam,
  layoutTypeEnum,
} from './eo-landing-page-column-layout.component';
import { EoLandingPageLogInButtonScam } from './eo-landing-page-login-button.component';

const selector = 'eo-landing-page-bottom-layout';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        margin-top: var(--watt-space-xl);
        text-align: center;

        .${selector}__h2 {
          @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
          text-transform: none; // This overrides the uppercased styling from watt
        }
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout [layoutType]="layoutTypeEnum.FULL">
      <h2 class="${selector}__h2">Login with your business NemId</h2>
      <eo-landing-page-login-button></eo-landing-page-login-button>
    </eo-landing-page-column-layout>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageBottomLayoutComponent {
  layoutTypeEnum = layoutTypeEnum;
}

@NgModule({
  declarations: [EoLandingPageBottomLayoutComponent],
  exports: [EoLandingPageBottomLayoutComponent],
  imports: [EoLandingPageColumnLayoutScam, EoLandingPageLogInButtonScam],
})
export class EoLandingPageBottomLayoutScam {}
