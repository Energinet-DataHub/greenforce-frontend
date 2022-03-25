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
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgModule, ViewChild } from '@angular/core';
import {
  DhMarketParticipantOverviewDataAccessApiStore,
  OrganizationWithActor,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattIconModule,
  WattEmptyStateModule,
  WattSpinnerModule,
} from '@energinet-datahub/watt';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'dh-market-participant-organization',
  styleUrls: ['./dh-market-participant-organization.component.scss'],
  templateUrl: './dh-market-participant-organization.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantOrganizationComponent implements AfterViewInit {
  constructor(public store: DhMarketParticipantOverviewDataAccessApiStore) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnIds = [
    'OrgName',
    'ActorGln',
    'ActorStatus',
    'ActorRoles',
    'ActorGridAreas',
    'RowEdit',
  ];

  dataSource: MatTableDataSource<OrganizationWithActor> =
    new MatTableDataSource<OrganizationWithActor>();

  isLoading = true;

  async ngAfterViewInit() {
    this.isLoading = true;
    this.dataSource.data = await this.getOrganizations();
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;
  }

  getOrganizations = async () => {
    await this.store.loadOrganizations();
    return (await firstValueFrom(this.store.state$)).organizations;
  };

  onEditClicked = (e: OrganizationWithActor) =>
    console.log('Clicked edit on', e);
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    MatTableModule,
    MatPaginatorModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattIconModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    MatMenuModule,
  ],
  declarations: [DhMarketParticipantOrganizationComponent],
})
export class DhMarketParticipantOrganizationScam {}
