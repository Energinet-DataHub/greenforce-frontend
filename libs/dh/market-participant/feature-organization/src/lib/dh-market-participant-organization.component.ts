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
import {
  AfterViewInit,
  Component,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DhMarketParticipantOverviewDataAccessApiStore,
  OrganizationWithActor,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattIconModule,
  WattEmptyStateModule,
  WattSpinnerModule,
} from '@energinet-datahub/watt';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { DhMarketParticipantCreateOrganizationScam } from './create-organization/dh-market-participant-create-organization.component';

@Component({
  selector: 'dh-market-participant-organization',
  styleUrls: ['./dh-market-participant-organization.component.scss'],
  templateUrl: './dh-market-participant-organization.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantOrganizationComponent
  implements AfterViewInit, OnInit
{
  constructor(
    public store: DhMarketParticipantOverviewDataAccessApiStore,
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnIds = [
    'OrgName',
    'ActorGln',
    'ActorStatus',
    'ActorRoles',
    'ActorGridAreas',
    'RowEdit',
  ];

  readonly dataSource: MatTableDataSource<OrganizationWithActor> =
    new MatTableDataSource<OrganizationWithActor>();

  ngOnInit() {
    this.setupPaginatorTranslation();
  }

  ngAfterViewInit() {
    this.store.state$.subscribe((x) => {
      this.dataSource.data = x.organizations;
      this.dataSource.paginator = this.paginator;
    });

    this.store.beginLoading();
  }

  setupPaginatorTranslation = () => {
    const temp = this.matPaginatorIntl.getRangeLabel;
    this.matPaginatorIntl.getRangeLabel = (page, pageSize, length) =>
      temp(page, pageSize, length).replace(
        'of',
        this.translocoService.translate(
          'marketParticipant.organization.paginator.of'
        )
      );

    this.translocoService
      .selectTranslateObject('marketParticipant.organization.paginator')
      .subscribe((value) => {
        this.matPaginatorIntl.itemsPerPageLabel = value.itemsPerPageLabel;
        this.matPaginatorIntl.nextPageLabel = value.next;
        this.matPaginatorIntl.previousPageLabel = value.previous;
        this.matPaginatorIntl.firstPageLabel = value.first;
        this.matPaginatorIntl.lastPageLabel = value.last;
        this.dataSource.paginator = this.paginator;
      });
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
    MatMenuModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattIconModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    DhMarketParticipantCreateOrganizationScam
  ],
  declarations: [DhMarketParticipantOrganizationComponent],
})
export class DhMarketParticipantOrganizationScam {}
