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
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, output } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  ProcessState,
  CalculationType,
  CalculationExecutionType,
  GetProcessesQueryVariables,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { WattRange } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-processes-filters',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WattButtonComponent,
    WattDropdownComponent,
    WattFormChipDirective,
    WattQueryParamsDirective,
    WattDateRangeChipComponent,

    VaterStackComponent,
    VaterSpacerComponent,

    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form"
      wattQueryParams
      *transloco="let t; read: 'devExamples.processes.filters'"
    >
      <watt-dropdown
        [formControl]="form.controls.calculationTypes"
        [chipMode]="true"
        [multiple]="true"
        [options]="calculationTypesOptions"
        [placeholder]="t('calculationType')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.calculationTypes"
      />

      <watt-dropdown
        [formControl]="form.controls.executionType"
        [chipMode]="true"
        [options]="executionTypeOptions"
        [placeholder]="t('executionType')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.executionTypes"
      />

      <watt-dropdown
        [formControl]="form.controls.gridAreaCodes"
        [chipMode]="true"
        [multiple]="true"
        [options]="gridAreaOptions()"
        [placeholder]="t('gridAreas')"
      />

      <watt-dropdown
        [formControl]="form.controls.state"
        [chipMode]="true"
        [options]="executionStateOptions"
        [placeholder]="t('states')"
        dhDropdownTranslator
        translateKey="shared.states"
      />

      <watt-date-range-chip [formControl]="form.controls.period">{{
        t('period')
      }}</watt-date-range-chip>

      <vater-spacer />

      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhProcessesFiltersComponent {
  private gridAreasQuery = query(GetGridAreasDocument);
  private fb = inject(NonNullableFormBuilder);
  filter = output<GetProcessesQueryVariables>();

  calculationTypesOptions = dhEnumToWattDropdownOptions(CalculationType);
  executionTypeOptions = dhEnumToWattDropdownOptions(CalculationExecutionType);
  executionStateOptions = dhEnumToWattDropdownOptions(ProcessState);
  gridAreaOptions = computed(
    () =>
      this.gridAreasQuery.data()?.gridAreas.map((x) => ({
        value: x.code,
        displayValue: x.displayName,
      })) ?? []
  );

  form = this.fb.group({
    executionType: new FormControl<CalculationExecutionType | null>(null),
    period: new FormControl<WattRange<Date> | null>(null),
    gridAreaCodes: new FormControl<string[] | null>(null),
    calculationTypes: new FormControl<CalculationType[] | null>(null),
    state: new FormControl<ProcessState | null>(null),
  });

  values = toSignal<GetProcessesQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ calculationTypes, executionType, gridAreaCodes, period, state }) => ({
        input: {
          calculationTypes,
          executionType,
          gridAreaCodes,
          period,
          state,
        },
      }))
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }
}
