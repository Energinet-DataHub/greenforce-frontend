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
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { translate, TranslocoDirective } from '@ngneat/transloco';

import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
  WattTableComponent,
  WattPaginatorComponent,
} from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import {
  DhRoleStatusComponent,
  DhTabDataGeneralErrorComponent,
} from '@energinet-datahub/dh/admin/shared';

import { DhRoleDrawerComponent } from '../drawer/dh-role-drawer.component';
import { UserRoleDto } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-roles-overview-table',
  standalone: true,
  templateUrl: './dh-roles-overview-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  // Using `OnPush` causes issues with table's header row translations
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    VaterFlexComponent,
    VaterStackComponent,
    WattPaginatorComponent,
    WattEmptyStateComponent,

    DhRoleStatusComponent,
    DhRoleDrawerComponent,
    DhTabDataGeneralErrorComponent,
  ],
})
export class DhRolesTabTableComponent implements OnChanges, AfterViewInit {
  private _destroyRef = inject(DestroyRef);

  activeRow: UserRoleDto | undefined = undefined;

  @Input() roles: UserRoleDto[] = [];
  @Input() isLoading = false;
  @Input() hasGeneralError = false;
  @Input() paginator!: WattPaginatorComponent<unknown>;

  @Output() userRoleDeactivated = new EventEmitter<void>();
  @Output() reload = new EventEmitter<void>();

  @ViewChild(DhRoleDrawerComponent)
  drawer!: DhRoleDrawerComponent;

  @ViewChild(WattTableComponent<UserRoleDto>)
  table!: WattTableComponent<UserRoleDto>;

  readonly dataSource: WattTableDataSource<UserRoleDto> = new WattTableDataSource<UserRoleDto>();

  columns: WattTableColumnDef<UserRoleDto> = {
    name: { accessor: 'name' },
    marketRole: { accessor: 'eicFunction' },
    status: { accessor: 'status' },
  };

  filteredAndSortedData: UserRoleDto[] = [];

  activeRowComparator = (currentRow: UserRoleDto, activeRow: UserRoleDto): boolean =>
    currentRow.id === activeRow.id;

  translateHeader = (key: string) =>
    translate(`admin.userManagement.tabs.roles.table.columns.${key}`);

  ngOnChanges() {
    this.dataSource.data = this.roles;
    this.dataSource.paginator = this.paginator?.instance;
    this.updateFilteredAndSortedData();
  }

  ngAfterViewInit() {
    this.table.sortChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.updateFilteredAndSortedData();
    });

    this.dataSource.paginator = this.paginator?.instance;

    this.dataSource.sortingDataAccessor = (data, header) =>
      header === 'marketRole'
        ? translate(`marketParticipant.marketRoles.${data.eicFunction}`)
        : (data as unknown as { [index: string]: string })[header];

    this.updateFilteredAndSortedData();
  }

  private updateFilteredAndSortedData() {
    if (this.dataSource.sort)
      this.filteredAndSortedData = this.dataSource.sortData(
        this.dataSource.filteredData,
        this.dataSource.sort
      );
  }

  onRowClick(row: UserRoleDto): void {
    this.drawer.open(row);
    this.activeRow = row;
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  onDeActivated(): void {
    this.activeRow = undefined;
    this.userRoleDeactivated.emit();
  }
}
