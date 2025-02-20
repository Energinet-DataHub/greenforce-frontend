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
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhAddressDetailsComponent } from './dh-address-details.component';
import { DhActualAddressComponent } from './dh-actual-address.component';
import { MeteringPointDetails } from './types';
import { WattDatePipe } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-metering-point-details',
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhActualAddressComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
    }

    @include watt.media('>=XLarge') {
      .grid-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--watt-space-l);
      }

      .grid-column:first-of-type .watt-divider:last-of-type {
        display: none;
      }
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.details'">
      <div class="grid-wrapper">
        <div class="grid-column">
          <watt-description-list
            class="watt-space-stack-l"
            variant="stack"
            [itemSeparators]="false"
          >
            <watt-description-list-item [label]="t('address')">
              @let address = installationAddress();
              <div>
                {{ address?.streetName | dhEmDashFallback }}
                {{ address?.streetCode | dhEmDashFallback }},

                @if (address?.floor || address?.room) {
                  {{ address?.floor | dhEmDashFallback }}. {{ address?.room | dhEmDashFallback }}
                }
              </div>
              <div>
                {{ address?.postCode | dhEmDashFallback }}
                {{ address?.cityName | dhEmDashFallback }}
              </div>
              <dh-actual-address
                [isActualAddress]="address?.washInstruction"
                class="watt-space-stack-m"
              />

              <a (click)="$event.preventDefault(); showAddressDetails()" class="watt-link-s">{{
                t('showAddressDetailsLink')
              }}</a>
            </watt-description-list-item>
            <watt-description-list-item
              [label]="t('commentLabel')"
              [value]="address?.locationDescription | dhEmDashFallback"
            />
          </watt-description-list>

          <hr class="watt-divider" />

          <h4 class="watt-space-stack-s">{{ t('detailsSubtitle') }}</h4>

          <watt-description-list variant="stack" [itemSeparators]="false">
            <watt-description-list-item [label]="t('meteringPointStatus')">
              @if (meteringPoint()?.connectionState) {
                {{
                  'meteringPoint.overview.status.' + meteringPoint()?.connectionState | transloco
                }}
              }
            </watt-description-list-item>
            <watt-description-list-item
              [label]="t('meteringPointType')"
              [value]="meteringPoint()?.type | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('meteringPointKind')"
              [value]="null | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('meteringPointNumber')"
              [value]="
                meteringPointDetails()?.currentMeteringPointPeriod?.meterNumber | dhEmDashFallback
              "
            />
            <watt-description-list-item
              [label]="t('settlementMethod')"
              [value]="null | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('electricalHeating')"
              [value]="'shared.' + hasElectricalHeating() | transloco"
            />
            <watt-description-list-item
              [label]="t('electricalHeatingTaxStartDate')"
              [value]="commercialRelation()?.currentElectricalHeatingPeriod?.validFrom | wattDate"
            />
            <watt-description-list-item
              [label]="t('capacityLimit')"
              [value]="null | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('disconnectionType')"
              [value]="meteringPoint()?.disconnectionType | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('gridArea')"
              [value]="meteringPoint()?.gridAreaCode | dhEmDashFallback"
            />
          </watt-description-list>

          <hr class="watt-divider" />
        </div>

        <div class="grid-column">
          <h4 class="watt-space-stack-s">{{ t('powerPlantSubTitle') }}</h4>

          <watt-description-list variant="stack" [itemSeparators]="false">
            <watt-description-list-item
              [label]="t('netSettlementGroup')"
              [value]="meteringPoint()?.netSettlementGroup | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('scheduledReadingDate')"
              [value]="meteringPoint()?.scheduledMeterReadingMonth | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('powerPlantCapacity')"
              [value]="null | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('powerPlantAssetType')"
              [value]="meteringPoint()?.assetType | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('powerPlantConnectionType')"
              [value]="meteringPoint()?.connectionType | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('powerPlantGsrnNumber')"
              [value]="null | dhEmDashFallback"
            />
          </watt-description-list>

          <hr class="watt-divider" />

          <h4 class="watt-space-stack-s">{{ t('otherSubTitle') }}</h4>

          <watt-description-list variant="stack" [itemSeparators]="false">
            <watt-description-list-item
              [label]="t('readingOccurrence')"
              [value]="meteringPoint()?.resolution | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('unit')"
              [value]="meteringPoint()?.unit | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('product')"
              [value]="meteringPoint()?.productId | dhEmDashFallback"
            />
          </watt-description-list>
        </div>
      </div>
    </watt-card>
  `,
})
export class DhMeteringPointDetailsComponent {
  modalService = inject(WattModalService);

  meteringPointDetails = input.required<MeteringPointDetails | undefined>();

  meteringPoint = computed(() => this.meteringPointDetails()?.currentMeteringPointPeriod);

  commercialRelation = computed(() => this.meteringPointDetails()?.currentCommercialRelation);

  installationAddress = computed(() => this.meteringPoint()?.installationAddress);

  hasElectricalHeating = computed(() =>
    this.commercialRelation()?.currentElectricalHeatingPeriod ? true : false
  );

  showAddressDetails(): void {
    this.modalService.open({
      component: DhAddressDetailsComponent,
      data: this.installationAddress(),
    });
  }
}
