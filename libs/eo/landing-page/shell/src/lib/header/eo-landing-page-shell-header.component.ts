/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

const selector = 'eo-landing-page-header';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      .${selector}__toolbar {
        display: flex;
        justify-content: space-between;
        filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.1));
        height: var(--watt-space-xl);
        background: var(--watt-color-neutral-white);

        a {
          // Temporary solution until we have a WATT link, styled as a button with the appropiate dimensions (?)
          height: 44px; // var(--watt-space-l);
          line-height: 44px;
          color: var(--watt-color-neutral-white);
          background: var(--watt-color-primary);

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
      <img src="assets/energyorigin-logo.png" alt="EnergyOrigin" />
      <a mat-button mat-flat-button routerLink="/login">Start</a>
    </mat-toolbar>
  `,
})
export class EoLandingPageHeaderComponent {}

@NgModule({
  declarations: [EoLandingPageHeaderComponent],
  exports: [EoLandingPageHeaderComponent],
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
})
export class EoLandingPageShellHeaderScam {}
