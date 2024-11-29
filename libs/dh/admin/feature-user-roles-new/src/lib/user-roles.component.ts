import { effect, input, output, computed, Component, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import {
  UpdateUserRoles,
  DhActorUserRole,
  DhActorUserRoles,
} from '@energinet-datahub/dh/admin/shared';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetActorsAndUserRolesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { FilterUserRolesPipe, UserRolesIntoTablePipe } from './filter-user-roles-into-table.pipe';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-user-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    FormsModule,
    TranslocoPipe,
    TranslocoDirective,
    MatExpansionModule,

    WATT_TABLE,
    WattIconComponent,
    WattBadgeComponent,
    WattSpinnerComponent,
    WattTooltipDirective,
    WattEmptyStateComponent,
    WattFieldErrorComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    VaterFlexComponent,

    DhResultComponent,
    FilterUserRolesPipe,
    UserRolesIntoTablePipe,
  ],
})
export class DhUserRolesComponent {
  private actorsAndRolesQuery = lazyQuery(GetActorsAndUserRolesDocument);
  private _updateUserRoles: UpdateUserRoles = {
    actors: [],
  };

  id = input.required<string>();
  selectMode = input(false);
  expanded = input(true);

  updateUserRoles = output<UpdateUserRoles>();

  user = computed(() => this.actorsAndRolesQuery.data()?.userById);

  loading = this.actorsAndRolesQuery.loading;
  hasError = this.actorsAndRolesQuery.hasError;

  userRolesPerActor = computed(() => this.user()?.actors ?? []);

  columns: WattTableColumnDef<DhActorUserRole> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  constructor() {
    effect(() => {
      this.actorsAndRolesQuery.query({ variables: { id: this.id() } });
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

  selectionChanged(actorId: string, userRoles: DhActorUserRoles, allAssignable: DhActorUserRoles) {
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
}
