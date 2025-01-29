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
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhCustomerOverviewComponent } from './dh-customer-overview.component';
import { DhEnergySupplierComponent } from './dh-energy-supplier.component';
import { DhMeteringPointDetailsComponent } from './dh-metering-point-details.component';
import { DhMeteringPointStatusComponent } from './dh-metering-point-status.component';

@Component({
  selector: 'dh-metering-point-overview',
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WATT_CARD,
    DhEmDashFallbackPipe,
    DhCustomerOverviewComponent,
    DhEnergySupplierComponent,
    DhMeteringPointDetailsComponent,
    DhMeteringPointStatusComponent,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
    }

    .page-header {
      background-color: var(--watt-color-neutral-white);
      box-shadow: var(--watt-bottom-box-shadow);
      padding: var(--watt-space-m) var(--watt-space-ml);
    }

    .page-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--watt-space-ml);
      margin: var(--watt-space-ml);

      @include watt.media('>=Large') {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;

        dh-customer-overview {
          grid-column: 1;
          grid-row: 1;
        }

        dh-energy-supplier {
          grid-column: 1;
          grid-row: 2;
        }

        dh-metering-point-details {
          grid-column: 2;
          grid-row: 1/3;
        }
      }

      @include watt.media('>=XLarge') {
        grid-template-columns: 600px 1fr 1fr;

        dh-metering-point-details {
          grid-column: 2/4;
        }
      }
    }
  `,
  template: `
    <div *transloco="let t; read: 'meteringPoint.overview'" class="page-header">
      <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
        {{ meteringPointId() }}
        <dh-metering-point-status status="CONNECTED" />
      </h2>

      <vater-stack direction="row" gap="ml">
        <span>
          <span class="watt-label watt-space-inline-s">{{ t('meta.meteringPointType') }}</span
          >{{ null | dhEmDashFallback }}
        </span>

        <span direction="row" gap="s">
          <span class="watt-label watt-space-inline-s">{{ t('meta.energySupplier') }}</span
          >{{ null | dhEmDashFallback }}
        </span>
      </vater-stack>
    </div>

    <div class="page-content">
      <dh-customer-overview />
      <dh-energy-supplier />
      <dh-metering-point-details />
    </div>
  `,
})
export class DhMeteringPointOverviewComponent {
  meteringPointId = input.required<string>();
}
