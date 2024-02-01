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
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import {
  MeteringPointDetails,
  SupplierHistory,
  SupplierSwitchHistory,
} from '@energinet-datahub/eov/shared/domain';
import {
  WATT_DIALOG_DATA,
  WattModalActionsComponent,
  WattModalComponent,
} from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattBreadcrumbComponent } from '@energinet-datahub/watt/breadcrumbs';

@Component({
  selector: 'eov-masterdata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    WattModalComponent,
    WattModalActionsComponent,
    WattTabsComponent,
    WattTabComponent,
    WattTableComponent,
    WattTooltipDirective,
    WattButtonComponent,
    WattBreadcrumbComponent,
  ],
  templateUrl: './masterdata-dialog.component.html',
  styleUrl: './masterdata-dialog.component.scss',
})
export class MasterdataDialogComponent {
  details?: MeteringPointDetails = inject(WATT_DIALOG_DATA).details;
  supplierHistory: WattTableDataSource<SupplierHistory> = new WattTableDataSource<SupplierHistory>(inject(WATT_DIALOG_DATA).supplierHistory);
  displayedColumns: WattTableColumnDef<SupplierHistory> = {
    icon: { accessor: 'status', size: 'min-content' },
    startDate: { accessor: 'startDate' },
    symbol: { accessor: 'endDate', sort: false },
    supplierName: { accessor: 'balanceSupplier'}
  };
  @ViewChild(WattModalComponent)
  private modal!: WattModalComponent;
  closeModal(): void {
    this.modal.close(false);
  }
}
