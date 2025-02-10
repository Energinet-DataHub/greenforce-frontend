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
import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';

import { GetProcessesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { Process } from './types';
import { DhProcessesFiltersComponent } from './filters.component';
import { GetProcessesQueryVariables } from '@energinet-datahub/dh/shared/domain/graphql';

type Variables = Partial<GetProcessesQueryVariables>;

@Component({
  selector: 'dh-processes',
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
    WattDataFiltersComponent,

    VaterUtilityDirective,

    DhProcessStateBadge,
    DhProcessesFiltersComponent,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      vater
      inset="ml"
      [enableSearch]="false"
      *transloco="let t; read: 'devExamples.processes.table'"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('headline') }}</h3>

      <watt-data-filters>
        <dh-processes-filters (filter)="fetch($event)" />
      </watt-data-filters>

      <watt-table
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        (rowClick)="navigation.navigate('details', $event.id)"
      >
        <ng-container
          *wattTableCell="columns.createdAt; header: t('columns.createdAt'); let element"
        >
          {{ element.createdAt | wattDate }}
        </ng-container>
        <ng-container
          *wattTableCell="columns.scheduledAt; header: t('columns.scheduledAt'); let element"
        >
          {{ element.scheduledAt | wattDate }}
        </ng-container>
        <ng-container
          *wattTableCell="
            columns.calculationType;
            header: t('columns.calculationType');
            let element
          "
        >
          {{ 'shared.calculationTypes.' + element.calculationType | transloco }}
        </ng-container>
        <ng-container *wattTableCell="columns.state; header: t('columns.state'); let element">
          <dh-process-state-badge [status]="element.state">{{
            'shared.states.' + element.state | transloco
          }}</dh-process-state-badge>
        </ng-container>
        <ng-container
          *wattTableCell="columns.terminatedAt; header: t('columns.terminatedAt'); let element"
        >
          {{ element.terminatedAt | wattDate }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhProcessesComponent {
  navigation = inject(DhNavigationService);

  columns: WattTableColumnDef<Process> = {
    id: { accessor: 'id' },
    createdAt: { accessor: 'createdAt' },
    scheduledAt: { accessor: 'scheduledAt' },
    terminatedAt: { accessor: 'terminatedAt' },
    state: { accessor: 'state' },
    calculationType: { accessor: 'calculationType' },
    createdBy: { accessor: (x) => x.createdBy?.displayName },
  };

  dataSource = new GetProcessesDataSource();

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
  };
}
