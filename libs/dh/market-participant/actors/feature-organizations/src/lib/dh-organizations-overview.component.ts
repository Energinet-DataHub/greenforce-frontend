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
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattDataActionsComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetPaginatedOrganizationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { Organization } from './types';
@Component({
  selector: 'dh-organizations-overview',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
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
    WattButtonComponent,
    WattDataTableComponent,
    WattDataActionsComponent,

    VaterUtilityDirective,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      *transloco="let t; read: 'marketParticipant.organizationsOverview'"
      [searchLabel]="'shared.search' | transloco"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('organizations') }}</h3>

      <watt-data-actions>
        <watt-button icon="download" variant="text" (click)="download()">{{
          'shared.download' | transloco
        }}</watt-button>
      </watt-data-actions>

      <watt-table
        *transloco="let resolveHeader; read: 'marketParticipant.organizationsOverview.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigate($event.id)"
      >
        >
        <ng-container
          *wattTableCell="
            columns.businessRegisterIdentifier;
            header: t('columns.cvrOrBusinessRegisterId');
            let organization
          "
        >
          {{ organization.businessRegisterIdentifier }}
        </ng-container>
        <ng-container *wattTableCell="columns.name; header: t('columns.name'); let organization">
          {{ organization.name }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhOrganizationsOverviewComponent {
  private navigationService = inject(DhNavigationService);
  private query = query(GetOrganizationsDocument);

  dataSource = new GetPaginatedOrganizationsDataSource();

  isLoading = this.query.loading;
  hasError = this.query.hasError;

  columns: WattTableColumnDef<Organization> = {
    businessRegisterIdentifier: { accessor: 'businessRegisterIdentifier' },
    name: { accessor: 'name' },
  };

  navigate(id: string) {
    this.navigationService.navigate('details', id);
  }

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigationService.id());
  };

  download(): void {
    if (!this.dataSource.sort) {
      return;
    }

    const data = structuredClone<Organization[]>(this.dataSource.filteredData);

    const actorsOverviewPath = 'marketParticipant.organizationsOverview';

    const headers = [
      translate(actorsOverviewPath + '.columns.cvrOrBusinessRegisterId'),
      translate(actorsOverviewPath + '.columns.name'),
    ];

    const lines = data.map((actor) => [actor.businessRegisterIdentifier, actor.name]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Organizations' });
  }
}
