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
  Component,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DhMarketParticipantOverviewDataAccessApiStore,
  OverviewRow,
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
  WattValidationMessageModule,
} from '@energinet-datahub/watt';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  dhMarketParticipantOrganizationsCreatePath,
  dhMarketParticipantOrganizationsEditPath,
  dhMarketParticipantOrganizationsPath,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';

@Component({
  selector: 'dh-market-participant-organization',
  styleUrls: ['./dh-market-participant-organization.component.scss'],
  templateUrl: './dh-market-participant-organization.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantOrganizationComponent
  implements OnInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  constructor(
    public store: DhMarketParticipantOverviewDataAccessApiStore,
    private router: Router,
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  columnIds = [
    'OrgName',
    'ActorGln',
    'ActorStatus',
    'ActorRoles',
    'ActorGridAreas',
    'RowEdit',
  ];

  readonly dataSource: MatTableDataSource<OverviewRow> =
    new MatTableDataSource<OverviewRow>();

  isLoading$ = this.store.isLoading$;
  validationError$ = this.store.validationError$;
  overviewList$ = this.store.overviewList$.pipe(
    tap((rows) => {
      this.dataSource.data = rows;
      this.dataSource.paginator = this.paginator;
    })
  );

  ngOnInit() {
    this.setupPaginatorTranslation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private readonly setupPaginatorTranslation = () => {
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.matPaginatorIntl.itemsPerPageLabel = value.itemsPerPageLabel;
        this.matPaginatorIntl.nextPageLabel = value.next;
        this.matPaginatorIntl.previousPageLabel = value.previous;
        this.matPaginatorIntl.firstPageLabel = value.first;
        this.matPaginatorIntl.lastPageLabel = value.last;
        this.dataSource.paginator = this.paginator;
      });
  };

  readonly setRowSelection = (row: OverviewRow) => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantOrganizationsPath,
      row.organization.organizationId,
      dhMarketParticipantOrganizationsEditPath,
    ]);

    this.router.navigateByUrl(url);
  };

  readonly createOrganization = () => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantOrganizationsPath,
      dhMarketParticipantOrganizationsCreatePath,
    ]);

    this.router.navigateByUrl(url);
  };
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
    WattValidationMessageModule,
  ],
  declarations: [DhMarketParticipantOrganizationComponent],
})
export class DhMarketParticipantOrganizationScam {}
