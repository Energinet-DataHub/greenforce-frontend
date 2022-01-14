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
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WattButtonVariant } from '@energinet-datahub/watt';

const selector = 'eo-landingpage-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        .mat-toolbar {
          display: flex;
          justify-content: space-between;
          height: 64px;
          background: #fff;

          a {
            background: var(--watt-color-primary);

            &:hover {
              text-decoration: none;
            }
          }
        }
      }
    `,
  ],
  template: `
    <mat-toolbar role="heading">
      <img src="assets/energyorigin-logo.png" />
      <a
        mat-button
        mat-flat-button
        color="primary"
        href="https://www.google.com/"
        target="_blank"
        >START</a
      >
    </mat-toolbar>
  `,
})
export class EoLandingPageShellComponent {
  readonly buttonVariant: WattButtonVariant = 'primary';

  // @todo: Create logic that creates the link to auth (own backend)
  // ...
}

@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [MatToolbarModule, MatButtonModule],
})
export class EoLandingPageShellScam {}
