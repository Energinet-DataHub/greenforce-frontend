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
import { Component, computed, effect, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhCustomerOverviewComponent } from './dh-customer-overview.component';
import { DhEnergySupplierComponent } from './dh-energy-supplier.component';
import { DhMeteringPointDetailsComponent } from './dh-metering-point-details.component';
import { DhMeteringPointStatusComponent } from './dh-metering-point-status.component';
import { DhMeteringPointHighlightsComponent } from './dh-metering-point-highlights.component';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-overview',
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WATT_CARD,
    DhEmDashFallbackPipe,
    DhResultComponent,
    DhMeteringPointHighlightsComponent,
    DhCustomerOverviewComponent,
    DhEnergySupplierComponent,
    DhMeteringPointDetailsComponent,
    DhMeteringPointStatusComponent,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
      height: 100%;
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
        grid-template-rows: auto auto 1fr;

        dh-metering-point-highlights {
          grid-column: 1 / span 2;
          grid-row: 1;
        }

        dh-metering-point-details {
          grid-column: 1;
          grid-row: 2 / span 2;
        }

        dh-customer-overview {
          grid-column: 2;
          grid-row: 2;
        }

        dh-energy-supplier {
          grid-column: 2;
          grid-row: 3;
        }
      }
    }
  `,
  template: `
    <dh-result [hasError]="hasError()" [loading]="loading()">
      <div *transloco="let t; read: 'meteringPoint.overview'" class="page-header">
        <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
          {{ meteringPointId() }}
          <dh-metering-point-status [status]="meteringPoint()?.connectionState ?? 'Unknown'" />
        </h2>

        <vater-stack direction="row" gap="ml">
          <span>
            <span class="watt-label watt-space-inline-s">{{ t('shared.meteringPointType') }}</span
            >{{ meteringPoint()?.type | dhEmDashFallback }}
          </span>

          <span direction="row" gap="s">
            <span class="watt-label watt-space-inline-s">{{ t('shared.energySupplier') }}</span
            >{{ commercialRelation()?.energySupplier | dhEmDashFallback }}
          </span>
        </vater-stack>
      </div>

      <div class="page-content">
        <dh-metering-point-highlights [meteringPointDetails]="meteringPointDetails()" />
        <dh-metering-point-details [meteringPointDetails]="meteringPointDetails()" />
        <dh-customer-overview [meteringPointDetails]="meteringPointDetails()" />
        <dh-energy-supplier [energySupplier]="energySupplier()" />
      </div>
    </dh-result>
  `,
})
export class DhMeteringPointOverviewComponent {
  private meteringPointQuery = lazyQuery(GetMeteringPointByIdDocument);

  meteringPointId = input.required<string>();
  hasError = this.meteringPointQuery.hasError;
  loading = this.meteringPointQuery.loading;

  commercialRelation = computed(() => this.meteringPointDetails()?.currentCommercialRelation);
  meteringPoint = computed(() => this.meteringPointDetails()?.currentMeteringPointPeriod);

  energySupplier = computed(() => this.commercialRelation()?.currentEnergySupplierPeriod);

  meteringPointDetails = computed(() => this.meteringPointQuery.data()?.meteringPoint);

  constructor() {
    effect(() => {
      this.meteringPointQuery.query({ variables: { meteringPointId: this.meteringPointId() } });
    });
  }
}
