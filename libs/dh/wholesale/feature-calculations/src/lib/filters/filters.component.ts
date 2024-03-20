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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { debounceTime, map } from 'rxjs';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import {
  GetCalculationsQueryVariables,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { executionStates, calculationTypes } from '@energinet-datahub/dh/wholesale/domain';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<GetCalculationsQueryVariables>;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RxPush,
    TranslocoModule,
    VaterSpacerComponent,
    VaterStackComponent,
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
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="_formGroup"
      *transloco="let t; read: 'wholesale.calculations.filters'"
    >
      <watt-date-range-chip [formControl]="this._formGroup.controls.period!">{{
        t('period')
      }}</watt-date-range-chip>
      <watt-dropdown
        formControlName="calculationTypes"
        [chipMode]="true"
        [multiple]="true"
        [options]="_calculationTypeOptions | push"
        [placeholder]="t('calculationType')"
      />
      <watt-dropdown
        formControlName="gridAreaCodes"
        [chipMode]="true"
        [multiple]="true"
        [options]="_gridAreaOptions | push"
        [placeholder]="t('gridAreas')"
      />
      <watt-date-range-chip [formControl]="this._formGroup.controls.executionTime!">
        {{ t('executionTime') }}
      </watt-date-range-chip>
      <watt-dropdown
        formControlName="executionStates"
        [chipMode]="true"
        [multiple]="true"
        [options]="_executionStateOptions | push"
        [placeholder]="t('executionStates')"
      />
      <vater-spacer />
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

  _calculationTypeOptions = this.transloco
    .selectTranslateObject('wholesale.calculations.calculationTypes')
    .pipe(
      map((translations) =>
        calculationTypes.map((calculationType) => ({
          displayValue: this.transloco.translate(
            translations[calculationType].replace(/{{|}}/g, '')
          ),
          value: calculationType,
        }))
      )
    );

  _executionStateOptions = this.transloco
    .selectTranslateObject('wholesale.calculations.executionStates')
    .pipe(map((t) => executionStates.map((k) => ({ displayValue: t[k], value: k }))));

  _gridAreaOptions = this.apollo.watchQuery({ query: GetGridAreasDocument }).valueChanges.pipe(
    map((result) => result.data?.gridAreas),
    exists(),
    map((gridAreas) =>
      gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: gridArea.displayName,
      }))
    )
  );

  ngOnInit() {
    this._formGroup = new FormGroup<Filters>({
      executionTime: dhMakeFormControl(this.initial?.executionTime),
      period: dhMakeFormControl(this.initial?.period),
      gridAreaCodes: dhMakeFormControl(this.initial?.gridAreaCodes),
      calculationTypes: dhMakeFormControl(this.initial?.calculationTypes),
      executionStates: dhMakeFormControl(this.initial?.executionStates),
    });

    this._formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value));
  }
}
