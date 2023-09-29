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
import { Component, Input, OnChanges } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { MarketParticipantGridAreaAuditLogEntryWithNameDto } from '@energinet-datahub/dh/shared/domain';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';

interface AuditLogEntry {
  timestamp: string;
  message: string;
}

@Component({
  selector: 'dh-market-participant-gridarea-details-auditlog',
  styleUrls: ['./dh-market-participant-gridarea-details-auditlog.component.scss'],
  templateUrl: './dh-market-participant-gridarea-details-auditlog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    WattDatePipe,
    WattTableComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhMarketParticipantGridAreaDetailsAuditLogComponent implements OnChanges {
  constructor(private translocoServie: TranslocoService) {}

  @Input() isLoading = false;
  @Input() auditLogEntries: MarketParticipantGridAreaAuditLogEntryWithNameDto[] = [];

  columns: WattTableColumnDef<AuditLogEntry> = {
    time: { accessor: 'timestamp' },
    change: { accessor: 'message' },
  };

  dataSource = new WattTableDataSource<AuditLogEntry>();

  ngOnChanges(): void {
    this.dataSource.data = this.auditLogEntries
      .map((entry) => {
        const translatedField = this.translocoServie.translate(
          'marketParticipant.gridAreas.detailsAuditLog.fields.' + entry.field.toLowerCase()
        );
        const userDisplayName =
          entry.userDisplayName ??
          this.translocoServie.translate('marketParticipant.gridAreas.detailsAuditLog.unknown');
        const message = this.translocoServie.translate(
          'marketParticipant.gridAreas.detailsAuditLog.messageKey',
          {
            field: translatedField,
            userDisplayName: userDisplayName,
            newValue: entry.newValue,
          }
        );
        return {
          timestamp: entry.timestamp,
          message: message,
        };
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}
