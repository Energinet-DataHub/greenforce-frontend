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
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import {
  GetGridAreasDocument,
  MeteringGridImbalanceValuesToInclude,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';

import { DhMeteringGridAreaImbalanceFilters } from '../dh-metering-gridarea-imbalance-filters';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhMeteringGridAreaImbalanceFilters>;

@Component({
  selector: 'dh-metering-gridarea-imbalance-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-filters.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        overflow-y: hidden;
      }

      watt-dropdown {
        width: auto;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    WattDropdownComponent,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
  ],
})
export class DhMeteringGridAreaImbalanceFiltersComponent implements OnInit {
  private gridAreasQuery = query(GetGridAreasDocument);
  private readonly destroyRef = inject(DestroyRef);

  initial = input.required<DhMeteringGridAreaImbalanceFilters>();
  filter = output<DhMeteringGridAreaImbalanceFilters>();
  formReset = output<void>();

  gridAreaOptions = computed(
    () =>
      this.gridAreasQuery.data()?.gridAreas.map((x) => ({
        value: x.code,
        displayValue: x.displayName,
      })) ?? []
  );
  valuestoIncludeOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    MeteringGridImbalanceValuesToInclude
  );

  formGroup!: FormGroup<Filters>;

  ngOnInit(): void {
    this.formGroup = new FormGroup<Filters>({
      gridAreas: dhMakeFormControl(this.initial().gridAreas),
      valuesToInclude: dhMakeFormControl(this.initial().valuesToInclude),
      created: dhMakeFormControl(this.initial().created),
      calculationPeriod: dhMakeFormControl(this.initial().calculationPeriod),
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value as DhMeteringGridAreaImbalanceFilters));
  }
}
