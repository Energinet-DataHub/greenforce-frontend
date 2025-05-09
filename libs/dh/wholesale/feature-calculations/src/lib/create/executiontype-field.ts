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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CalculationExecutionType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattFieldComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattFieldComponent,
    WattFieldHintComponent,
    WattFilterChipComponent,
  ],
  selector: 'dh-calculations-executiontype-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .executionType {
      min-height: 100px;
    }
  `,
  template: `
    <watt-field
      *transloco="let t; read: 'wholesale.calculations'"
      [chipMode]="true"
      [control]="control()"
      [label]="t('create.executionType')"
      class="executionType"
    >
      <vater-stack direction="row" gap="s">
        <watt-filter-chip
          choice
          name="executionType"
          [value]="CalculationExecutionType.External"
          [selected]="control().value === CalculationExecutionType.External"
          (selectionChange)="control().setValue($event)"
          data-testid="calculation-external"
        >
          {{ t('executionTypes.EXTERNAL') }}
        </watt-filter-chip>
        <watt-filter-chip
          choice
          name="executionType"
          [value]="CalculationExecutionType.Internal"
          [selected]="control().value === CalculationExecutionType.Internal"
          (selectionChange)="control().setValue($event)"
          data-testid="calculation-internal"
        >
          {{ t('executionTypes.INTERNAL') }}
        </watt-filter-chip>
      </vater-stack>
      @if (control().value === CalculationExecutionType.External) {
        <watt-field-hint>{{ t('create.isExternalHint') }}</watt-field-hint>
      }
      @if (control().value === CalculationExecutionType.Internal) {
        <watt-field-hint>{{ t('create.isInternalHint') }}</watt-field-hint>
      }
    </watt-field>
  `,
})
export class DhCalculationsExecutionTypeField {
  control = input.required<FormControl<CalculationExecutionType | null>>();
  CalculationExecutionType = CalculationExecutionType;
}
