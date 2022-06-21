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
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { EventEmitter } from '@angular/core';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import {
  DhMarketParticipantActorMarketRolesNewComponent,
  DhMarketParticipantActorMarketRolesNewComponentScam,
} from './dh-market-participant-actor-market-roles-new.component';
import { en } from '@energinet-datahub/dh/globalization/assets-localization';

describe(DhMarketParticipantActorMarketRolesNewComponent.name, () => {
  async function setup(gridAreas: GridAreaDto[]) {
    const outputFn = jest.fn();
    const view = await render(DhMarketParticipantActorMarketRolesNewComponent, {
      componentProperties: {
        gridAreas: gridAreas,
        changed: {
          emit: outputFn,
        } as unknown as EventEmitter<MarketRoleChanges>,
      },
      imports: [
        DhMarketParticipantActorMarketRolesNewComponentScam,
        getTranslocoTestingModule(),
      ],
    });

    await runOnPushChangeDetection(view.fixture);

    return { view, outputFn };
  }

  const gridAreas: GridAreaDto[] = [
    {
      id: '9117A657-2839-4DA5-94DC-89F7EE55F62F',
      code: 'code',
      name: 'name',
      priceAreaCode: 'DK1',
    },
  ];

  test('should add new', async () => {
    // arrange
    const { outputFn } = await setup(gridAreas);

    const expected = {
      marketRoles: [
        {
          gridAreas: [
            {
              gridArea: gridAreas[0].id,
              meteringPointTypes: ['D01VeProduction'],
            },
          ],
          marketRole: 'GridAccessProvider',
        },
      ],
    };

    // act
    // select market role
    const marketRoleOptions = within(
      screen.getByRole('cell', {
        name: en.marketParticipant.actor.create.marketRoles.marketRole,
      })
    ).getByRole('combobox');
    userEvent.click(marketRoleOptions);

    const marketRoleOption = screen.getByText(
      en.marketParticipant.marketRoles.GridAccessProvider
    );
    userEvent.click(marketRoleOption);

    // select grid area
    const gridAreaOptions = within(
      screen.getByRole('cell', {
        name: en.marketParticipant.actor.create.marketRoles.gridArea,
      })
    ).getByRole('combobox');
    userEvent.click(gridAreaOptions);

    const gridAreaOption = screen.getByText(
      `${gridAreas[0].code} - ${gridAreas[0].name}`
    );
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
});
