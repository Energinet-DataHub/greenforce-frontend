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
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import {
  DhAdminUserRolesStore,
  UpdateUserRoles,
} from '@energinet-datahub/dh/admin/data-access-api';
import { MatDividerModule } from '@angular/material/divider';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/shared/ui-util';
import { FormsModule } from '@angular/forms';
import { JoinMarketRoles, TestPipe } from './dh-join-market-roles.pipe';
import { UserOverviewItemDto, UserRoleViewDto } from '@energinet-datahub/dh/shared/domain';
import { MatExpansionModule } from '@angular/material/expansion';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

@Component({
    selector: 'dh-user-roles',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    templateUrl: './dh-user-roles.component.html',
    styleUrls: ['./dh-user-roles.component.scss'],
    imports: [
        CommonModule,
        LetModule,
        PushModule,
        WattSpinnerModule,
        WattCardModule,
        WATT_TABLE,
        TranslocoModule,
        JoinMarketRoles,
        MatDividerModule,
        WattEmptyStateModule,
        WattCheckboxModule,
        MatExpansionModule,
        DhEmDashFallbackPipeScam,
        FormsModule,
        TestPipe
    ]
})
export class DhUserRolesComponent implements OnChanges {
  private readonly store = inject(DhAdminUserRolesStore);
  @Input() user: UserOverviewItemDto | null = null;
  @Input() selectMode = false;
  @Output() updateUserRoles = new EventEmitter<UpdateUserRoles>();

  userRoleView$ = this.store.userRoleView$;
  isLoading$ = this.store.isLoading$;
  numberOfSelectedRoles$ = this.store.numberOfSelectedRoles$;
  numberOfAssignableRoles$ = this.store.numberOfAssignableRoles$;
  hasGeneralError$ = this.store.hasGeneralError$;

  columns: WattTableColumnDef<UserRoleViewDto> = {
    eicFunction: { accessor: 'name' },
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  private _updateUserRoles: UpdateUserRoles = {
    actors: [],
  };

  resetUpdateUserRoles(): void {
    this._updateUserRoles = {
      actors: [],
    };
  }

  ngOnChanges(): void {
    if (this.user?.id) {
      this.store.getUserRolesView(this.user.id);
    }
  }

  selectUserRole(event: boolean, userRole: UserRoleViewDto, actorId: string): void {
    this.addActor(actorId);
    event ? this.addRole(actorId, userRole) : this.removeRole(actorId, userRole);
    this.updateUserRoles.emit(this._updateUserRoles);
  }

  private addActor(actorId: string) {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    if (!actor) {
      this._updateUserRoles.actors.push({
        id: actorId,
        userRolesToUpdate: { added: [], removed: [] },
      });
    }
  }

  private removeRole(actorId: string, userRole: UserRoleViewDto) {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    if (!actor) return;

    if (actor.userRolesToUpdate.added.includes(userRole.id)) {
      actor.userRolesToUpdate.added = actor?.userRolesToUpdate.added.filter(
        (id) => id !== userRole.id
      );
    } else {
      actor.userRolesToUpdate.removed.push(userRole.id);
    }
  }

  private addRole(actorId: string, userRole: UserRoleViewDto) {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    if (!actor) return;

    if (actor.userRolesToUpdate.removed.includes(userRole.id)) {
      actor.userRolesToUpdate.removed = actor.userRolesToUpdate.removed.filter(
        (id) => id !== userRole.id
      );
    } else {
      actor.userRolesToUpdate.added.push(userRole.id);
    }
  }
}
