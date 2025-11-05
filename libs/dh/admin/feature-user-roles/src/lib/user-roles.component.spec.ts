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
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { UpdateUserRoles } from '@energinet-datahub/dh/admin/shared';

import { DhUserRolesComponent } from './user-roles.component';
import { DhUserByIdMarketParticipant } from './types';

let counter = 0;

function generateMarketParticipant(
  administeredById: string,
  eicFunction: EicFunction,
  role1IsAssigned = true,
  role2IsAssigned = true,
  role3IsAssigned = true
): DhUserByIdMarketParticipant {
  counter = counter + 1;

  return {
    __typename: 'MarketParticipant',
    glnOrEicNumber: `gln-number-${counter}`,
    name: `Market Participant ${counter}`,
    id: administeredById,
    organization: {
      __typename: 'Organization',
      id: `org-id-${counter}`,
      name: `Organization ${counter}`,
    },
    userRoles: [
      {
        __typename: 'MarketParticipantUserRole',
        id: `role-id-1-${counter}`,
        name: `Role 1 (${counter})`,
        assigned: role1IsAssigned,
        description: `Description 1 (${counter})`,
        eicFunction,
      },
      {
        __typename: 'MarketParticipantUserRole',
        id: `role-id-2-${counter}`,
        name: `Role 2 (${counter})`,
        assigned: role2IsAssigned,
        description: `Description 2 (${counter})`,
        eicFunction,
      },
      {
        __typename: 'MarketParticipantUserRole',
        id: `role-id-3-${counter}`,
        name: `Role 3 (${counter})`,
        assigned: role3IsAssigned,
        description: `Description 3 (${counter})`,
        eicFunction,
      },
    ],
  };
}

const globalMockData: DhUserByIdMarketParticipant[] = [
  generateMarketParticipant('1234', EicFunction.DataHubAdministrator),
  generateMarketParticipant('5678', EicFunction.EnergySupplier),
];

async function setup({
  mockData,
  administratedById = '',
  selectMode = true,
}: {
  mockData: DhUserByIdMarketParticipant[];
  administratedById?: string;
  selectMode?: boolean;
}) {
  const updateUserRolesOutput = vi.fn();

  const result = await render(DhUserRolesComponent, {
    inputs: {
      selectMode,
      administratedById,
      userRolesPerActor: mockData,
    },
    on: {
      updateUserRoles: updateUserRolesOutput,
    },
    imports: [getTranslocoTestingModule()],
  });

  return { updateUserRolesOutput, result };
}

describe(DhUserRolesComponent, () => {
  it('show title in correct format', async () => {
    await setup({ mockData: globalMockData });

    const partialTitle = 'gln-number-1 • Organization 1 - Market Participant 1';

    expect(screen.getByText((content) => content.includes(partialTitle))).toBeInTheDocument();
  });

  it('show icon and tooltip for administered user', async () => {
    await setup({ mockData: globalMockData, administratedById: '1234' });

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('show error when all user roles are unchecked', async () => {
    const localMockData = [
      generateMarketParticipant('1234', EicFunction.DataHubAdministrator, true, true, true),
    ];

    await setup({ mockData: localMockData });

    const [selectAllCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(selectAllCheckbox);

    expect(screen.getByText('Select at least one user role')).toBeInTheDocument();
  });

  it('do NOT call updateUserRoles output initially', async () => {
    const { updateUserRolesOutput } = await setup({
      mockData: globalMockData,
    });

    expect(updateUserRolesOutput).not.toHaveBeenCalled();
  });

  it('call updateUserRoles output when the user roles change', async () => {
    const localMockData = [
      generateMarketParticipant('1234', EicFunction.DataHubAdministrator, true, false, false),
      generateMarketParticipant('5678', EicFunction.EnergySupplier, true, false, false),
    ];

    const { updateUserRolesOutput } = await setup({
      mockData: localMockData,
    });

    const [, secondCheckbox, thirdCheckbox] = screen.getAllByRole('checkbox');
    // Select a previously unselected role
    userEvent.click(thirdCheckbox);

    let expectedOutput: UpdateUserRoles = {
      actors: [
        {
          atLeastOneRoleIsAssigned: true,
          id: '1234',
          userRolesToUpdate: {
            added: ['role-id-2-3'],
            removed: [],
          },
        },
        {
          atLeastOneRoleIsAssigned: true,
          id: '5678',
          userRolesToUpdate: {
            added: ['role-id-1-4'],
            removed: [],
          },
        },
      ],
    };
    expect(updateUserRolesOutput).toHaveBeenCalledWith(expectedOutput);

    // Unselect a previously selected role
    userEvent.click(secondCheckbox);

    expectedOutput = {
      actors: [
        {
          atLeastOneRoleIsAssigned: true,
          id: '1234',
          userRolesToUpdate: {
            added: ['role-id-2-3'],
            removed: ['role-id-1-3'],
          },
        },
        {
          atLeastOneRoleIsAssigned: true,
          id: '5678',
          userRolesToUpdate: {
            added: ['role-id-1-4'],
            removed: [],
          },
        },
      ],
    };

    expect(updateUserRolesOutput).toHaveBeenCalledWith(expectedOutput);
  });
});
