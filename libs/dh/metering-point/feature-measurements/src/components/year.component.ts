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
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  effect,
  inject,
  input,
  signal,
  computed,
  Component,
  LOCALE_ID,
  ViewEncapsulation,
} from '@angular/core';

import { debounceTime, map, startWith } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  Quality,
  Resolution,
  GetAggregatedMeasurementsForYearDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { getPath, MeasurementsSubPaths } from '@energinet-datahub/dh/core/routing';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhFormControlToSignal } from '@energinet-datahub/dh/shared/ui-util';

import { VaterStackComponent } from '@energinet/watt/vater';
import { dayjs, WattSupportedLocales } from '@energinet/watt/date';
import { WattYearField, YEAR_FORMAT } from '@energinet/watt/year-field';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';

import { DhFormatObservationTimePipe } from './format-observation-time.pipe';
import { dhFormatMeasurementNumber } from '../utils/dh-format-measurement-number';
import {
  AggregatedMeasurementsForYear,
  AggregatedMeasurementsByYearQueryVariables,
} from '../types';
import { persistDateFilter } from '../utils/persist-date-filter';

@Component({
  selector: 'dh-measurements-year',
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_TABLE,
    WattYearField,
    WattDataTableComponent,
    WattDataFiltersComponent,

    VaterStackComponent,

    DhFormatObservationTimePipe,
  ],
  styles: `
    @use '@energinet/watt/utils' as watt;

    dh-measurements-year {
      watt-year-field {
        width: 250px;
      }

      .capitalize {
        text-transform: capitalize;
      }
    }
  `,
  template: `
    <watt-data-table
      [header]="false"
      [error]="query.error()"
      [ready]="query.called()"
      [enablePaginator]="false"
    >
      <watt-data-filters>
        <form [formGroup]="form">
          <vater-stack direction="row" gap="ml" align="baseline">
            <watt-year-field [formControl]="form.controls.year" canStepThroughYears />
          </vater-stack>
        </form>
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [stickyFooter]="true"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
        (rowClick)="navigateToMonth($event.yearMonth)"
      >
        <ng-container *wattTableCell="columns.month; let element">
          {{ element.yearMonth | dhFormatObservationTime: Resolution.Monthly }}
        </ng-container>

        <ng-container *wattTableCell="columns.currentQuantity; let element">
          @if (element.qualities.includes(Quality.Estimated)) {
            ≈
          }
          {{ formatNumber(element.quantity) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsYearComponent {
  private actor = inject(DhActorStorage);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(NonNullableFormBuilder);
  private transloco = inject(TranslocoService);
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private sum = computed(
    () =>
      `${this.formatNumber(
        this.measurements()
          .map((x) => x.quantity)
          .filter((quantity) => quantity !== null && quantity !== undefined)
          .reduce((acc, quantity) => acc + Number(quantity), 0)
      )} ${this.unit()}`
  );
  private unit = computed(() => {
    const [firstItem] = this.measurements();
    if (!firstItem) return '';

    return this.transloco.translate('meteringPoint.measurements.units.' + firstItem.unit);
  });
  private measurements = computed(() => this.query.data()?.aggregatedMeasurementsForYear ?? []);
  private dateFilter = persistDateFilter();
  form = this.fb.group({
    year: this.fb.control<string>(this.dateFilter().format(YEAR_FORMAT)),
  });

  year = dhFormControlToSignal(this.form.controls.year);
  filterEffect = effect(() => this.dateFilter.update((d) => d.year(dayjs(this.year()).year())));

  meteringPointId = input.required<string>();
  query = lazyQuery(GetAggregatedMeasurementsForYearDocument);
  Resolution = Resolution;
  Quality = Quality;

  columns: WattTableColumnDef<AggregatedMeasurementsForYear> = {
    month: {
      accessor: 'yearMonth',
      size: 'min-content',
      dataCellClass: 'capitalize',
      footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
    },
    currentQuantity: {
      accessor: 'quantity',
      align: 'right',
      tooltip: `${this.transloco.translate('meteringPoint.measurements.tooltip')}`,
      footer: { value: this.sum },
    },
    filler: {
      accessor: null,
      header: '',
      size: '1fr',
    },
  };

  dataSource = new WattTableDataSource<AggregatedMeasurementsForYear>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.measurements() ?? [];
    });

    effect(() => {
      this.query.refetch({
        ...this.values(),
        meteringPointId: this.meteringPointId(),
      });
    });
  }

  values = toSignal<AggregatedMeasurementsByYearQueryVariables>(
    this.form.valueChanges.pipe(
      debounceTime(500),
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(
        ({ year }): AggregatedMeasurementsByYearQueryVariables => ({
          year: parseInt(year),
          actorNumber: this.actor.getSelectedActor().gln,
          marketRole: this.actor.getSelectedActor().marketRole,
        })
      )
    ),
    { requireSync: true }
  );

  formatNumber(value: number | null | undefined) {
    return dhFormatMeasurementNumber(value, this.locale);
  }

  navigateToMonth(yearMonth: string | undefined | null) {
    if (!yearMonth) return;

    this.router.navigate(['../', this.getLink('month')], {
      queryParams: { filter: dayjs(yearMonth, 'YYYY-MM').format('YYYY-MM-DD') },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  private getLink = (key: MeasurementsSubPaths) => getPath<MeasurementsSubPaths>(key);
}
