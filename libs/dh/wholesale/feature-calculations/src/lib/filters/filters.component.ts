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
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { debounceTime, map } from 'rxjs';

import { WATT_FORM_FIELD, WattFormChipDirective } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import {
  GetCalculationsQueryVariables,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { executionStates, processTypes } from '@energinet-datahub/dh/wholesale/domain';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<GetCalculationsQueryVariables>;

/** Helper function for creating form control with `nonNullable` based on value. */
const makeFormControl = <T>(value: T = null as T) =>
  new FormControl(value, { nonNullable: Boolean(value) });

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RxPush,
    ReactiveFormsModule,
    TranslocoModule,
    VaterStackComponent,
    WATT_FORM_FIELD,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattDropdownComponent,
    WattFormChipDirective,
  ],
  selector: 'dh-calculations-filters',
  styles: [
    `
      form {
        overflow-y: hidden;
      }

      watt-button {
        margin-left: auto;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="m"
      [formGroup]="_formGroup"
      *transloco="let t; read: 'wholesale.calculations.filters'"
    >
      <watt-date-range-chip formControlName="period">{{ t('period') }}</watt-date-range-chip>

      <watt-form-field>
        <watt-dropdown
          formControlName="processTypes"
          [chipMode]="true"
          [multiple]="true"
          [options]="_processTypeOptions | push"
          [placeholder]="t('processType')"
        />
      </watt-form-field>

      <watt-form-field>
        <watt-dropdown
          formControlName="gridAreaCodes"
          [chipMode]="true"
          [multiple]="true"
          [options]="_gridAreaOptions | push"
          [placeholder]="t('gridAreas')"
        />
      </watt-form-field>

      <watt-date-range-chip formControlName="executionTime">
        {{ t('executionTime') }}
      </watt-date-range-chip>

      <watt-form-field>
        <watt-dropdown
          formControlName="executionStates"
          [chipMode]="true"
          [multiple]="true"
          [options]="_executionStateOptions | push"
          [placeholder]="t('executionStates')"
        />
      </watt-form-field>

      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhCalculationsFiltersComponent implements OnInit {
  @Input() initial?: GetCalculationsQueryVariables;
  @Output() filter = new EventEmitter<GetCalculationsQueryVariables>();

  private apollo = inject(Apollo);
  private transloco = inject(TranslocoService);

  _formGroup!: FormGroup<Filters>;

  _processTypeOptions = this.transloco
    .selectTranslateObject('wholesale.calculations.processTypes')
    .pipe(map((t) => processTypes.map((k) => ({ displayValue: t[k], value: k }))));

  _executionStateOptions = this.transloco
    .selectTranslateObject('wholesale.calculations.executionStates')
    .pipe(map((t) => executionStates.map((k) => ({ displayValue: t[k], value: k }))));

  _gridAreaOptions = this.apollo.watchQuery({ query: GetGridAreasDocument }).valueChanges.pipe(
    map((result) => result.data?.gridAreas),
    exists(),
    map((gridAreas) =>
      gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: `${gridArea.name} (${gridArea.code})`,
      }))
    )
  );

  ngOnInit() {
    this._formGroup = new FormGroup<Filters>({
      executionTime: makeFormControl(this.initial?.executionTime),
      period: makeFormControl(this.initial?.period),
      gridAreaCodes: makeFormControl(this.initial?.gridAreaCodes),
      processTypes: makeFormControl(this.initial?.processTypes),
      executionStates: makeFormControl(this.initial?.executionStates),
    });

    this._formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value));
  }
}
