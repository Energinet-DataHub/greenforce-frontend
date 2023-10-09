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
import { TranslocoModule } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhOrganizationsTableComponent } from './table/dh-table.component';
import { DhOrganization } from './dh-organization';

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
    TranslocoModule,

    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattPaginatorComponent,

    DhOrganizationsTableComponent,
  ],
})
export class DhOrganizationsOverviewComponent implements OnInit {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);

  private readonly getOrganizationsQuery$ = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
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
}
