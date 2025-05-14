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
import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import {
  CalculationExecutionType,
  StartCalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { externalOnly } from '@energinet-datahub/dh/wholesale/domain';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-calculationtype-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <watt-dropdown
      *transloco="let t; prefix: 'wholesale.calculations.create.calculationType'"
      [label]="t('label')"
      [formControl]="control()"
      [options]="options()"
      [showResetOption]="false"
      [multiple]="false"
      dhDropdownTranslator
      translateKey="wholesale.calculations.calculationTypes"
      data-testid="newcalculation.calculationTypes"
    />
  `,
})
export class DhCalculationTypeField {
  control = input.required<FormControl<StartCalculationType>>();
  executionType = input<CalculationExecutionType | null>(null);
  options = computed(() =>
    this.executionType() === CalculationExecutionType.Internal
      ? dhEnumToWattDropdownOptions(StartCalculationType, externalOnly)
      : dhEnumToWattDropdownOptions(StartCalculationType)
  );

  updateSelectionEffect = effect(() => {
    const control = this.control();
    const options = this.options();
    if (options.some((option) => option.value === control.value)) return;
    control.setValue(this.options()[0].value as StartCalculationType);
  });
}
