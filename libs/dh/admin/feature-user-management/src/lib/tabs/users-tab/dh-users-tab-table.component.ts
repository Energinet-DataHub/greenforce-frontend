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
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattTableColumnDef,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

import { DhUserStatusComponent } from '../../shared/dh-user-status.component';
import { DhUserDrawerComponent } from '../../drawer/dh-user-drawer.component';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

@Component({
  selector: 'dh-users-tab-table',
  standalone: true,
  templateUrl: './dh-users-tab-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WATT_TABLE,
    TranslocoModule,
    DhSharedUiDateTimeModule,
    DhEmDashFallbackPipeScam,
    DhUserStatusComponent,
    DhUserDrawerComponent,
  ],
})
export class DhUsersTabTableComponent {
  columns: WattTableColumnDef<UserOverviewItemDto> = {
    name: { accessor: 'name' },
    email: { accessor: 'email' },
    phone: { accessor: 'phoneNumber' },
    status: { accessor: 'status' },
    createdDate: { accessor: 'createdDate' },
  };

  dataSource = new WattTableDataSource<UserOverviewItemDto>();
  activeRow: UserOverviewItemDto | undefined = undefined;

  @Input() set users(value: UserOverviewItemDto[]) {
    this.dataSource.data = value;
  }

  @ViewChild(DhUserDrawerComponent)
  drawer!: DhUserDrawerComponent;

  onRowClick(row: UserOverviewItemDto): void {
    this.activeRow = row;
    this.drawer.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
