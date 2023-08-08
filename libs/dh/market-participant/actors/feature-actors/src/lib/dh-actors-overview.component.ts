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
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { ActorsFilters } from './actors-filters';

export type Actor = ResultOf<typeof GetActorsDocument>['actors'][0];

@Component({
  standalone: true,
  selector: 'dh-actors-overview',
  templateUrl: './dh-actors-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [TranslocoModule, DhActorsFiltersComponent, WATT_TABLE, WATT_CARD],
})
export class DhActorsOverviewComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  getActorsQuery$ = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorsDocument,
  });

  dataSource = new WattTableDataSource<Actor>([]);

  columns: WattTableColumnDef<Actor> = {
    glnOrEicNumber: { accessor: 'glnOrEicNumber' },
    name: { accessor: 'name' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  filters$ = new BehaviorSubject<ActorsFilters>({
    actorStatus: null,
    marketRoles: null,
  });

  ngOnInit(): void {
    this.getActorsQuery$.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.dataSource.data = result.data?.actors;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
