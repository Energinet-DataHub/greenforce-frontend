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
import { Component } from '@angular/core';
import {
  ChargeInformationDto,
  Maybe,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { dayjs, WattDatePipe, WattRange } from '@energinet-datahub/watt/date';
import { WATT_DESCRIPTION_LIST } from '@energinet-datahub/watt/description-list';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'dh-price-information',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    VaterStackComponent,
    WATT_CARD,
    WattDatePipe,
    WATT_DESCRIPTION_LIST,
    WattBadgeComponent,
  ],
  styles: `
    :host {
      watt-card {
        width: 75%;
      }
    }
  `,
  template: `
    <vater-stack
      gap="m"
      align="start"
      inset="m"
      *transloco="let t; prefix: 'charges.charge.priceInformation'"
    >
      @for (charge of chargeInformations; track charge.id) {
        <watt-card>
          <watt-card-title>
            <vater-stack gap="m" align="start" direction="row">
              <h3>
                @if (charge.validToDateTime && charge.validFromDateTime) {
                  {{ dateRange(charge.validFromDateTime, charge.validToDateTime) | wattDate }}
                } @else {
                  {{ charge.validFromDateTime | wattDate }}
                }
                @if (
                  charge.validToDateTime &&
                  isCurrent(charge.validFromDateTime, charge.validToDateTime)
                ) {
                  <watt-badge type="success">{{ t('current') }}</watt-badge>
                }
              </h3>
            </vater-stack>
          </watt-card-title>
          <watt-description-list variant="stack" [itemSeparators]="false">
            <watt-description-list-item [label]="t('name')">
              {{ charge.chargeName }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('description')">
              {{ charge.chargeDescription }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('vatClassification')">
              {{ 'charges.vatClassifications.' + charge.vatClassification | transloco }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('transparentInvoicing')">
              {{ charge.transparentInvoicing ? ('yes' | transloco) : ('no' | transloco) }}
            </watt-description-list-item>
          </watt-description-list>
        </watt-card>
      }
    </vater-stack>
  `,
})
export class DhPriceInformationComponent {
  chargeInformations: Partial<ChargeInformationDto>[] = [
    {
      id: '2',
      chargeName: 'Charge 2',
      chargeDescription:
        'En længere beskrivelse, der også kan fylde to linjer, eller måske endda endnu mere end to linjer.',
      vatClassification: VatClassification.Vat25,
      transparentInvoicing: false,
      validFromDateTime: dayjs().subtract(1, 'year').toDate(),
      validToDateTime: undefined,
    },
    {
      id: '1',
      chargeName: 'Charge 1',
      chargeDescription:
        'En længere beskrivelse, der også kan fylde to linjer, eller måske endda endnu mere end to linjer.',
      vatClassification: VatClassification.NoVat,
      transparentInvoicing: true,
      validFromDateTime: dayjs().subtract(2, 'year').toDate(),
      validToDateTime: dayjs().add(1, 'year').toDate(),
    },
    {
      id: '3',
      chargeName: 'Charge 3',
      chargeDescription:
        'En længere beskrivelse, der også kan fylde to linjer, eller måske endda endnu mere end to linjer.',
      vatClassification: VatClassification.Vat25,
      transparentInvoicing: false,
      validFromDateTime: dayjs().subtract(2, 'year').toDate(),
      validToDateTime: dayjs().subtract(1, 'year').toDate(),
    },
  ];

  isCurrent(from?: Date, to?: Maybe<Date>) {
    const now = new Date();
    if (!from || !to) return false;
    return from <= now && to >= now;
  }

  dateRange(start: Date, end: Date): WattRange<Date> {
    return { start, end: end };
  }
}
