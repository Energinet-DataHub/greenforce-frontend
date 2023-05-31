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
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { DbAdminAssignableUserRolesStore } from '@energinet-datahub/dh/admin/data-access-api';
import { MarketParticipantUserRoleDto } from '@energinet-datahub/dh/shared/domain';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { TranslocoModule } from '@ngneat/transloco';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { MatDividerModule } from '@angular/material/divider';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'dh-assignable-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    WattCheckboxComponent,
    FormsModule,
    LetModule,
    PushModule,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    TranslocoModule,
    WATT_CARD,
    WATT_TABLE,
    MatDividerModule,
  ],
  styleUrls: ['./dh-assignable-user-roles.component.scss'],
  templateUrl: './dh-assignable-user-roles.component.html',
})
export class DhAssignableUserRolesComponent implements OnInit {
  private readonly assignableUserRolesStore = inject(DbAdminAssignableUserRolesStore);

  readonly assignableUserRoles$ = this.assignableUserRolesStore.assignableUserRoles$;
  readonly hasGeneralError$ = this.assignableUserRolesStore.hasGeneralError$;
  readonly dataSource: WattTableDataSource<MarketParticipantUserRoleDto> =
    new WattTableDataSource<MarketParticipantUserRoleDto>();

  @Output() readonly selectedUserRoles = new EventEmitter<MarketParticipantUserRoleDto[]>();

  columns: WattTableColumnDef<MarketParticipantUserRoleDto> = {
    eicFunction: { accessor: 'eicFunction' },
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  ngOnInit(): void {
    this.assignableUserRolesStore.assignableUserRoles$
      .pipe(takeUntil(this.assignableUserRolesStore.destroy$))
      .subscribe((userRoles) => (this.dataSource.data = userRoles));
  }

  selectionChanged(userRoles: MarketParticipantUserRoleDto[]) {
    this.selectedUserRoles.emit(userRoles);
  }
}
