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
import { input, computed, Component, ChangeDetectionStrategy } from '@angular/core';

import { WattCardTitleComponent } from './watt-card-title.component';
import { WattSpinnerComponent } from '../spinner';
/**
 * Usage:
 * `import { WattCardComponent } from '@energinet-datahub/watt/card';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-card',
  styles: [
    `
      :host {
        border-radius: 4px;
        display: block;
        padding: calc(1.5 * var(--watt-space-m)); /* 24px */
        background: var(--bg-card);
      }

      :host.watt-solid {
        border: 1px solid var(--watt-color-neutral-grey-300);
      }

      :host.watt-fill {
        border: 1px solid var(--watt-color-neutral-grey-100);
        background: var(--watt-color-neutral-grey-100);
      }

      .watt-card__spinner {
        z-index: 1;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--watt-color-neutral-white);
        opacity: 0.5;
      }
    `,
  ],
  template: `
    <ng-content select="watt-card-title" />

    <ng-content />

    @if (loading()) {
      <div class="watt-card__spinner">
        <watt-spinner />
      </div>
    }
  `,
  imports: [WattSpinnerComponent],
  host: {
    '[class]': 'cardVariant()',
  },
})
export class WattCardComponent {
  variant = input<WATT_CARD_VARIANT>('elevation');
  loading = input<boolean>(false);
  cardVariant = computed(() => `watt-card watt-${this.variant()}`);
}

export type WATT_CARD_VARIANT = 'solid' | 'elevation' | 'fill';
export const WATT_CARD = [WattCardComponent, WattCardTitleComponent];
