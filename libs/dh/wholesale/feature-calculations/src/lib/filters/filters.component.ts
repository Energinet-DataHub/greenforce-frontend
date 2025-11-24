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
import { computed, Component, ChangeDetectionStrategy, untracked, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattQueryParamsDirective } from '@energinet/watt/query-params';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet/watt/chip';
import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
  dhMakeFormControl, DhResetFiltersButtonComponent,
} from '@energinet-datahub/dh/shared/ui-util';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  ProcessState,
  GetGridAreasDocument,
  CalculationsQueryInput,
  CalculationExecutionType,
  CalculationTypeQueryParameterV1,
} from '@energinet-datahub/dh/shared/domain/graphql';

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
    DhResetFiltersButtonComponent,
  ],
  selector: 'dh-calculations-filters',
  template: `
    <form
      vater-stack
      scrollable
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form()"
      wattQueryParams
      *transloco="let t; prefix: 'wholesale.calculations.filters'"
    >
      <watt-dropdown
        [formControl]="this.form().controls.calculationTypes"
        [chipMode]="true"
        [multiple]="true"
        [options]="calculationTypesOptions"
        [placeholder]="t('calculationType')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.calculationTypes"
      />

      <watt-dropdown
        [formControl]="this.form().controls.executionType"
        [chipMode]="true"
        [options]="executionTypeOptions"
        [placeholder]="t('executionType')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.executionTypes"
      />

      <watt-date-range-chip [formControl]="this.form().controls.period">
        {{ t('period') }}
      </watt-date-range-chip>

      <watt-dropdown
        [formControl]="this.form().controls.gridAreaCodes"
        [chipMode]="true"
        [multiple]="true"
        [options]="gridAreaOptions()"
        [placeholder]="t('gridAreas')"
      />

      <watt-dropdown
        [formControl]="this.form().controls.state"
        [chipMode]="true"
        [options]="executionStateOptions"
        [placeholder]="t('states')"
        dhDropdownTranslator
        translateKey="shared.states"
      />

      <vater-spacer />
      <dh-reset-filters-button [text]="t('reset')" />
    </form>
  `,
})
export class DhCalculationsFiltersComponent {
  private gridAreaQuery = query(GetGridAreasDocument);

  filter = model<CalculationsQueryInput>({});

  form = computed(() => {
    const initial = untracked(() => this.filter());
    return new FormGroup({
      executionType: dhMakeFormControl(initial.executionType),
      period: dhMakeFormControl(initial.period),
      gridAreaCodes: dhMakeFormControl(initial.gridAreaCodes),
      calculationTypes: dhMakeFormControl(initial.calculationTypes),
      state: dhMakeFormControl(initial.state),
    });
  });

  calculationTypesOptions = dhEnumToWattDropdownOptions(CalculationTypeQueryParameterV1);
  executionTypeOptions = dhEnumToWattDropdownOptions(CalculationExecutionType);
  executionStateOptions = dhEnumToWattDropdownOptions(ProcessState);
  gridAreaOptions = computed(
    () =>
      this.gridAreaQuery.data()?.gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: gridArea.displayName,
      })) ?? []
  );

  constructor() {
    toObservable(this.form)
      .pipe(switchMap((form) => form.valueChanges))
      .subscribe((value) => this.filter.set(value));
  }
}
