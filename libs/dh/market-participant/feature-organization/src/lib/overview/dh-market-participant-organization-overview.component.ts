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
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template/let';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattIconModule,
  WattEmptyStateModule,
  WattSpinnerModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhMarketParticipantOrganizationOverviewGridAreasScam } from './dh-market-participant-organization-overview-grid-areas-list.component';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { OrganizationWithActorRow } from '@energinet-datahub/dh/market-participant/data-access-api';

@Component({
  selector: 'dh-market-participant-organization-overview',
  styleUrls: ['./dh-market-participant-organization-overview.component.scss'],
  templateUrl: './dh-market-participant-organization-overview.component.html',
})
export class DhMarketParticipantOrganizationOverviewComponent
  implements AfterViewInit, OnChanges
{
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;

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

  ngOnChanges() {
    this.dataSource.data = this.rows;
    this.dataSource.paginator = this.paginator?.instance;
    this.gridAreas.forEach(
      (gridArea) => (this.gridAreasMap[gridArea.id] = gridArea.name)
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.instance;
  }

  readonly onEditOrganization = (row: OrganizationWithActorRow) =>
    this.editOrganization.emit(row.organization.organizationId);

  readonly onCreateActor = (row: OrganizationWithActorRow) =>
    this.createActor.emit(row.organization.organizationId);

  readonly onEditActor = (organizationId: string, actorId: string) =>
    this.editActor.emit({ organizationId, actorId });
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    MatTableModule,
    MatMenuModule,
    TranslocoModule,
    WattBadgeModule,
    WattButtonModule,
    WattIconModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattValidationMessageModule,
    DhEmDashFallbackPipeScam,
    DhMarketParticipantOrganizationOverviewGridAreasScam,
    DhSharedUiPaginatorComponent,
  ],
  declarations: [DhMarketParticipantOrganizationOverviewComponent],
  exports: [DhMarketParticipantOrganizationOverviewComponent],
})
export class DhMarketParticipantOrganizationOverviewScam {}
