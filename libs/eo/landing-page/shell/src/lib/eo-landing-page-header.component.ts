/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EoLandingPageStore } from './eo-landing-page.store';

const selector = 'eo-landing-page-header';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      .${selector}__toolbar {
        display: flex;
        justify-content: space-between;

        // These styles are matching watt toolbar
        background-color: var(--watt-color-neutral-white);
        border-bottom: 1px solid var(--watt-color-neutral-grey-300);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);

        // Adjustment locally to contain a normal sized button
        height: var(--watt-space-xl);

        a {
          // Default styles for button in WATT
          @include watt.typography-watt-button;

          // The following styles are following the "watt primary button"
          background: var(--watt-color-primary);
          color: var(--watt-color-primary-contrast);

          // This is equivalent to a normal size watt button width
          min-width: 6.25rem;
          height: calc(5 * var(--watt-space-s)); // 40px
          padding: var(--watt-space-s) var(--watt-space-m) var(--watt-space-s)
            var(--watt-space-m); // 8px 16px 8px 16px

          // Adjustment locally to fit the position of the text vertically
          line-height: calc(3 * var(--watt-space-s)); // 24px;

          &:hover {
            text-decoration: none;
          }
        }
      }
    `,
  ],
  template: `
    <mat-toolbar
      role="heading"
      class="${selector}__toolbar watt-space-inset-squished-m"
    >
      <img src="assets/energyorigin-logo.svg" alt="EnergyOrigin" />
      <a
        mat-button
        mat-flat-button
        *rxLet="loginUrl$ as loginUrl"
        [href]="loginUrl"
        >Start</a
      >
    </mat-toolbar>
  `,
})
export class EoLandingPageHeaderComponent {
  loginUrl$: Observable<string> = this.landingPageStore.authenticationUrl$;

  constructor(private landingPageStore: EoLandingPageStore) {}
}

@NgModule({
  declarations: [EoLandingPageHeaderComponent],
  exports: [EoLandingPageHeaderComponent],
  imports: [RouterModule, MatToolbarModule, MatButtonModule, LetModule],
})
export class EoLandingPageHeaderScam {}
