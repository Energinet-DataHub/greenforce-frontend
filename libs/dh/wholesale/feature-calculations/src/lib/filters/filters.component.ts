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
import {
  input,
  output,
  effect,
  inject,
  computed,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { map, startWith } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { WattRange } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';

import {
  ProcessState,
  GetGridAreasDocument,
  CalculationsQueryInput,
  CalculationExecutionType,
  GetCalculationsQueryVariables,
  CalculationTypeQueryParameterV1,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterSpacerComponent,
    VaterStackComponent,

    WattButtonComponent,
    WattDropdownComponent,
    WattFormChipDirective,
    WattQueryParamsDirective,
    WattDateRangeChipComponent,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-calculations-filters',
  template: `
    <form
      vater-stack
      scrollable
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form"
      wattQueryParams
      *transloco="let t; prefix: 'wholesale.calculations.filters'"
    >
      <watt-dropdown
        formControlName="calculationTypes"
        [chipMode]="true"
        [multiple]="true"
        [options]="calculationTypesOptions"
        [placeholder]="t('calculationType')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.calculationTypes"
      />

      <watt-dropdown
        formControlName="executionType"
        [chipMode]="true"
        [options]="executionTypeOptions"
        [placeholder]="t('executionType')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.executionTypes"
      />

      <watt-date-range-chip [formControl]="this.form.controls.period!">{{
        t('period')
      }}</watt-date-range-chip>

      <watt-dropdown
        formControlName="gridAreaCodes"
        [chipMode]="true"
        [multiple]="true"
        [options]="gridAreaOptions()"
        [placeholder]="t('gridAreas')"
      />

      <watt-dropdown
        formControlName="state"
        [chipMode]="true"
        [options]="executionStateOptions"
        [placeholder]="t('states')"
        dhDropdownTranslator
        translateKey="shared.states"
      />

      <vater-spacer />

      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhCalculationsFiltersComponent {
  private gridAreaQuery = query(GetGridAreasDocument);
  private fb = inject(NonNullableFormBuilder);
  initial = input<CalculationsQueryInput>();
  filter = output<GetCalculationsQueryVariables>();

  form = this.fb.group({
    executionType: new FormControl<CalculationExecutionType | null>(null),
    period: this.fb.control<WattRange<Date> | null>(null),
    gridAreaCodes: this.fb.control<string[] | null>(null),
    calculationTypes: this.fb.control<CalculationTypeQueryParameterV1[] | null>(null),
    state: this.fb.control<ProcessState | null>(null),
  });

  calculationTypesOptions = dhEnumToWattDropdownOptions(CalculationTypeQueryParameterV1);
  executionTypeOptions = dhEnumToWattDropdownOptions(CalculationExecutionType);
  gridAreaOptions = computed(
    () =>
      this.gridAreaQuery.data()?.gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: gridArea.displayName,
      })) ?? []
  );
  executionStateOptions = dhEnumToWattDropdownOptions(ProcessState);

  constructor() {
    effect(() => {
      const initial = this.initial();
      this.form.controls.executionType.setValue(initial?.executionType ?? null);
      this.form.controls.period.setValue(initial?.period ?? null);
      this.form.controls.gridAreaCodes.setValue(initial?.gridAreaCodes ?? null);
      this.form.controls.calculationTypes.setValue(initial?.calculationTypes ?? null);
      this.form.controls.state.setValue(initial?.state ?? null);
    });

    effect(() => {
      this.filter.emit(this.values());
    });
  }

  values = toSignal<GetCalculationsQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ calculationTypes, executionType, gridAreaCodes, period, state }) => ({
        input: {
          calculationTypes: calculationTypes ?? [],
          executionType: executionType ?? null,
          gridAreaCodes: gridAreaCodes ?? [],
          period: period ?? null,
          state: state ?? null,
        },
      }))
    ),
    { requireSync: true }
  );
}
