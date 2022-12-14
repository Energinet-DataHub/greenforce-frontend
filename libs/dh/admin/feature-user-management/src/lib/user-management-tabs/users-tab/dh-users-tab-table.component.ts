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
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';

import { DhUserDrawerComponent } from '../../drawer/dh-user-drawer.component';
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
    CommonModule,
    TranslocoModule,
    DhEmDashFallbackPipeScam,
    WATT_TABLE,
    DhUserDrawerComponent,
  ],
})
export class DhUsersTabTableComponent {
  private transloco = inject(TranslocoService);
  @ViewChild(DhUserDrawerComponent)
  drawer!: DhUserDrawerComponent;

  dataSource = new WattTableDataSource<UserOverviewItemDto>();

  columns: WattTableColumnDef<UserOverviewItemDto> = {
    name: { accessor: 'name' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    active: { accessor: 'active' },
  };

  @Input() set users(usersData: UserOverviewItemDto[]) {
    this.dataSource.data = usersData;
  }

  onRowClick(row: UserOverviewItemDto) {
    this.drawer.open(row);
  }

  translateHeader = (columnId: string): string => {
    const baseKey = 'admin.userManagement.tabs.users.table.headers';

    switch (columnId) {
      case 'phoneNumber':
        return this.transloco.translate(`${baseKey}.phone`);
      case 'active':
        return this.transloco.translate(`${baseKey}.status`);
      default:
        return this.transloco.translate(`${baseKey}.${columnId}`);
    }
  };
}
