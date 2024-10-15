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
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import {
  DhTabDataGeneralErrorComponent,
  DhUser,
  DhUsers,
  DhUserStatusComponent,
} from '@energinet-datahub/dh/admin/shared';

import {
  MarketParticipantSortDirctionType,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhUserDrawerComponent } from '../drawer/dh-user-drawer.component';
import { DhUserLatestLoginComponent } from "./dh-user-latest-login.component";

@Component({
  selector: 'dh-users-overview-table',
  standalone: true,
  templateUrl: './dh-users-overview-table.component.html',
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
    VaterStackComponent,
    VaterFlexComponent,
    WattEmptyStateComponent,
    WATT_TABLE,
    DhTabDataGeneralErrorComponent,
    DhEmDashFallbackPipe,
    DhUserStatusComponent,
    DhUserDrawerComponent,
    DhUserLatestLoginComponent
],
})
export class DhUsersTabTableComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  columns: WattTableColumnDef<DhUser> = {
    firstName: { accessor: 'firstName' },
    email: { accessor: 'email' },
    phoneNumber: { accessor: 'phoneNumber' },
    latestLoginAt: { accessor: 'latestLoginAt' },
    status: { accessor: 'status' },
  };

  dataSource = new WattTableDataSource<DhUser>();
  activeRow: DhUser | undefined = undefined;

  users = input.required<DhUsers>();

  isLoading = input.required<boolean>();
  hasGeneralError = input.required<boolean>();

  sortChanged =
    input.required<
      (prop: UserOverviewSortProperty, direction: MarketParticipantSortDirctionType) => void
    >();

  reload = output<void>();

  private drawer = viewChild.required(DhUserDrawerComponent);
  private usersTable = viewChild.required(WattTableComponent<DhUser>);

  constructor() {
    effect(() => (this.dataSource.data = this.users()));
  }

  ngAfterViewInit(): void {
    this.usersTable()
      .sortChange.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sortEvent) => {
        const property = (sortEvent.active.charAt(0).toUpperCase() +
          sortEvent.active.slice(1)) as UserOverviewSortProperty;

        const direction = (sortEvent.direction.charAt(0).toUpperCase() +
          sortEvent.direction.slice(1)) as MarketParticipantSortDirctionType;

        this.sortChanged()(property, direction);
      });
  }

  onRowClick(row: DhUser): void {
    this.activeRow = row;
    this.drawer().open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }
}
