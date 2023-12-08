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
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  MarketParticipantSortDirection,
  MarketParticipantUserOverviewItemDto,
  MarketParticipantUserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

import { DhUserStatusComponent } from '../../shared/dh-user-status.component';
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
    WATT_TABLE,
    TranslocoModule,
    DhEmDashFallbackPipe,
    DhUserStatusComponent,
    DhUserDrawerComponent,
  ],
})
export class DhUsersTabTableComponent implements AfterViewInit {
  private _destroyRef = inject(DestroyRef);

  columns: WattTableColumnDef<MarketParticipantUserOverviewItemDto> = {
    firstName: { accessor: 'firstName' },
    lastName: { accessor: 'lastName' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    status: { accessor: 'status' },
  };

  dataSource = new WattTableDataSource<MarketParticipantUserOverviewItemDto>();
  activeRow: MarketParticipantUserOverviewItemDto | undefined = undefined;

  @Input({ required: true }) set users(value: MarketParticipantUserOverviewItemDto[]) {
    this.dataSource.data = value;
  }

  @Input({ required: true }) sortChanged!: (
    prop: MarketParticipantUserOverviewSortProperty,
    direction: MarketParticipantSortDirection
  ) => void;

  @ViewChild(DhUserDrawerComponent)
  drawer!: DhUserDrawerComponent;

  @ViewChild(WattTableComponent)
  usersTable!: WattTableComponent<MarketParticipantUserOverviewItemDto>;

  ngAfterViewInit(): void {
    this.usersTable.sortChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((x) => {
      const property = (x.active[0].toUpperCase() +
        x.active.slice(1)) as MarketParticipantUserOverviewSortProperty;
      const direction = (x.direction[0].toUpperCase() +
        x.direction.slice(1)) as MarketParticipantSortDirection;
      this.sortChanged(property, direction);
    });
  }

  onRowClick(row: MarketParticipantUserOverviewItemDto): void {
    this.activeRow = row;
    this.drawer.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
