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
import { PushModule } from '@rx-angular/template/push';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { debounceTime, map } from 'rxjs';

import { WATT_FORM_FIELD, WattFormChipDirective } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import {
  GetBatchesQueryVariables,
  GetGridAreasDocument,
  BatchState,
  ProcessType,
} from '@energinet-datahub/dh/shared/domain/graphql';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<GetBatchesQueryVariables>;

/** Helper function for creating form control with `nonNullable` based on value. */
const makeFormControl = <T>(value: T = null as T) =>
  new FormControl(value, { nonNullable: Boolean(value) });

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PushModule,
    ReactiveFormsModule,
    TranslocoModule,
    WATT_FORM_FIELD,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattDropdownComponent,
    WattFormChipDirective,
  ],
  selector: 'dh-wholesale-form',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        display: flex;
        gap: 1rem;
        align-items: center;
        overflow: auto;
        overflow-y: hidden;
      }

      watt-button {
        margin-left: auto;
      }
    `,
  ],
  template: `
    <form [formGroup]="_formGroup" *transloco="let t; read: 'wholesale.searchBatch'">
      <watt-date-range-chip formControlName="period">{{
        'shared.form.filters.period' | transloco
      }}</watt-date-range-chip>

      <watt-form-field>
        <watt-dropdown
          formControlName="processTypes"
          [chipMode]="true"
          [multiple]="true"
          [options]="_processTypeOptions | push"
          [placeholder]="t('filters.processType')"
        />
      </watt-form-field>

      <watt-form-field>
        <watt-dropdown
          formControlName="gridAreaCodes"
          [chipMode]="true"
          [multiple]="true"
          [options]="_gridAreaOptions | push"
          [placeholder]="t('filters.gridAreas')"
        />
      </watt-form-field>

      <watt-date-range-chip formControlName="executionTime">
        {{ t('filters.executionTime') }}
      </watt-date-range-chip>

      <watt-form-field>
        <watt-dropdown
          formControlName="executionStates"
          [chipMode]="true"
          [multiple]="true"
          [options]="_executionStateOptions | push"
          [placeholder]="t('filters.executionStates')"
        />
      </watt-form-field>

      <watt-button variant="text" icon="undo" type="reset">
        {{ 'shared.form.reset' | transloco }}
      </watt-button>
    </form>
  `,
})
export class DhWholesaleFormComponent implements OnInit {
  @Input() initial?: GetBatchesQueryVariables;
  @Output() filter = new EventEmitter<GetBatchesQueryVariables>();

  private apollo = inject(Apollo);
  private transloco = inject(TranslocoService);

  _formGroup!: FormGroup<Filters>;

  _processTypeOptions = this.transloco
    .selectTranslateObject('wholesale')
    .pipe(map((t) => Object.values(ProcessType).map((k) => ({ displayValue: t[k], value: k }))));

  _executionStateOptions = this.transloco
    .selectTranslateObject('wholesale.searchBatch')
    .pipe(map((t) => Object.values(BatchState).map((k) => ({ displayValue: t[k], value: k }))));

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
