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
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';
import { Component, computed, effect, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhOrganization } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhOrganizationsTableComponent } from './table/dh-table.component';
import { DhOrganizationDrawerComponent } from './drawer/dh-organization-drawer.component';

@Component({
  standalone: true,
  selector: 'dh-organizations-overview',
  templateUrl: './dh-organizations-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    WattPaginatorComponent,
    WattSearchComponent,
    WattButtonComponent,

    DhOrganizationsTableComponent,
    DhOrganizationDrawerComponent,
  ],
})
export class DhOrganizationsOverviewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private getOrganizationsQuery = query(GetOrganizationsDocument);

  id = toSignal<string>(this.route.queryParams.pipe(map((p) => p.id ?? undefined)));

  tableDataSource = new WattTableDataSource<DhOrganization>([]);

  setDatasource = effect(() => {
    this.tableDataSource.data = this.getOrganizationsQuery.data()?.organizations ?? [];
  });

  isLoading = this.getOrganizationsQuery.loading;
  hasError = computed(() => this.getOrganizationsQuery.error !== undefined);

  navigate(id: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id },
      queryParamsHandling: 'merge',
    });
  }

  onSearch(value: string): void {
    this.tableDataSource.filter = value;
  }

  download(): void {
    if (!this.tableDataSource.sort) {
      return;
    }

    const dataToSort = structuredClone<DhOrganization[]>(this.tableDataSource.filteredData);
    const dataSorted = this.tableDataSource.sortData(dataToSort, this.tableDataSource.sort);

    const actorsOverviewPath = 'marketParticipant.organizationsOverview';

    const headers = [
      translate(actorsOverviewPath + '.columns.cvrOrBusinessRegisterId'),
      translate(actorsOverviewPath + '.columns.name'),
    ];

    const lines = dataSorted.map((actor) => [actor.businessRegisterIdentifier, actor.name]);

    exportToCSV({ headers, lines, fileName: 'organizations' });
  }
}
