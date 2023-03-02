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
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import {
  SortDirection,
  UserOverviewItemDto,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

import { DhUserStatusComponent } from '../../shared/dh-user-status.component';
import { DhUserDrawerComponent } from '../../drawer/dh-user-drawer.component';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dh-users-tab-table',
  standalone: true,
  templateUrl: './dh-users-tab-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .assigned-actor-item {
        margin: 0;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WATT_TABLE,
    CommonModule,
    TranslocoModule,
    DhSharedUiDateTimeModule,
    DhEmDashFallbackPipeScam,
    DhUserStatusComponent,
    DhUserDrawerComponent,
  ],
})
export class DhUsersTabTableComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  columns: WattTableColumnDef<UserOverviewItemDto> = {
    name: { accessor: 'name' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    assignedActors: { accessor: 'assignedActors', sort: false },
    status: { accessor: 'status' },
  };

  dataSource = new WattTableDataSource<UserOverviewItemDto>();
  activeRow: UserOverviewItemDto | undefined = undefined;

  @Input() set users(value: UserOverviewItemDto[]) {
    this.dataSource.data = value;
  }

  @Input() sortChanged!: (prop: UserOverviewSortProperty, direction: SortDirection) => void;

  @ViewChild(DhUserDrawerComponent)
  drawer!: DhUserDrawerComponent;

  @ViewChild(WattTableComponent)
  usersTable!: WattTableComponent<UserOverviewItemDto>;

  ngAfterViewInit(): void {
    this.usersTable.sortChange.pipe(takeUntil(this.destroy$)).subscribe((x) => {
      const property = (x.active[0].toUpperCase() + x.active.slice(1)) as UserOverviewSortProperty;
      const direction = (x.direction[0].toUpperCase() + x.direction.slice(1)) as SortDirection;
      this.sortChanged(property, direction);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onRowClick(row: UserOverviewItemDto): void {
    this.activeRow = row;
    this.drawer.open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
