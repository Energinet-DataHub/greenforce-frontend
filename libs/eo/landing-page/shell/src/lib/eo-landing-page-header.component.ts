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
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { EoProductLogoScam } from '@energinet-datahub/eo/shared/ui-shell';
import { LetModule } from '@rx-angular/template';
import { Observable } from 'rxjs';

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

        // 1. Primary Watt Button.
        // 2. Normal size Watt Button.
        // 3. Custom size for Watt Button in App bar.
        // 4. Align text vertically.
        a {
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
    <mat-toolbar
      role="heading"
      class="${selector}__toolbar watt-space-inset-squished-m"
    >
      <img eoProductLogo />
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
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    LetModule,
    EoProductLogoScam,
  ],
})
export class EoLandingPageHeaderScam {}
