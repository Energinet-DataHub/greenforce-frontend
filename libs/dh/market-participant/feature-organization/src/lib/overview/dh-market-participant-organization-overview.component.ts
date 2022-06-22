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
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OrganizationWithActorRow } from '@energinet-datahub/dh/market-participant/data-access-api';
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
import { Subject, takeUntil } from 'rxjs';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-market-participant-organization-overview',
  styleUrls: ['./dh-market-participant-organization-overview.component.scss'],
  templateUrl: './dh-market-participant-organization-overview.component.html',
})
export class DhMarketParticipantOrganizationOverviewComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  constructor(
    private translocoService: TranslocoService,
    private matPaginatorIntl: MatPaginatorIntl
  ) {}

  columnIds = [
    'org-name',
    'actor-gln',
    'actor-status',
    'actor-roles',
    'actor-grid-areas',
    'row-edit',
  ];

  @Input() rows: OrganizationWithActorRow[] = [];
  @Input() gridAreas: GridAreaDto[] = [];

  @Output() editOrganization = new EventEmitter<string>();
  @Output() createActor = new EventEmitter<string>();
  @Output() editActor = new EventEmitter<{
    organizationId: string;
    actorId: string;
  }>();

  readonly dataSource: MatTableDataSource<OrganizationWithActorRow> =
    new MatTableDataSource<OrganizationWithActorRow>();

  gridAreasMap: { [id: string]: string } = {};

  ngOnInit() {
    this.setupPaginatorTranslation();
  }

  ngOnChanges() {
    this.dataSource.data = this.rows;
    this.dataSource.paginator = this.paginator;
    this.gridAreas.forEach(
      (gridArea) => (this.gridAreasMap[gridArea.id] = gridArea.name)
    );
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

  readonly onEditOrganization = (row: OrganizationWithActorRow) =>
    this.editOrganization.emit(row.organization.organizationId);

  readonly onCreateActor = (row: OrganizationWithActorRow) =>
    this.createActor.emit(row.organization.organizationId);

  readonly onEditActor = (organizationId: string, actorId: string) =>
    this.editActor.emit({ organizationId, actorId });

  readonly getGridAreaInfo = (id: string) => {
    const grid = this.gridAreas.find((x) => x.id == id);
    return grid ? `${grid.code} - ${grid.name}` : '';
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
    DhEmDashFallbackPipeScam,
  ],
  declarations: [DhMarketParticipantOrganizationOverviewComponent],
  exports: [DhMarketParticipantOrganizationOverviewComponent],
})
export class DhMarketParticipantOrganizationOverviewScam {}
