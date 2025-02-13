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
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import type { EnergySupplier } from './types';
import { WattDatePipe } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-energy-supplier',
  imports: [
    TranslocoDirective,

    WATT_CARD,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.energySupplier'">
      <watt-card-title>
        <h3>{{ t('title') }}</h3>
      </watt-card-title>

      <watt-description-list variant="stack" [itemSeparators]="false">
        <watt-description-list-item
          [label]="t('energySupplierLabel')"
          [value]="energySupplier()?.energySupplier | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('startDateLabel')"
          [value]="energySupplier()?.validFrom | wattDate"
        />
      </watt-description-list>
    </watt-card>
  `,
})
export class DhEnergySupplierComponent {
  energySupplier = input.required<EnergySupplier | undefined | null>();
}
