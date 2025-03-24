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
import { Component, computed, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE } from '@energinet-datahub/watt/table';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { lazyQuery, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetGridAreasDocument,
  GetMeteringPointsByGridAreaDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { MeteringPointsGroupComponent } from './metering-points-group.component';

@Component({
  selector: 'dh-metering-point-debug',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_TABLE,
    WATT_CARD,
    WattDropdownComponent,
    VaterFlexComponent,
    VaterUtilityDirective,
    WattSpinnerComponent,
    MeteringPointsGroupComponent,
  ],
  template: `
    <div vater inset="ml" *transloco="let t; read: 'meteringPointDebug.meteringPoints'">
      <watt-card vater fill="vertical">
        <vater-flex fill="vertical" gap="m">
          <watt-dropdown
            [chipMode]="true"
            [formControl]="gridArea"
            [options]="gridAreaOptions()"
            [placeholder]="t('gridArea')"
          />

          <vater-flex fill="vertical" scrollable grow="0">
            @if (loading()) {
              <watt-spinner [diameter]="22" />
            }

            @for (group of meteringPointGroups(); track group.packageNumber) {
              <dh-metering-point-group [group]="group" class="watt-space-stack-m" />
            }
          </vater-flex>
        </vater-flex>
      </watt-card>
    </div>
  `,
})
export class DhMeteringPointsDebugComponent {
  private gridAreasQuery = query(GetGridAreasDocument);
  private query = lazyQuery(GetMeteringPointsByGridAreaDocument);

  gridArea = new FormControl<string | null>(null);

  private selectedGridArea = toSignal(this.gridArea.valueChanges);

  gridAreaOptions = computed(
    () =>
      this.gridAreasQuery
        .data()
        ?.gridAreas.map((area) => ({ displayValue: area.name, value: area.code })) ?? []
  );
  loading = this.query.loading;
  meteringPointGroups = computed(() => this.query.data()?.meteringPointsByGridAreaCode ?? []);

  constructor() {
    effect(() => {
      const selectedGridArea = this.selectedGridArea();

      if (selectedGridArea) {
        this.query.query({ variables: { gridAreaCode: selectedGridArea } });
      } else {
        this.query.reset();
      }
    });
  }
}
