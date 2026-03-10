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
import { Component, computed, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';
import { WattDatePipe } from '@energinet/watt/date';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  ElectricityMarketViewConnectionState,
  ElectricityMarketViewMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import type { EnergySupplier } from '../types';

@Component({
  selector: 'dh-energy-supplier',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhPermissionRequiredDirective,
    DhEmDashFallbackPipe,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-card *transloco="let t; prefix: 'meteringPoint.overview.energySupplier'">
      <watt-card-title>
        <h3>{{ t('title') }}</h3>
      </watt-card-title>

      <watt-description-list variant="stack" [itemSeparators]="false">
        <watt-description-list-item [label]="t('energySupplierLabel')">
          {{ energySupplier()?.gln | dhEmDashFallback }}

          @if (energySupplier()?.name) {
            • {{ energySupplier()?.name }}
          }
        </watt-description-list-item>

        <watt-description-list-item
          [label]="t('startDateLabel')"
          [value]="energySupplier()?.validFrom | wattDate | dhEmDashFallback"
        />

        @if (showProductObligation()) {
          <ng-container *dhPermissionRequired="['metering-point:production-obligation-manage']">
            <watt-description-list-item [label]="t('productObligationLabel')">
              {{ (productObligation() ? 'yes' : 'no') | transloco }}
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('cutOffDateLabel')"
              [value]="null | dhEmDashFallback"
            />
          </ng-container>
        }
      </watt-description-list>
    </watt-card>
  `,
})
export class DhEnergySupplierComponent {
  energySupplier = input<EnergySupplier | undefined | null>();
  productObligation = input<boolean | undefined | null>();
  meteringPointType = input<ElectricityMarketViewMeteringPointType | undefined>();
  meteringPointConnectionState = input<ElectricityMarketViewConnectionState | undefined | null>();

  showProductObligation = computed(
    () =>
      this.meteringPointType() === 'Production' &&
      this.meteringPointConnectionState() !== 'CLOSED_DOWN'
  );
}
