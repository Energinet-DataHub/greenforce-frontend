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
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';

import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import {
  CalculationExecutionType,
  CalculationsQueryInput,
  ProcessState,
  CalculationType,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<CalculationsQueryInput>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattDropdownComponent,
    WattFormChipDirective,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-calculations-filters',
  styles: [
    `
      form {
        overflow-y: hidden;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="_formGroup"
      wattQueryParams
      *transloco="let t; read: 'wholesale.calculations.filters'"
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

      <watt-date-range-chip [formControl]="this._formGroup.controls.period!">{{
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
export class DhCalculationsFiltersComponent implements OnInit {
  private gridAreaQuery = query(GetGridAreasDocument);
  @Input() initial?: CalculationsQueryInput;
  @Output() filter = new EventEmitter<CalculationsQueryInput>();

  _formGroup!: FormGroup<Filters>;

  calculationTypesOptions = dhEnumToWattDropdownOptions(CalculationType);
  executionTypeOptions = dhEnumToWattDropdownOptions(CalculationExecutionType);
  gridAreaOptions = computed(
    () =>
      this.gridAreaQuery.data()?.gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: gridArea.name,
      })) ?? []
  );
  executionStateOptions = dhEnumToWattDropdownOptions(ProcessState);

  ngOnInit() {
    this._formGroup = new FormGroup<Filters>({
      executionType: dhMakeFormControl(this.initial?.executionType),
      period: dhMakeFormControl(this.initial?.period),
      gridAreaCodes: dhMakeFormControl(this.initial?.gridAreaCodes),
      calculationTypes: dhMakeFormControl(this.initial?.calculationTypes),
      state: dhMakeFormControl(this.initial?.state),
    });

    this._formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value));
  }
}
