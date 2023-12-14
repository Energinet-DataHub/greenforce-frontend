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
import { translate, TranslocoDirective } from '@ngneat/transloco';

import { MarketParticipantUserRoleDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { DhRoleStatusComponent } from '../../shared/dh-role-status.component';
import { DhRoleDrawerComponent } from '../../drawer/roles/dh-role-drawer.component';

@Component({
  selector: 'dh-roles-tab-table',
  standalone: true,
  templateUrl: './dh-roles-tab-table.component.html',
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
    TranslocoDirective,

    WATT_TABLE,
    VaterFlexComponent,
    WattPaginatorComponent,
    DhRoleStatusComponent,
    DhRoleDrawerComponent,
  ],
})
export class DhRolesTabTableComponent implements OnChanges, AfterViewInit {
  private _destroyRef = inject(DestroyRef);

  activeRow: MarketParticipantUserRoleDto | undefined = undefined;

  @Input() roles: MarketParticipantUserRoleDto[] = [];
  @Input() isLoading = false;
  @Input() paginator!: WattPaginatorComponent<unknown>;

  @Output() userRoleDeactivated = new EventEmitter<void>();

  @ViewChild(DhRoleDrawerComponent)
  drawer!: DhRoleDrawerComponent;

  @ViewChild(WattTableComponent<MarketParticipantUserRoleDto>)
  table!: WattTableComponent<MarketParticipantUserRoleDto>;

  readonly dataSource: WattTableDataSource<MarketParticipantUserRoleDto> =
    new WattTableDataSource<MarketParticipantUserRoleDto>();

  columns: WattTableColumnDef<MarketParticipantUserRoleDto> = {
    name: { accessor: 'name' },
    marketRole: { accessor: 'eicFunction' },
    status: { accessor: 'status' },
  };

  filteredAndSortedData: MarketParticipantUserRoleDto[] = [];

  activeRowComparator = (
    currentRow: MarketParticipantUserRoleDto,
    activeRow: MarketParticipantUserRoleDto
  ): boolean => currentRow.id === activeRow.id;

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

  onRowClick(row: MarketParticipantUserRoleDto): void {
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
