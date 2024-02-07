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
  Output,
  EventEmitter,
  inject,
  OnInit,
  Input,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { DhCalculationsFiltersComponent } from '../filters/filters.component';
import { BehaviorSubject, filter, switchMap } from 'rxjs';
import sub from 'date-fns/sub';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { Apollo } from 'apollo-angular';
import {
  GetCalculationsDocument,
  GetCalculationsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

type wholesaleTableData = WattTableDataSource<Calculation>;

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    DhCalculationsFiltersComponent,
    WattDatePipe,
    TranslocoModule,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattBadgeComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattEmptyStateComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-calculations-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsTableComponent implements OnInit {
  private apollo = inject(Apollo);

  @Input() id?: string;
  @Output() selectedRow = new EventEmitter();
  @Output() create = new EventEmitter<void>();

  loading = false;
  error = false;

  filter$ = new BehaviorSubject<GetCalculationsQueryVariables>({
    executionTime: {
      start: sub(startOfDay(new Date()), { days: 10 }),
      end: endOfDay(new Date()),
    },
  });

  calculations$ = this.filter$.pipe(
    filter((variables) => !!variables.executionTime?.start && !!variables.executionTime?.end),
    switchMap(
      (variables) =>
        this.apollo.watchQuery({
          pollInterval: 10000,
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetCalculationsDocument,
          variables: variables,
        }).valueChanges
    ),
    takeUntilDestroyed()
  );

  dataSource: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Calculation> = {
    startedBy: { accessor: 'createdByUserName' },
    periodFrom: { accessor: (calculation) => calculation.period?.start },
    periodTo: { accessor: (calculation) => calculation.period?.end },
    executionTime: { accessor: 'executionTimeStart' },
    calculationType: { accessor: 'calculationType' },
    status: { accessor: 'executionState' },
  };

  getActiveRow = () => this.dataSource.data.find((row) => row.id === this.id);

  ngOnInit() {
    this.calculations$.subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.error = !!result.errors;
        if (result.data?.calculations) this.dataSource.data = result.data.calculations;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }
}
