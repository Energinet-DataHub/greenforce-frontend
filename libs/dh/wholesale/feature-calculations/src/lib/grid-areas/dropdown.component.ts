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
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GetRelevantGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { lazyQuery, QueryStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { WattRange } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  imports: [ReactiveFormsModule, TranslocoDirective, WattDropdownComponent, WattFieldHintComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-calculations-grid-areas-dropdown',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <watt-dropdown
      style="width: 100%;"
      *transloco="let t; read: 'wholesale.calculations'"
      [label]="t('create.gridArea.label')"
      [formControl]="control()"
      [options]="gridAreaOptions()"
      [showResetOption]="false"
      [multiple]="true"
    >
      @if (isResolved()) {
        <watt-field-hint>
          {{ t('create.gridArea.hint', { count: control().value?.length }) }}
        </watt-field-hint>
      }
    </watt-dropdown>
  `,
})
export class DhCalculationsGridAreasDropdownComponent {
  featureFlags = inject(DhFeatureFlagsService);

  control = input.required<FormControl<string[] | null>>();
  period = input<WattRange<Date> | null>();

  gridAreasQuery = lazyQuery(GetRelevantGridAreasDocument, { fetchPolicy: 'network-only' });
  isResolved = computed(() => this.gridAreasQuery.status() === QueryStatus.Resolved);

  fetchGridAreas = effect(() => {
    const period = this.period();
    if (!period) this.gridAreasQuery.reset();
    else this.gridAreasQuery.refetch({ period });
  });

  gridAreas = computed(() => {
    const gridAreas = this.gridAreasQuery.data()?.relevantGridAreas ?? [];

    // HACK: This is a temporary solution to filter out grid areas that has no data
    return this.featureFlags.isEnabled('calculations-include-all-grid-areas')
      ? gridAreas
      : gridAreas.filter((g) => ['803', '804', '533', '543', '584', '950'].includes(g.code));
  });

  gridAreaOptions = computed(() =>
    this.gridAreas().map((gridArea) => ({
      displayValue: gridArea.displayName,
      value: gridArea.code,
    }))
  );

  selectGridAreas = effect(() => {
    this.control().patchValue(
      this.gridAreas()
        .filter((gridArea) => gridArea.includedInCalculation)
        .map((gridArea) => gridArea.code)
    );
  });

  toggleDisable = effect(() => {
    const isResolved = this.isResolved();
    const control = this.control();
    if (isResolved && control.enabled) return;
    if (isResolved) control.enable();
    else control.disable();
  });
}
