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
import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet/watt/vater';

import { WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataActionsComponent, WattDataTableComponent } from '@energinet/watt/data';

import { DhDownloadButtonComponent, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetPaginatedOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetPaginatedOrganizationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { Organization } from './types';

@Component({
  selector: 'dh-organizations',
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

    WATT_TABLE,
    WattDataTableComponent,
    WattDataActionsComponent,

    VaterUtilityDirective,
    DhDownloadButtonComponent,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      *transloco="let t; prefix: 'marketParticipant.organizationsOverview'"
      [searchLabel]="'shared.search' | transloco"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      [enableCount]="false"
    >
      <watt-data-actions>
        <dh-download-button (clicked)="download()" />
      </watt-data-actions>

      <watt-table
        *transloco="let resolveHeader; prefix: 'marketParticipant.organizationsOverview.columns'"
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
  private query = lazyQuery(GetPaginatedOrganizationsDocument);
  private variables = computed(() => this.dataSource.query.getOptions().variables);
  private generateCSV = GenerateCSV.fromQuery(
    this.query,
    (x) => x.paginatedOrganizations?.nodes ?? []
  );

  dataSource = new GetPaginatedOrganizationsDataSource();

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

  async download() {
    const actorsOverviewPath = 'marketParticipant.organizationsOverview';

    this.generateCSV
      .addVariables({
        ...this.variables(),
        first: 10_000,
      })
      .addHeaders([
        translate(actorsOverviewPath + '.columns.cvrOrBusinessRegisterId'),
        translate(actorsOverviewPath + '.columns.name'),
      ])
      .mapLines((orgs) =>
        orgs.map((organization) => [organization.businessRegisterIdentifier, organization.name])
      )
      .generate(`${actorsOverviewPath}.fileName`);
  }
}
