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
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { ChargeLinkV1Dto, ChargeType } from '@energinet-datahub/dh/shared/domain';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

@Component({
  selector: 'dh-charge-item',
  templateUrl: './dh-charge-item.component.html',
  styleUrls: ['./dh-charge-item.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    WattEmptyStateComponent,
    WattDatePipe,
    WattIconComponent,
    WATT_TABLE,
  ],
})
export class DhChargeItemComponent {
  @Input() title = '';
  @Input() set charges(value: ChargeLinkV1Dto[]) {
    this.dataSource.data = value;
  }

  chargeTypes = ChargeType;
  dataSource = new WattTableDataSource<ChargeLinkV1Dto>();

  columns: WattTableColumnDef<ChargeLinkV1Dto> = {
    chargeType: { accessor: (row) => `${row.chargeName}:${row.chargeId}` },
    chargeOwner: { accessor: (row) => `${row.chargeOwnerName}:${row.chargeOwner}` },
    startDate: { accessor: 'startDate' },
    quantity: { accessor: 'quantity' },
    transparentInvoicing: { accessor: 'transparentInvoicing' },
  };
}
