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
import { Component, effect, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterSpacerComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent, exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhOrganization } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
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
  providers: [DhNavigationService],
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    WATT_CARD,
    WATT_TABLE,
    VaterFlexComponent,
    VaterStackComponent,
    WattSearchComponent,
    WattButtonComponent,
    WattPaginatorComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    DhResultComponent,
  ],
})
export class DhOrganizationsOverviewComponent {
  private navigationService = inject(DhNavigationService);
  private getOrganizationsQuery = query(GetOrganizationsDocument);

  dataSource = new WattTableDataSource<DhOrganization>([]);

  isLoading = this.getOrganizationsQuery.loading;
  hasError = this.getOrganizationsQuery.hasError;

  columns: WattTableColumnDef<DhOrganization> = {
    cvrOrBusinessRegisterId: { accessor: 'businessRegisterIdentifier' },
    name: { accessor: 'name' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.getOrganizationsQuery.data()?.organizations ?? [];
    });
  }

  navigate(id: string) {
    this.navigationService.navigate('details', id);
  }

  onSearch(value: string): void {
    this.dataSource.filter = value;
  }

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigationService.id());
  };

  download(): void {
    if (!this.dataSource.sort) {
      return;
    }

    const dataToSort = structuredClone<DhOrganization[]>(this.dataSource.filteredData);
    const dataSorted = this.dataSource.sortData(dataToSort, this.dataSource.sort);

    const actorsOverviewPath = 'marketParticipant.organizationsOverview';

    const headers = [
      translate(actorsOverviewPath + '.columns.cvrOrBusinessRegisterId'),
      translate(actorsOverviewPath + '.columns.name'),
    ];

    const lines = dataSorted.map((actor) => [actor.businessRegisterIdentifier, actor.name]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Organizations' });
  }
}
