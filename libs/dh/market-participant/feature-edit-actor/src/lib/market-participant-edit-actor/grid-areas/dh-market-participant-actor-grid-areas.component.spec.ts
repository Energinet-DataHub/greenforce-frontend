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

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
  DhMarketParticipantActorGridAreasComponent,
  DhMarketParticipantActorGridAreasComponentScam,
} from './dh-market-participant-actor-grid-areas.component';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';

describe(DhMarketParticipantActorGridAreasComponent.name, () => {
  async function setup(
    actorGridAreas: GridAreaDto[],
    gridAreas: GridAreaDto[]
  ) {
    return await render(DhMarketParticipantActorGridAreasComponent, {
      componentProperties: {
        gridAreas: gridAreas,
        selectedGridAreas: actorGridAreas,
      },
      imports: [DhMarketParticipantActorGridAreasComponentScam],
    });
  }

  const gridAreas = [
    {
      id: '4FC3CA82-6EC3-4E51-881F-CA2E39261BA3',
      code: 'C1',
      name: 'A1',
      priceAreaCode: 'DK1',
    },
    {
      id: 'CEAC5A4B-A72C-4ABF-9F1A-87D11517E4B2',
      code: 'C2',
      name: 'A2',
      priceAreaCode: 'DK1',
    },
  ];

  test('should render list', async () => {
    // arrange, act
    await setup([], []);

    // assert
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('should render list options', async () => {
    // arrange, act
    await setup([], gridAreas);

    // assert
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  test('should pre-select options from actor', async () => {
    // arrange, act
    await setup([gridAreas[0]], gridAreas);

    // assert
    expect(
      screen
        .getAllByRole('option')
        .filter(
          (x) => x.attributes.getNamedItem('aria-selected')?.value == 'true'
        )
    ).toHaveLength(1);
  });

  test('should propagate selected areas to changes', async () => {
    // arrange
    const view = await setup([], gridAreas);
    await view.fixture.whenStable();

    let selectedGridAreas: GridAreaDto[] = [];
    const subscription = view.fixture.componentInstance.hasChanges.subscribe(
      (gridAreas) => (selectedGridAreas = gridAreas)
    );

    const options = screen.getAllByRole('option');

    // act
    userEvent.click(options[1]);

    // assert
    expect(selectedGridAreas).toHaveLength(1);
    subscription.unsubscribe();
  });
});
