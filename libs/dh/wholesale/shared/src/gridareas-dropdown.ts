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
import {
  GetRelevantGridAreasDocument,
  PeriodInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery, QueryStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  imports: [ReactiveFormsModule, TranslocoDirective, WattDropdownComponent, WattFieldHintComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-calculations-grid-areas-dropdown',
  template: `
    <watt-dropdown
      *transloco="let t; read: 'wholesale.calculations'"
      [label]="t('create.gridArea.label')"
      [formControl]="control()"
      [options]="gridAreaOptions()"
      [showResetOption]="showResetOption()"
      [multiple]="multiple()"
    >
      @if (isLoading()) {
        <watt-field-hint class="watt-dots">{{ t('create.gridArea.loading') }}</watt-field-hint>
      } @else if (isResolved() && multiple()) {
        <watt-field-hint>
          {{ t('create.gridArea.hint', { count: control().value?.length }) }}
        </watt-field-hint>
      }
    </watt-dropdown>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhCalculationsGridAreasDropdown {
  multiple = input(true);
  control = input.required<FormControl<string[] | string | null>>();
  showResetOption = input(true);
  disabled = input(false);
  period = input<PeriodInput | null>(null);

  gridAreasQuery = lazyQuery(GetRelevantGridAreasDocument);
  isLoading = computed(() => this.gridAreasQuery.status() === QueryStatus.Loading);
  isResolved = computed(() => this.gridAreasQuery.status() === QueryStatus.Resolved);
  gridAreas = computed(() => this.gridAreasQuery.data()?.relevantGridAreas ?? []);
  gridAreaOptions = computed(() =>
    this.gridAreas().map((gridArea) => ({
      displayValue: gridArea.displayName,
      value: gridArea.code,
    }))
  );

  constructor() {
    effect(() => {
      const control = this.control();
      const period = this.period();
      const disabled = this.disabled();

      if (!disabled && period) {
        control.enable();
        this.gridAreasQuery.refetch({ period });
      } else {
        control.disable();
        this.gridAreasQuery.reset();
      }

      // User did not touch the field yet
      control.reset();
      control.markAsUntouched();
    });

    effect(() => {
      const control = this.control();
      const gridAreas = this.gridAreas();
      const multiple = this.multiple();
      const showResetOption = this.showResetOption();

      // Only preselect certain types of grid areas
      if (multiple && gridAreas.length > 0) {
        control.patchValue(
          gridAreas
            .filter((gridArea) => gridArea.includedInCalculation)
            .map((gridArea) => gridArea.code)
        );
      }

      // Preselect if there is only a single option and it cannot be empty
      if (!showResetOption && !multiple && gridAreas.length === 1) {
        control.patchValue(gridAreas[0].code);
      }
    });
  }
}
