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
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattPaginatorComponent, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { DhOrganization } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhOrganizationsTableComponent } from './table/dh-table.component';

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
  ],
})
export class DhOrganizationsOverviewComponent implements OnInit {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);

  private readonly getOrganizationsQuery$ = this.apollo.watchQuery({
    query: GetOrganizationsDocument,
  });

  tableDataSource = new WattTableDataSource<DhOrganization>([]);

  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.getOrganizationsQuery$.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.organizations ?? [];
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
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
