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
import { TranslocoModule } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import {
  DhAdminUserRolesStore,
  UpdateUserRoles,
  UpdateUserRolesWithActorId,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  MarketParticipantUserOverviewItemDto,
  MarketParticipantUserRoleViewDto,
} from '@energinet-datahub/dh/shared/domain';
import { MatExpansionModule } from '@angular/material/expansion';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

import {
  FilterUserRolesPipe,
  UserRolesIntoTablePipe,
} from './dh-filter-user-roles-into-table.pipe';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

@Component({
  selector: 'dh-user-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './dh-user-roles.component.html',
  styleUrls: ['./dh-user-roles.component.scss'],
  imports: [
    RxLet,
    RxPush,
    FormsModule,
    TranslocoModule,
    MatDividerModule,
    MatExpansionModule,

    WATT_TABLE,
    WattCardComponent,
    WattBadgeComponent,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattFieldErrorComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    DhEmDashFallbackPipe,
    FilterUserRolesPipe,
    UserRolesIntoTablePipe,
  ],
})
export class DhUserRolesComponent implements OnChanges {
  private readonly store = inject(DhAdminUserRolesStore);
  @Input() user: MarketParticipantUserOverviewItemDto | null = null;
  @Input() selectMode = false;
  @Input() expanded = true;
  @Output() updateUserRoles = new EventEmitter<UpdateUserRoles>();

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;
  userRolesPrActor$ = this.store.userRolesPrActor$;

  columns: WattTableColumnDef<MarketParticipantUserRoleViewDto> = {
    marketRole: { accessor: 'marketRole' },
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

  checkIfAtLeastOneRoleIsAssigned(actorId: string): boolean {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    return actor ? actor.atLeastOneRoleIsAssigned : false;
  }

  selectionChanged(
    actorId: string,
    userRoles: MarketParticipantUserRoleViewDto[],
    allAssignable: MarketParticipantUserRoleViewDto[]
  ) {
    const actor = this.getOrAddActor(actorId);

    actor.atLeastOneRoleIsAssigned = userRoles.length > 0;

    actor.userRolesToUpdate.added = userRoles
      .filter((userRole) => !userRole.userActorId)
      .map((userRole) => userRole.id);

    actor.userRolesToUpdate.removed = allAssignable
      .filter((userRole) => userRole.userActorId)
      .filter((userRole) => !userRoles.map((ur) => ur.id).includes(userRole.id))
      .map((userRole) => userRole.id);

    this.updateUserRoles.emit(this._updateUserRoles);
  }

  private getOrAddActor(actorId: string) {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    if (!actor) {
      const actorChanges = {
        id: actorId,
        atLeastOneRoleIsAssigned: true,
        userRolesToUpdate: { added: [], removed: [] },
      };

      this._updateUserRoles.actors.push(actorChanges);
      return actorChanges;
    }

    return actor;
  }
}
