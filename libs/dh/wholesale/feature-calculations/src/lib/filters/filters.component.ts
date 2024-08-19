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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/picker/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import {
  CalculationOrchestrationState,
  CalculationQueryInput,
  CalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { getGridAreaOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<CalculationQueryInput>;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RxPush,
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
      <watt-date-range-chip [formControl]="this._formGroup.controls.period!">{{
        t('period')
      }}</watt-date-range-chip>

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
        formControlName="gridAreaCodes"
        [chipMode]="true"
        [multiple]="true"
        [options]="gridAreaOptions$ | push"
        [placeholder]="t('gridAreas')"
      />

      <watt-date-range-chip [formControl]="this._formGroup.controls.executionTime!">
        {{ t('executionTime') }}
      </watt-date-range-chip>

      <watt-dropdown
        formControlName="states"
        [chipMode]="true"
        [multiple]="true"
        [options]="executionStateOptions"
        [placeholder]="t('states')"
        dhDropdownTranslator
        translateKey="wholesale.calculations.states"
      />

      <vater-spacer />

      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhCalculationsFiltersComponent implements OnInit {
  @Input() initial?: CalculationQueryInput;
  @Output() filter = new EventEmitter<CalculationQueryInput>();

  _formGroup!: FormGroup<Filters>;

  calculationTypesOptions = dhEnumToWattDropdownOptions(CalculationType);
  gridAreaOptions$ = getGridAreaOptions();
  executionStateOptions = dhEnumToWattDropdownOptions(CalculationOrchestrationState, null, [
    CalculationOrchestrationState.ActorMessagesEnqueued,
  ]);

  ngOnInit() {
    this._formGroup = new FormGroup<Filters>({
      executionTime: dhMakeFormControl(this.initial?.executionTime),
      period: dhMakeFormControl(this.initial?.period),
      gridAreaCodes: dhMakeFormControl(this.initial?.gridAreaCodes),
      calculationTypes: dhMakeFormControl(this.initial?.calculationTypes),
      states: dhMakeFormControl(this.initial?.states),
    });

    this._formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value));
  }
}
