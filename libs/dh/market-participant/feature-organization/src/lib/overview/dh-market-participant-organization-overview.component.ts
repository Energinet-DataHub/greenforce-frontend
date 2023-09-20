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
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxLet } from '@rx-angular/template/let';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WATT_TABLE, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhMarketParticipantOrganizationOverviewGridAreasListComponent } from './dh-market-participant-organization-overview-grid-areas-list.component';
import { MarketParticipantGridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { OrganizationWithActorRow } from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

@Component({
  selector: 'dh-market-participant-organization-overview',
  styleUrls: ['./dh-market-participant-organization-overview.component.scss'],
  templateUrl: './dh-market-participant-organization-overview.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RxLet,
    MatMenuModule,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonComponent,
    WattIconComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    WattPaginatorComponent,
    WATT_TABLE,
    WattValidationMessageComponent,
    DhEmDashFallbackPipe,
    DhMarketParticipantOrganizationOverviewGridAreasListComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhMarketParticipantOrganizationOverviewComponent implements OnChanges {
  columns: WattTableColumnDef<OrganizationWithActorRow> = {
    organization: { accessor: (row) => row.organization.name },
    gln: { accessor: (row) => row.actor?.actorNumber.value },
    status: { accessor: (row) => row.actor?.status },
    marketRoles: { accessor: null },
    gridAreas: { accessor: null },
    edit: { accessor: null, header: '' },
  };

  @Input() rows: OrganizationWithActorRow[] = [];
  @Input() gridAreas: MarketParticipantGridAreaDto[] = [];

  @Output() editOrganization = new EventEmitter<string>();
  @Output() createActor = new EventEmitter<string>();
  @Output() editActor = new EventEmitter<{
    organizationId: string;
    actorId: string;
  }>();

  readonly dataSource = new WattTableDataSource<OrganizationWithActorRow>();

  gridAreasMap: { [id: string]: string } = {};

  ngOnChanges() {
    this.dataSource.data = this.rows;
    this.gridAreas.forEach((gridArea) => (this.gridAreasMap[gridArea.id] = gridArea.name));
  }

  readonly onEditOrganization = (row: OrganizationWithActorRow) =>
    this.editOrganization.emit(row.organization.organizationId);

  readonly onCreateActor = (row: OrganizationWithActorRow) =>
    this.createActor.emit(row.organization.organizationId);

  readonly onEditActor = (organizationId: string, actorId: string) =>
    this.editActor.emit({ organizationId, actorId });
}
