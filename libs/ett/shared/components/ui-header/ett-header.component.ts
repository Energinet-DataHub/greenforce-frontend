//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EttProductLogoDirective } from '@energinet-datahub/ett/shared/components/ui-product-logo';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, EttProductLogoDirective],
  selector: 'ett-header',
  styles: [
    `
      :host {
        @media print {
          display: none;
        }
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        background-color: var(--watt-color-neutral-white);
        border-bottom: 1px solid var(--watt-color-neutral-grey-300);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        height: var(--watt-space-xl);
      }

      .logo {
        height: var(--watt-space-l);
        min-width: 255px; // Magic UX number
        padding-right: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <mat-toolbar class="toolbar watt-space-inset-squished-m">
      <img ettProductLogo class="logo" />
      <ng-content />
    </mat-toolbar>
  `,
})
export class EttHeaderComponent {}
