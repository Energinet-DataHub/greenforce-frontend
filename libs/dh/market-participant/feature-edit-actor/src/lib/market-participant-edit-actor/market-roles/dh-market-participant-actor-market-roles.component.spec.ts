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

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { ActorMarketRoleDto, ActorStatus, GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { EventEmitter } from '@angular/core';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import {
  DhMarketParticipantActorMarketRolesComponent,
  DhMarketParticipantActorMarketRolesComponentScam,
} from './dh-market-participant-actor-market-roles.component';
import { en } from '@energinet-datahub/dh/globalization/assets-localization';

describe(DhMarketParticipantActorMarketRolesComponent.name, () => {
  async function setup(
    actorStatus: ActorStatus,
    gridAreas: GridAreaDto[],
    existingActorMarketRoles: ActorMarketRoleDto[]
  ) {
    const outputFn = jest.fn();
    const view = await render(DhMarketParticipantActorMarketRolesComponent, {
      componentProperties: {
        actorStatus: actorStatus,
        gridAreas: gridAreas,
        actorMarketRoles: existingActorMarketRoles,
        changed: {
          emit: outputFn,
        } as unknown as EventEmitter<MarketRoleChanges>,
      },
      imports: [DhMarketParticipantActorMarketRolesComponentScam, getTranslocoTestingModule()],
    });

    await runOnPushChangeDetection(view.fixture);

    return { view, outputFn };
  }

  const gridAreas: GridAreaDto[] = [
    {
      id: '9117A657-2839-4DA5-94DC-89F7EE55F62F',
      code: 'code',
      name: 'name',
      priceAreaCode: 'Dk1',
      validFrom: '2022-08-29T22:00:00.000Z',
    },
  ];

  test('should add new', async () => {
    // arrange
    const { outputFn } = await setup(ActorStatus.New, gridAreas, []);

    const expected = {
      isValid: true,
      marketRoles: [
        {
          gridAreas: [
            {
              id: gridAreas[0].id,
              meteringPointTypes: ['D01VeProduction'],
            },
          ],
          marketRole: 'GridAccessProvider',
        },
      ],
    };

    // act
    // click add
    const addButton = screen.getByRole('button', {
      name: 'add',
    });
    userEvent.click(addButton);

    // select market role
    const marketRoleOptions = within(
      screen.getByRole('cell', {
        name: en.marketParticipant.actor.create.marketRoles.marketRole,
      })
    ).getByRole('combobox');
    userEvent.click(marketRoleOptions);

    const marketRoleOption = screen.getByText(en.marketParticipant.marketRoles.GridAccessProvider);
    userEvent.click(marketRoleOption);

    // select grid area
    const gridAreaOptions = within(
      screen.getByRole('cell', {
        name: en.marketParticipant.actor.create.marketRoles.gridArea,
      })
    ).getByRole('combobox');
    userEvent.click(gridAreaOptions);

    const gridAreaOption = screen.getByText(`${gridAreas[0].code} - ${gridAreas[0].name}`);
    userEvent.click(gridAreaOption);

    // select metering point types
    const meteringPointTypeOptions = within(
      screen.getByRole('cell', {
        name: en.marketParticipant.actor.create.marketRoles.meteringPointTypes,
      })
    ).getByRole('combobox');
    userEvent.click(meteringPointTypeOptions);

    const meteringPointTypeOption = screen.getByText('D01VeProduction');
    userEvent.click(meteringPointTypeOption);
    userEvent.tab();

    // assert
    expect(outputFn).toHaveBeenLastCalledWith(expected);
  });

  test('should remove existing if status is new', async () => {
    // arrange
    const { outputFn } = await setup(ActorStatus.New, gridAreas, [
      {
        eicFunction: 'BalanceResponsibleParty',
        gridAreas: [{ id: gridAreas[0].id, meteringPointTypes: ['D01VeProduction'] }],
      },
    ]);

    const expected = { isValid: true, marketRoles: [] };

    // act
    const deleteButton = screen.getByRole('button', {
      name: 'delete',
    });

    userEvent.click(deleteButton);

    // assert
    expect(outputFn).toHaveBeenLastCalledWith(expected);
  });

  test('should not remove existing if status is not new', async () => {
    // arrange
    const { outputFn } = await setup(ActorStatus.Active, gridAreas, [
      {
        eicFunction: 'BalanceResponsibleParty',
        gridAreas: [{ id: gridAreas[0].id, meteringPointTypes: ['D01VeProduction'] }],
      },
    ]);

    const expected = { isValid: true, marketRoles: [] };

    // act
    const deleteButton = screen.getByRole('button', {
      name: 'delete',
    });

    // assert
    expect(() => userEvent.click(deleteButton)).toThrow();
    expect(outputFn).not.toHaveBeenLastCalledWith(expected);
  });
});
