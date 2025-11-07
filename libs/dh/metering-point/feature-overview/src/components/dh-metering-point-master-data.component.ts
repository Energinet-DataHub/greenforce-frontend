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
import { Component, computed, inject, input } from '@angular/core';

import { WATT_CARD } from '@energinet/watt/card';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { EnergySupplier } from './../types';
import { DhCanSeeDirective } from './can-see/dh-can-see.directive';
import { DhEnergySupplierComponent } from './dh-energy-supplier.component';
import { DhCustomerOverviewComponent } from './customer/dh-customer-overview.component';
import { DhMeteringPointDetailsComponent } from './dh-metering-point-details.component';
import { DhMeteringPointHighlightsComponent } from './dh-metering-point-highlights.component';
import { DhRelatedMeteringPointsComponent } from './related/dh-related-metering-points.component';
import { VaterStackComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-metering-point-master-data',
  imports: [
    WATT_CARD,
    DhResultComponent,
    DhMeteringPointHighlightsComponent,
    DhCustomerOverviewComponent,
    DhEnergySupplierComponent,
    DhMeteringPointDetailsComponent,
    DhCanSeeDirective,
    DhResultComponent,
    DhRelatedMeteringPointsComponent,
    VaterStackComponent,
  ],
  styles: `
    @use '@energinet/watt/utils' as watt;

    :host {
      display: block;
      height: 100%;
    }

    .page-grid {
      display: grid;
      width: 100%;
      gap: var(--watt-space-ml);
      padding: var(--watt-space-ml);

      @include watt.media('>=Large') {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto 1fr;

        dh-metering-point-details {
          grid-row: 1 / span 3;
        }

        dh-customer-overview {
          grid-column: 2;
          grid-row: 1;
        }

        dh-energy-supplier {
          grid-column: 2;
          grid-row: 2;
        }

        dh-related-metering-points {
          grid-column: 2;
          grid-row: 3;
        }
      }

      @include watt.media('>=XLarge') {
        grid-template-rows: auto auto 1fr;

        dh-metering-point-details {
          grid-row: 1 / span 2;
        }

        dh-related-metering-points {
          grid-column: 3;
          grid-row: 1 / span 2;
        }

        dh-energy-supplier {
          grid-column: 2;
          grid-row: 2 / span 2;
        }
      }

      &.page-grid__child-view {
        @include watt.media('>=Large') {
          grid-template-rows: auto auto;

          dh-metering-point-details {
            grid-row: 2;
          }

          dh-related-metering-points {
            grid-row: 2;
          }
        }

        @include watt.media('>=XLarge') {
          grid-template-columns: 800px 600px;

          dh-related-metering-points {
            grid-column: 2;
          }
        }
      }
    }
  `,
  template: `
    <dh-result [hasError]="query.hasError()" [loading]="query.loading()">
      <vater-stack direction="column">
        <dh-metering-point-highlights [meteringPointDetails]="meteringPoint()" />
        <div class="page-grid" [class.page-grid__child-view]="meteringPoint()?.isChild">
          <dh-metering-point-details [meteringPoint]="meteringPoint()" />
          <dh-customer-overview
            *dhCanSee="'customer-overview-card'; meteringPoint: meteringPoint()"
            [meteringPoint]="meteringPoint()"
          />

          <dh-energy-supplier
            *dhCanSee="'energy-supplier-card'; meteringPoint: meteringPoint()"
            [energySupplier]="energySupplier()"
          />

          @defer (on idle) {
            <dh-related-metering-points [meteringPointId]="meteringPointId()" />
          }
        </div>
      </vater-stack>
    </dh-result>
  `,
})
export class DhMeteringPointMasterDataComponent {
  private actor = inject(DhActorStorage).getSelectedActor();
  query = query(GetMeteringPointByIdDocument, () => ({
    variables: { meteringPointId: this.meteringPointId(), actorGln: this.actor.gln },
  }));

  meteringPointId = input.required<string>();

  meteringPoint = computed(() => this.query.data()?.meteringPoint);
  isEnergySupplierResponsible = computed(() => this.meteringPoint()?.isEnergySupplier);

  energySupplier = computed<EnergySupplier>(() => ({
    gln: this.meteringPoint()?.commercialRelation?.energySupplier,
    name: this.meteringPoint()?.commercialRelation?.energySupplierName?.value,
    validFrom: this.meteringPoint()?.commercialRelation?.startDate,
  }));
}
