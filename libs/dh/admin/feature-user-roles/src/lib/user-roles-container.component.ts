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
import {
  input,
  output,
  computed,
  Component,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import { UpdateUserRoles } from '@energinet-datahub/dh/admin/shared';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetActorsAndUserRolesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

import { DhUserRolesComponent } from './user-roles.component';
import { DhUserByIdMarketParticipant } from './types';

@Component({
  selector: 'dh-user-roles-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dh-result [loading]="loading()" [hasError]="hasError()">
      <dh-user-roles
        [selectMode]="selectMode()"
        [expanded]="expanded()"
        [userRolesPerActor]="userRolesMock"
        [administratedById]="administratedById()"
        (updateUserRoles)="updateUserRoles.emit($event)"
      />
    </dh-result>
  `,
  imports: [DhResultComponent, DhUserRolesComponent],
})
export class DhUserRolesContainerComponent {
  private actorsAndRolesQuery = query(GetActorsAndUserRolesDocument, () => ({
    variables: { id: this.id() },
  }));

  userRolesCmp = viewChild.required(DhUserRolesComponent);

  loading = this.actorsAndRolesQuery.loading;
  hasError = this.actorsAndRolesQuery.hasError;

  id = input.required<string>();
  selectMode = input(false);
  expanded = input(true);

  updateUserRoles = output<UpdateUserRoles>();

  user = computed(() => this.actorsAndRolesQuery.data()?.userById);
  administratedById = computed(() => this.user()?.administratedBy?.id);
  userRolesPerActor = computed<DhUserByIdMarketParticipant[]>(() => this.user()?.actors ?? []);
  userRolesMock: DhUserByIdMarketParticipant[] = [
    {
      __typename: 'MarketParticipant',
      glnOrEicNumber: 'gln-number-3',
      name: 'Market Participant 3',
      id: '1234',
      organization: { __typename: 'Organization', id: 'org-id-3', name: 'Organization 3' },
      userRoles: [
        {
          __typename: 'MarketParticipantUserRole',
          id: 'role-id-1-3',
          name: 'Role 1 (3)',
          assigned: true,
          description: 'Description 1 (3)',
          eicFunction: 'DataHubAdministrator',
        },
        {
          __typename: 'MarketParticipantUserRole',
          id: 'role-id-2-3',
          name: 'Role 2 (3)',
          assigned: false,
          description: 'Description 2 (3)',
          eicFunction: 'DataHubAdministrator',
        },
        {
          __typename: 'MarketParticipantUserRole',
          id: 'role-id-3-3',
          name: 'Role 3 (3)',
          assigned: false,
          description: 'Description 3 (3)',
          eicFunction: 'DataHubAdministrator',
        },
      ],
    },
    {
      __typename: 'MarketParticipant',
      glnOrEicNumber: 'gln-number-4',
      name: 'Market Participant 4',
      id: '5678',
      organization: { __typename: 'Organization', id: 'org-id-4', name: 'Organization 4' },
      userRoles: [
        {
          __typename: 'MarketParticipantUserRole',
          id: 'role-id-1-4',
          name: 'Role 1 (4)',
          assigned: true,
          description: 'Description 1 (4)',
          eicFunction: 'EnergySupplier',
        },
        {
          __typename: 'MarketParticipantUserRole',
          id: 'role-id-2-4',
          name: 'Role 2 (4)',
          assigned: false,
          description: 'Description 2 (4)',
          eicFunction: 'EnergySupplier',
        },
        {
          __typename: 'MarketParticipantUserRole',
          id: 'role-id-3-4',
          name: 'Role 3 (4)',
          assigned: false,
          description: 'Description 3 (4)',
          eicFunction: 'EnergySupplier',
        },
      ],
    },
  ];

  resetUpdateUserRoles() {
    this.userRolesCmp().resetUpdateUserRoles();
  }
}
