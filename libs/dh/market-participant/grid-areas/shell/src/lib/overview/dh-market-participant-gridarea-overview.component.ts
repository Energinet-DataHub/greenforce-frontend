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
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  GridAreaChanges,
  GridAreaOverviewRow,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhMarketParticipantGridAreaDetailsHeaderComponent } from '../details-header/dh-market-participant-gridarea-details-header.component';
import { DhMarketParticipantGridAreaEditComponent } from '../details-edit/dh-market-participant-gridarea-edit.component';
import { DhMarketParticipantGridAreaDetailsAuditLogComponent } from '../details-auditlog/dh-market-participant-gridarea-details-auditlog.component';
import { MarketParticipantGridAreaAuditLogEntryWithNameDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-market-participant-gridarea-overview',
  styleUrls: ['./dh-market-participant-gridarea-overview.component.scss'],
  templateUrl: './dh-market-participant-gridarea-overview.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RxLet,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonComponent,
    WattIconComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    DhEmDashFallbackPipe,
    WattDatePipe,
    WATT_DRAWER,
    WATT_TABLE,
    DhMarketParticipantGridAreaDetailsHeaderComponent,
    DhMarketParticipantGridAreaEditComponent,
    DhMarketParticipantGridAreaDetailsAuditLogComponent,
  ],
})
export class DhMarketParticipantGridAreaOverviewComponent implements OnChanges {
  @ViewChild('drawer') drawer!: WattDrawerComponent;

  columns = {
    code: { accessor: 'code' },
    name: { accessor: 'name' },
    actorName: { accessor: 'actorName' },
    actorNumber: { accessor: 'actorNumber' },
    priceAreaCode: { accessor: 'priceAreaCode' },
    validFrom: { accessor: 'validFrom' },
    validTo: { accessor: 'validTo' },
  } satisfies WattTableColumnDef<GridAreaOverviewRow>;

  @Input() gridAreas: GridAreaOverviewRow[] = [];
  @Input() gridChanges!: (changes: {
    gridAreaChanges: GridAreaChanges;
    onCompleted: () => void;
  }) => void;
  @Input() gridChangesLoading = false;

  @Input() isLoadingAuditLog = false;
  @Input() activeGridAreaAuditLog: MarketParticipantGridAreaAuditLogEntryWithNameDto[] = [];
  @Input() getGridAreaData!: (gridAreaId: string) => void;

  readonly dataSource = new WattTableDataSource<GridAreaOverviewRow>();

  activeRow?: GridAreaOverviewRow;

  ngOnChanges() {
    this.dataSource.data = this.gridAreas;
  }

  readonly drawerClosed = () => {
    this.activeRow = undefined;
  };

  readonly open = (row: GridAreaOverviewRow) => {
    this.activeRow = row;
    this.getGridAreaData(row.id);
    this.drawer.open();
  };

  isSelected(row: GridAreaOverviewRow): boolean {
    return this.activeRow?.id === row.id;
  }
}
