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
import { input, signal, computed, Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_SEGMENTED_BUTTONS } from '@energinet/watt/segmented-buttons';

import { GetChargeByIdDocument, ChargeType } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/util-release-toggle';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhChargesSeriesWeekTable } from './series-week';
import { DhChargesSeriesTable } from './series';

const tariffChargeTypes: ChargeType[] = ['TARIFF', 'TARIFF_TAX'];

@Component({
  selector: 'dh-series-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VATER,
    WATT_SEGMENTED_BUTTONS,
    DhReleaseToggleDirective,
    DhChargesSeriesWeekTable,
    DhChargesSeriesTable,
  ],
  template: `
    <vater-flex inset="ml" gap="ml" *transloco="let t; prefix: 'charges.tariff.navigation'">
      <ng-container *dhReleaseToggle="'PM58-PRICES-WEEK-VIEW-UI'; else elseTmpl">
        @if (isHourlyTariff()) {
          <vater-stack>
            <watt-segmented-buttons [(selected)]="view">
              <watt-segmented-button value="day">{{ t('day') }}</watt-segmented-button>
              <watt-segmented-button value="week">{{ t('week') }}</watt-segmented-button>
            </watt-segmented-buttons>
          </vater-stack>
        }

        <vater-flex fill="vertical">
          @if (isHourlyTariff() && view() === 'week') {
            <dh-charges-series-week-table [id]="id()" />
          } @else {
            <dh-charges-series-table [id]="id()" />
          }
        </vater-flex>
      </ng-container>

      <ng-template #elseTmpl>
        <vater-flex fill="vertical">
          <dh-charges-series-table [id]="id()" />
        </vater-flex>
      </ng-template>
    </vater-flex>
  `,
})
export class DhSeriesPage {
  id = input.required<string>();

  protected chargeByIdQuery = query(GetChargeByIdDocument, () => ({
    variables: { id: this.id() },
  }));

  view = signal<'day' | 'week'>('day');

  charge = computed(() => this.chargeByIdQuery.data()?.chargeById);
  type = computed(() => this.charge()?.type);
  resolution = computed(() => this.charge()?.resolution);

  isHourlyTariff = computed(() => {
    const type = this.type();
    const resolution = this.resolution();

    if (!type || !resolution) return null;

    return tariffChargeTypes.includes(type) && resolution === 'HOURLY';
  });
}
