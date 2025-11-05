//#region License
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
//#endregion
import { effect, input, output, computed, Component, ChangeDetectionStrategy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WATT_TABLE } from '@energinet/watt/table';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet/watt/expandable-card';

import { UpdateUserRoles } from '@energinet-datahub/dh/admin/shared';
import { ActorUserRoles } from '@energinet-datahub/dh/admin/data-access-api';

import { DhBasicUserRolesTableComponent } from './basic-user-roles-table.component';
import { DhUserByIdMarketParticipant } from './types';

@Component({
  selector: 'dh-user-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-roles.component.html',
  styles: `
    watt-expandable-card {
      watt-badge {
        flex: 0 0 auto;
      }

      watt-expandable-card-title {
        display: flex;
        gap: var(--watt-space-s);

        watt-icon {
          color: var(--watt-color-primary-darker);
        }
      }
    }
  `,
  imports: [
    TranslocoDirective,
    MatExpansionModule,

    WATT_TABLE,
    WattIconComponent,
    WattTooltipDirective,
    WattFieldErrorComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    DhBasicUserRolesTableComponent,
  ],
})
export class DhUserRolesComponent {
  private _updateUserRoles: UpdateUserRoles = {
    actors: [],
  };

  administratedById = input<string>();
  selectMode = input(false);
  expanded = input(true);

  userRolesPerActor = input<DhUserByIdMarketParticipant[]>([]);

  updateUserRoles = output<UpdateUserRoles>();

  constructor() {
    effect(() => {
      if (this.selectMode()) {
        this.initiallySelectedUserRoles(this.userRolesPerActor());
      }
    });
  }

  resetUpdateUserRoles(): void {
    this._updateUserRoles = {
      actors: [],
    };
  }

  checkIfAtLeastOneRoleIsAssigned(actorId: string): boolean {
    const actor = this._updateUserRoles.actors.find((actor) => actor.id === actorId);
    return actor ? actor.atLeastOneRoleIsAssigned : false;
  }

  selectionChanged(actorId: string, userRoles: ActorUserRoles, allAssignable: ActorUserRoles) {
    const actor = this.getOrAddActor(actorId);

    actor.atLeastOneRoleIsAssigned = userRoles.length > 0;

    actor.userRolesToUpdate.added = userRoles
      .filter((userRole) => !userRole.assigned)
      .map((userRole) => userRole.id);

    actor.userRolesToUpdate.removed = allAssignable
      .filter((userRole) => userRole.assigned)
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

  private initiallySelectedUserRoles(marketParticipants: DhUserByIdMarketParticipant[]) {
    marketParticipants.forEach(({ id, userRoles }) => {
      const marketParticipant = this.getOrAddActor(id);

      marketParticipant.userRolesToUpdate.added = userRoles
        .filter((userRole) => userRole.assigned)
        .map((userRole) => userRole.id);
    });
  }
}
