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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VATER } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDropdownComponent } from '@energinet/watt/dropdown';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import {
  ElectricityMarketMeteringPointType,
  ElectricityMarketViewConnectionState,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-master-data-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VATER,
    WATT_CARD,
    WattButtonComponent,
    WattDatepickerComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      display: block;
    }

    .items-group > * {
      width: 50%;
    }
  `,
  template: `
    <vater-flex
      gap="ml"
      *transloco="let t; prefix: 'reports.overview.newReport.meteringPointMasterData'"
    >
      <watt-card>
        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          id="master-data-form"
          vater-stack
          align="stretch"
        >
          <div class="items-group">
            <watt-datepicker [label]="t('date')" [formControl]="form.controls.date" />
          </div>

          <div class="items-group">
            <watt-dropdown
              [multiple]="true"
              sortDirection="asc"
              [label]="t('gridArea')"
              [formControl]="form.controls.gridAreas"
              [options]="[]"
              data-testid="masterDataReport.gridAreas"
            />
          </div>

          <div class="items-group">
            <watt-dropdown
              dhDropdownTranslator
              translateKey="meteringPointType"
              [label]="t('meteringPointTypes')"
              [multiple]="true"
              [formControl]="form.controls.meteringPointTypes"
              [options]="meteringPointTypesOptions"
              data-testid="masterDataReport.meteringPointTypes"
            />
          </div>

          <div class="items-group">
            <watt-dropdown
              dhDropdownTranslator
              translateKey="meteringPoint.overview.status"
              [label]="t('connectionStates')"
              [multiple]="true"
              [formControl]="form.controls.connectionState"
              [options]="connectionStateOptions"
              data-testid="masterDataReport.connectionStates"
            />
          </div>
        </form>
      </watt-card>

      <watt-button type="submit" formId="master-data-form" [block]="true">
        {{ t('submit') }}
      </watt-button>
    </vater-flex>
  `,
})
export class DhMeteringPointMasterDataReport {
  form = new FormGroup({
    date: dhMakeFormControl<Date | null>(null, Validators.required),
    gridAreas: dhMakeFormControl<string[] | null>(null),
    meteringPointTypes: dhMakeFormControl<ElectricityMarketMeteringPointType[] | null>(null),
    connectionState: dhMakeFormControl<ElectricityMarketViewConnectionState[] | null>(null),
  });

  meteringPointTypesOptions = dhEnumToWattDropdownOptions(ElectricityMarketMeteringPointType);
  connectionStateOptions = dhEnumToWattDropdownOptions(ElectricityMarketViewConnectionState, [
    ElectricityMarketViewConnectionState.NotUsed,
  ]);

  async submit() {
    if (this.form.invalid) return;

    const { date } = this.form.getRawValue();

    assertIsDefined(date);
  }
}
