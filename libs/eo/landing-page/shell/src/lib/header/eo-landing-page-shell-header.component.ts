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
import { WattButtonVariant } from '@energinet-datahub/watt';

const selector = 'eo-landingpage-shell-header';

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
      <img src="assets/energyorigin-logo.png" />
      <a
        mat-button
        mat-flat-button
        [color]="headerButtonVariant"
        routerLink="/login"
        >START</a
      >
    </mat-toolbar>
  `,
})
export class EoLandingPageShellHeaderComponent {
  readonly headerButtonVariant: WattButtonVariant = 'primary';
}

@NgModule({
  declarations: [EoLandingPageShellHeaderComponent],
  exports: [EoLandingPageShellHeaderComponent],
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
})
export class EoLandingPageShellHeaderScam {}
