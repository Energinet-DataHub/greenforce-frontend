import {
  Component,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LetModule } from '@rx-angular/template';
import { EoLandingPageStore } from './../eo-landing-page.store';
import { Observable } from 'rxjs';

const selector = 'eo-landing-page-login-button';

@Component({
  providers: [EoLandingPageStore],
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;

        // 1. Primary Watt Button.
        // 2. Normal size Watt Button.
        // 3. Custom size for Watt Button in App bar.
        // 4. Align text vertically.
        .${selector}__login-link {
          @include watt.typography-watt-button; // [1]

          --height: calc(10 * var(--watt-space-xs));
          --inset-squish-m--x: var(--watt-space-m);
          --inset-squish-m--y: var(--watt-space-s);

          background: var(--watt-color-primary); // [1]
          color: var(--watt-color-primary-contrast); // [1]

          min-width: 6.25rem; // [2]
          height: var(--height); // [3]
          padding: var(--inset-squish-m--y) var(--inset-squish-m--x); // [3]

          line-height: calc(
            var(--height) - 2 * var(--inset-squish-m--y)
          ); // [3] [4]

          &:hover {
            text-decoration: none; // [1]
          }
        }
      }
    `,
  ],
  template: `
    <a
      class="${selector}__login-link"
      mat-button
      mat-flat-button
      *rxLet="loginUrl$ as loginUrl"
      [href]="loginUrl"
      >Start</a
    >
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageLogInButtonComponent {
  loginUrl$: Observable<string> = this.landingPageStore.authenticationUrl$;
  constructor(private landingPageStore: EoLandingPageStore) {}
}

@NgModule({
  declarations: [EoLandingPageLogInButtonComponent],
  exports: [EoLandingPageLogInButtonComponent],
  imports: [MatButtonModule, LetModule],
})
export class EoLandingPageLogInButtonScam {}
