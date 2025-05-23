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

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { ElectricityMarketMeteringPointType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { DhAddressDetailsComponent } from './address/dh-address-details.component';
import { DhActualAddressComponent } from './address/dh-actual-address.component';
import { MeteringPointDetails } from '../types';
import { DhCanSeeDirective } from './can-see/dh-can-see.directive';
import { DhAddressComponent } from './address/dh-address.component';

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
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.details'">
      <div class="grid-wrapper" [class.grid-wrapper__child-view]="meteringPointDetails()?.isChild">
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
                *dhCanSee="'actual-address'; meteringPointDetails: meteringPointDetails()"
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
              @if (meteringPoint()?.type) {
                {{ 'meteringPointType.' + meteringPoint()?.type | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('meteringPointSubType')">
              @if (meteringPoint()?.subType) {
                {{ 'meteringPointSubType.' + meteringPoint()?.subType | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('meteringPointNumber')"
              [value]="meteringPointDetails()?.metadata?.meterNumber | dhEmDashFallback"
            />

            <watt-description-list-item
              [label]="t('settlementMethod')"
              *dhCanSee="'settlement-method'; meteringPointDetails: meteringPointDetails()"
            >
              @if (meteringPoint()?.settlementMethod) {
                {{ 'settlementMethod.' + meteringPoint()?.settlementMethod | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <ng-container
              *dhCanSee="'electrical-heating'; meteringPointDetails: meteringPointDetails()"
            >
              <watt-description-list-item
                [label]="t('electricalHeating')"
                [value]="'shared.' + hasElectricalHeating() | transloco"
              />

              @if (hasElectricalHeating() || hasHadElectricalHeating()) {
                <watt-description-list-item [label]="t('electricalHeatingTaxStartDate')">
                  @if (hasElectricalHeating()) {
                    {{
                      commercialRelation()?.activeElectricalHeatingPeriods?.validFrom
                        | wattDate
                        | dhEmDashFallback
                    }}
                  } @else if (hasHadElectricalHeating()) {
                    {{
                      firstHistoricElectricalHeatingPeriod()?.validTo | wattDate | dhEmDashFallback
                    }}
                  }
                </watt-description-list-item>
              }
            </ng-container>

            <watt-description-list-item [label]="t('powerLimit')">
              @if (meteringPoint()?.powerLimitKw) {
                {{ t('powerLimitValue', { value: meteringPoint()?.powerLimitKw | number: '1.1' }) }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('disconnectionType')"
              *dhCanSee="'disconnection-type'; meteringPointDetails: meteringPointDetails()"
            >
              @if (meteringPoint()?.disconnectionType) {
                {{ 'disconnectionType.' + meteringPoint()?.disconnectionType | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item
              [label]="t('gridArea')"
              [value]="meteringPoint()?.gridArea?.displayName | dhEmDashFallback"
            />
            <watt-description-list-item
              *dhCanSee="'from-grid-area'; meteringPointDetails: meteringPointDetails()"
              [label]="t('fromGridArea')"
              [value]="meteringPoint()?.fromGridArea?.displayName | dhEmDashFallback"
            />
            <watt-description-list-item
              *dhCanSee="'to-grid-area'; meteringPointDetails: meteringPointDetails()"
              [label]="t('toGridArea')"
              [value]="meteringPoint()?.toGridArea?.displayName | dhEmDashFallback"
            />
          </watt-description-list>

          <hr class="watt-divider" />
        </div>

        <div class="grid-column">
          <ng-container
            *dhCanSee="'power-plant-section'; meteringPointDetails: meteringPointDetails()"
          >
            <h4 class="watt-space-stack-s">{{ t('powerPlantSubTitle') }}</h4>

            <watt-description-list variant="stack" [itemSeparators]="false">
              <watt-description-list-item [label]="t('netSettlementGroup')">
                @if (meteringPoint()?.netSettlementGroup) {
                  {{ 'netSettlementGroup.' + meteringPoint()?.netSettlementGroup | transloco }}
                } @else {
                  {{ null | dhEmDashFallback }}
                }
              </watt-description-list-item>

              <ng-container
                *dhCanSee="'scheduled-meter-reading'; meteringPointDetails: meteringPointDetails()"
              >
                @if (meteringPoint()?.netSettlementGroup === 6) {
                  <watt-description-list-item [label]="t('scheduledMeterReading')">
                    @if (meteringPoint()?.scheduledMeterReadingMonth) {
                      {{
                        t(
                          'scheduledMeterReadingValue.' +
                            meteringPoint()?.scheduledMeterReadingMonth
                        )
                      }}
                    } @else {
                      {{ null | dhEmDashFallback }}
                    }
                  </watt-description-list-item>
                }
              </ng-container>

              <watt-description-list-item
                *dhCanSee="'capacity'; meteringPointDetails: meteringPointDetails()"
                [label]="t('powerPlantCapacity')"
              >
                @if (meteringPoint()?.capacity) {
                  {{
                    t('powerPlantCapacityValue', {
                      value: meteringPoint()?.capacity | number: '1.1',
                    })
                  }}
                } @else {
                  {{ null | dhEmDashFallback }}
                }
              </watt-description-list-item>

              @if (meteringPoint()?.type === MeteringPointType.Production) {
                <watt-description-list-item [label]="t('powerPlantAssetType')">
                  @if (meteringPoint()?.assetType) {
                    {{ 'assetType.' + meteringPoint()?.assetType | transloco }}
                  } @else {
                    {{ null | dhEmDashFallback }}
                  }
                </watt-description-list-item>
              }

              <watt-description-list-item
                *dhCanSee="'connectionType'; meteringPointDetails: meteringPointDetails()"
                [label]="t('powerPlantConnectionType')"
              >
                @if (meteringPoint()?.connectionType) {
                  {{ 'connectionType.' + meteringPoint()?.connectionType | transloco }}
                } @else {
                  {{ null | dhEmDashFallback }}
                }
              </watt-description-list-item>

              <watt-description-list-item
                *dhCanSee="'powerPlantGsrn'; meteringPointDetails: meteringPointDetails()"
                [label]="t('powerPlantGsrnNumber')"
                [value]="meteringPoint()?.powerPlantGsrn | dhEmDashFallback"
              />
            </watt-description-list>

            <hr class="watt-divider" />
          </ng-container>

          <h4 class="watt-space-stack-s">{{ t('otherSubTitle') }}</h4>

          <watt-description-list variant="stack" [itemSeparators]="false">
            <watt-description-list-item
              *dhCanSee="'resolution'; meteringPointDetails: meteringPointDetails()"
              [label]="t('resolutionLabel')"
            >
              @if (meteringPoint()?.resolution) {
                {{ 'resolution.' + meteringPoint()?.resolution | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('measureUnit')">
              @if (meteringPoint()?.measureUnit) {
                {{ 'measureUnit.' + meteringPoint()?.measureUnit | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>

            <watt-description-list-item [label]="t('product')">
              @if (meteringPoint()?.product) {
                {{ 'product.' + meteringPoint()?.product | transloco }}
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

  meteringPointDetails = input.required<MeteringPointDetails | undefined>();

  meteringPoint = computed(() => this.meteringPointDetails()?.metadata);

  commercialRelation = computed(() => this.meteringPointDetails()?.commercialRelation);

  installationAddress = computed(() => this.meteringPoint()?.installationAddress);

  hasElectricalHeating = computed(() => this.commercialRelation()?.haveElectricalHeating);

  hasHadElectricalHeating = computed(() => this.commercialRelation()?.hadElectricalHeating);

  firstHistoricElectricalHeatingPeriod = computed(
    () => this.commercialRelation()?.electricalHeatingPeriods[0]
  );

  MeteringPointType = ElectricityMarketMeteringPointType;

  showAddressDetails(): void {
    this.modalService.open({
      component: DhAddressDetailsComponent,
      data: {
        installationAddress: this.installationAddress(),
        meteringPointDetails: this.meteringPointDetails(),
      },
    });
  }
}
