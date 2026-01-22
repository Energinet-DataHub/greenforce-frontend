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
import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet/watt/card';
import { WattModalService } from '@energinet/watt/modal';
import { dayjs, WattDatePipe } from '@energinet/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { ElectricityMarketMeteringPointType } from '@energinet-datahub/dh/shared/domain/graphql';

import { MeteringPointDetails } from '../types';
import { DhCanSeeDirective } from './can-see/dh-can-see.directive';
import { DhAddressComponent } from './address/dh-address.component';
import { DhActualAddressComponent } from './address/dh-actual-address.component';
import { DhAddressDetailsComponent } from './address/dh-address-details.component';

@Component({
  selector: 'dh-metering-point-details',
  imports: [
    DecimalPipe,
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhCanSeeDirective,
    DhAddressComponent,
    DhEmDashFallbackPipe,
    DhActualAddressComponent,
  ],
  styles: `
    @use '@energinet/watt/utils' as watt;

    :host {
      display: block;
    }
  `,
  template: `
    <watt-card *transloco="let t; prefix: 'meteringPoint.overview.details'">
      <div class="grid-wrapper" [class.grid-wrapper__child-view]="meteringPoint()?.isChild">
        <div class="grid-column">
          <watt-description-list
            class="watt-space-stack-s"
            variant="stack"
            [itemSeparators]="false"
          >
            <watt-description-list-item [label]="t('address')">
              @let address = installationAddress();

              @if (address) {
                <dh-address [address]="address" />
              }

              <dh-actual-address
                *dhCanSee="'actual-address'; meteringPoint: meteringPoint()"
                [washInstructions]="address?.washInstructions"
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
            <watt-description-list-item [label]="t('meteringPointType')">
              @if (meteringPointDetails()?.type) {
                {{ 'meteringPointType.' + meteringPointDetails()?.type | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('meteringPointSubType')">
              @if (meteringPointDetails()?.subType) {
                {{ 'meteringPointSubType.' + meteringPointDetails()?.subType | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('meteringPointNumber')"
              [value]="meteringPoint()?.metadata?.meterNumber | dhEmDashFallback"
            />

            <watt-description-list-item
              [label]="t('settlementMethod')"
              *dhCanSee="'settlement-method'; meteringPoint: meteringPoint()"
            >
              @if (meteringPointDetails()?.settlementMethod) {
                {{ 'settlementMethod.' + meteringPointDetails()?.settlementMethod | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <ng-container *dhCanSee="'electrical-heating'; meteringPoint: meteringPoint()">
              <watt-description-list-item
                [label]="t('electricalHeating')"
                [value]="'shared.' + haveElectricalHeating() | transloco"
              />

              @if (haveElectricalHeating() || hadElectricalHeating()) {
                <watt-description-list-item [label]="t('electricalHeatingTaxStartDate')">
                  {{ meteringPoint()?.electricalHeatingStartDate | wattDate | dhEmDashFallback }}
                </watt-description-list-item>
              }
            </ng-container>

            <watt-description-list-item [label]="t('powerLimit')">
              @if (meteringPointDetails()?.powerLimitKw) {
                {{
                  t('powerLimitValueKw', {
                    value: meteringPointDetails()?.powerLimitKw | number: '1.1',
                  })
                }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('powerLimit')">
              @if (meteringPointDetails()?.powerLimitAmp) {
                {{
                  t('powerLimitValueAmpere', {
                    value: meteringPointDetails()?.powerLimitAmp | number: '1.1',
                  })
                }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('disconnectionType')"
              *dhCanSee="'disconnection-type'; meteringPoint: meteringPoint()"
            >
              @if (meteringPointDetails()?.disconnectionType) {
                {{ 'disconnectionType.' + meteringPointDetails()?.disconnectionType | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('gridArea')"
              [value]="meteringPointDetails()?.gridArea?.displayName | dhEmDashFallback"
            />
            <watt-description-list-item
              *dhCanSee="'from-grid-area'; meteringPoint: meteringPoint()"
              [label]="t('fromGridArea')"
              [value]="meteringPointDetails()?.fromGridArea?.displayName | dhEmDashFallback"
            />
            <watt-description-list-item
              *dhCanSee="'to-grid-area'; meteringPoint: meteringPoint()"
              [label]="t('toGridArea')"
              [value]="meteringPointDetails()?.toGridArea?.displayName | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('connectionDate')"
              [value]="meteringPoint()?.connectionDate | wattDate | dhEmDashFallback"
            />
            <watt-description-list-item
              [label]="t('closedDownDate')"
              [value]="meteringPoint()?.closedDownDate | wattDate | dhEmDashFallback"
            />
          </watt-description-list>

          <hr class="watt-divider" />
        </div>

        <div class="grid-column">
          <ng-container *dhCanSee="'power-plant-section'; meteringPoint: meteringPoint()">
            <h4 class="watt-space-stack-s">{{ t('powerPlantSubTitle') }}</h4>

            <watt-description-list variant="stack" [itemSeparators]="false">
              <watt-description-list-item [label]="t('netSettlementGroup')">
                @if (meteringPointDetails()?.netSettlementGroup) {
                  {{
                    'netSettlementGroup.' + meteringPointDetails()?.netSettlementGroup | transloco
                  }}
                } @else {
                  {{ null | dhEmDashFallback }}
                }
              </watt-description-list-item>

              <ng-container *dhCanSee="'scheduled-meter-reading'; meteringPoint: meteringPoint()">
                @if (meteringPointDetails()?.netSettlementGroup === 6) {
                  <watt-description-list-item [label]="t('scheduledMeterReading')">
                    @let month = meteringPointDetails()?.scheduledMeterReadingDate?.month;
                    @if (month) {
                      {{ meteringPointDetails()?.scheduledMeterReadingDate?.day }}.
                      {{ getFormatMonth(month) }}
                    } @else {
                      {{ null | dhEmDashFallback }}
                    }
                  </watt-description-list-item>
                }
              </ng-container>

              <watt-description-list-item [label]="t('powerPlantCapacity')">
                @if (meteringPointDetails()?.capacity) {
                  {{
                    t('powerPlantCapacityValue', {
                      value: meteringPointDetails()?.capacity | number: '1.1',
                    })
                  }}
                } @else {
                  {{ null | dhEmDashFallback }}
                }
              </watt-description-list-item>

              @if (meteringPointDetails()?.type === MeteringPointType.Production) {
                <watt-description-list-item [label]="t('powerPlantAssetType')">
                  @if (meteringPointDetails()?.assetType) {
                    {{ 'assetType.' + meteringPointDetails()?.assetType | transloco }}
                  } @else {
                    {{ null | dhEmDashFallback }}
                  }
                </watt-description-list-item>
              }

              <watt-description-list-item [label]="t('powerPlantConnectionType')">
                @if (meteringPointDetails()?.connectionType) {
                  {{ 'connectionType.' + meteringPointDetails()?.connectionType | transloco }}
                } @else {
                  {{ null | dhEmDashFallback }}
                }
              </watt-description-list-item>

              <watt-description-list-item
                [label]="t('powerPlantGsrnNumber')"
                [value]="meteringPointDetails()?.powerPlantGsrn | dhEmDashFallback"
              />
            </watt-description-list>

            <hr class="watt-divider" />
          </ng-container>

          <h4 class="watt-space-stack-s">{{ t('otherSubTitle') }}</h4>

          <watt-description-list variant="stack" [itemSeparators]="false">
            <watt-description-list-item [label]="t('resolutionLabel')">
              @if (meteringPointDetails()?.resolution) {
                {{ 'resolution.' + meteringPointDetails()?.resolution | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('measureUnit')">
              @if (meteringPointDetails()?.measureUnit) {
                {{ 'measureUnit.' + meteringPointDetails()?.measureUnit | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('product')">
              @if (meteringPointDetails()?.product) {
                {{ 'product.' + meteringPointDetails()?.product | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>
          </watt-description-list>
        </div>
      </div>
    </watt-card>
  `,
})
export class DhMeteringPointDetailsComponent {
  modalService = inject(WattModalService);

  meteringPoint = input.required<MeteringPointDetails | undefined>();

  meteringPointDetails = computed(() => this.meteringPoint()?.metadata);

  commercialRelation = computed(() => this.meteringPoint()?.commercialRelation);

  installationAddress = computed(() => this.meteringPointDetails()?.installationAddress);

  haveElectricalHeating = computed(() => this.meteringPoint()?.haveElectricalHeating);

  hadElectricalHeating = computed(() => this.meteringPoint()?.hadElectricalHeating);

  getFormatMonth(month: number | undefined) {
    if (!month) return '';

    return dayjs()
      .month(month - 1)
      .format('MMMM');
  }

  MeteringPointType = ElectricityMarketMeteringPointType;

  showAddressDetails(): void {
    this.modalService.open({
      component: DhAddressDetailsComponent,
      data: {
        installationAddress: this.installationAddress(),
        meteringPoint: this.meteringPoint(),
      },
    });
  }
}
