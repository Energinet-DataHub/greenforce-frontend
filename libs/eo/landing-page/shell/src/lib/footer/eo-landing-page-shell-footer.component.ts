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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';

const selector = 'eo-landingpage-shell-footer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        .mat-toolbar[role="footer"] {
          display: block;
          position: absolute;
          height: auto;
          bottom: 0;
          filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.1));
          background: #fff;
          padding-left: 16px;
          padding-right: 16px;

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
    <mat-toolbar role="footer">
      <mat-grid-list cols="3" [rowHeight]="footerRowHeight">
        <mat-grid-tile>
          <div style="display: block; width: 100%; height: 100%;">
            <small style="display: block;">Powered by</small>
            <img src="assets/energyorigin-logo.png" />
            <p>Privacy Policy</p>
          </div>
        </mat-grid-tile>
        <mat-grid-tile>
          <div style="display: block; width: 100%; height: 100%;">
            <p>Address</p>
          </div>
        </mat-grid-tile>
        <mat-grid-tile>
          <div style="display: block; width: 100%; height: 100%;">
            <p>Address</p>
          </div>
        </mat-grid-tile>
      </mat-grid-list>
    </mat-toolbar>
  `,
})
export class EoLandingPageShellFooterComponent {
  readonly footerRowHeight: string = '184px';
}

@NgModule({
  declarations: [EoLandingPageShellFooterComponent],
  exports: [EoLandingPageShellFooterComponent],
  imports: [MatToolbarModule, MatGridListModule],
})
export class EoLandingPageShellFooterScam {}
