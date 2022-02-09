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
  ViewEncapsulation
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

const selector = 'eo-header';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      .${selector}__toolbar {
        display: flex;
        justify-content: space-between;

        // These styles are matching watt toolbar
        background-color: var(--watt-color-neutral-white);
        border-bottom: 1px solid var(--watt-color-neutral-grey-300);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);

        // Adjustment locally to contain a normal sized button
        height: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <mat-toolbar
      role="heading"
      class="${selector}__toolbar watt-space-inset-squished-m"
    >
      <img src="assets/energyorigin-logo.svg" alt="EnergyOrigin" />
      <ng-content></ng-content>
    </mat-toolbar>
  `,
})
export class EoHeaderComponent { }

@NgModule({
  declarations: [EoHeaderComponent],
  exports: [EoHeaderComponent],
  imports: [MatToolbarModule]
})
export class EoHeaderScam {}
