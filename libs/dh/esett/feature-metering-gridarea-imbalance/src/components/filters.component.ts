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
  effect,
  inject,
  output,
  computed,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { dayjs, WattRange } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattQueryParamsDirective } from '@energinet/watt/query-params';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet/watt/chip';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';

import {
  GetGridAreasDocument,
  MeteringGridImbalanceValuesToInclude,
  GetMeteringGridAreaImbalanceQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { dhEnumToWattDropdownOptions } from '@energinet-datahub/dh/shared/ui-util';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-metering-gridarea-imbalance-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    TranslocoDirective,
    ReactiveFormsModule,

    VaterStackComponent,
    VaterSpacerComponent,

    WattButtonComponent,
    WattFormChipDirective,
    WattDropdownComponent,
    WattQueryParamsDirective,
    WattDateRangeChipComponent,

    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form"
      wattQueryParams
      *transloco="let translate; prefix: 'eSett.meteringGridAreaImbalance.filters'"
    >
      <watt-dropdown
        [formControl]="form.controls.gridAreas"
        [chipMode]="true"
        [multiple]="true"
        sortDirection="asc"
        [options]="gridAreaOptions()"
        [placeholder]="translate('gridArea')"
      />

      <watt-dropdown
        dhDropdownTranslator
        translateKey="eSett.meteringGridAreaImbalance.shared.valuesToInclude"
        [formControl]="form.controls.valuesToInclude"
        [options]="valuestoIncludeOptions"
        [chipMode]="true"
        [showResetOption]="false"
        [placeholder]="translate('valuesToInclude')"
      />

      <watt-date-range-chip [showActions]="true" [formControl]="form.controls.created">
        {{ translate('createdPeriod') }}
      </watt-date-range-chip>

      <watt-date-range-chip [showActions]="true" [formControl]="form.controls.calculationPeriod">
        {{ translate('calculationPeriod') }}
      </watt-date-range-chip>

      <vater-spacer />
      <watt-button variant="text" icon="undo" type="reset">
        {{ translate('reset') }}
      </watt-button>
    </form>
  `,
})
export class DhMeteringGridAreaImbalanceFiltersComponent {
  private gridAreasQuery = query(GetGridAreasDocument);
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    gridAreas: this.fb.control(null),
    valuesToInclude: this.fb.control(MeteringGridImbalanceValuesToInclude.Imbalances),
    created: new FormControl<WattRange<Date>>({
      start: dayjs(new Date()).startOf('day').subtract(2, 'days').toDate(),
      end: dayjs(new Date()).endOf('day').toDate(),
    }),
    calculationPeriod: this.fb.control(null),
  });

  filter = output<GetMeteringGridAreaImbalanceQueryVariables>();

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

  values = toSignal<GetMeteringGridAreaImbalanceQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ calculationPeriod, created, gridAreas, valuesToInclude }) => ({
        calculationPeriod,
        created,
        gridAreaCodes: gridAreas,
        valuesToInclude,
      }))
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }
}
