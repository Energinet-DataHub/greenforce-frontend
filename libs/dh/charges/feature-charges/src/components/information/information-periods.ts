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

import { GetChargeByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { WATT_CARD } from '@energinet/watt/card';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattDatePipe } from '@energinet/watt/date';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-charges-information-periods',
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    VaterStackComponent,

    WATT_CARD,
    WattDatePipe,
    WattBadgeComponent,
    WATT_DESCRIPTION_LIST,
  ],
  styles: `
    @use '@energinet/watt/utils' as watt;
    :host {
      @include watt.media('>=Large') {
        watt-card {
          width: 75%;
        }
      }
    }
  `,
  template: `
    <vater-stack
      gap="m"
      align="start"
      inset="ml"
      *transloco="let t; prefix: 'charges.priceInformation'"
    >
      @for (period of chargeInformationPeriods(); track period) {
        <watt-card>
          <watt-card-title>
            <vater-stack gap="m" align="center" direction="row">
              <h3>
                {{ period.period | wattDate }}
              </h3>
              @if (period.isCurrent) {
                <watt-badge type="success">{{ t('current') }}</watt-badge>
              }
            </vater-stack>
          </watt-card-title>
          <watt-description-list variant="compact" [itemSeparators]="false">
            <watt-description-list-item [label]="t('name')">
              {{ period.name }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('description')">
              {{ period.description }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('vatClassification')">
              {{ 'charges.vatClassifications.' + period.vatClassification | transloco }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('transparentInvoicing')">
              {{ period.transparentInvoicing ? ('yes' | transloco) : ('no' | transloco) }}
            </watt-description-list-item>
          </watt-description-list>
        </watt-card>
      }
    </vater-stack>
  `,
})
export class DhChargesInformationPeriods {
  id = input.required<string>();
  query = query(GetChargeByIdDocument, () => ({ variables: { id: this.id() } }));
  chargeInformationPeriods = computed(() => this.query.data()?.chargeById?.periods ?? []);
}
