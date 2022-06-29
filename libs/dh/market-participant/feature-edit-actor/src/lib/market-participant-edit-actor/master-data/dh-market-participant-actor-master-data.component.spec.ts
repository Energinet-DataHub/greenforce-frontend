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
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { ActorChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en } from '@energinet-datahub/dh/globalization/assets-localization';
import { DhMarketParticipantActorMasterDataComponent, DhMarketParticipantActorMasterDataComponentScam } from './dh-market-participant-actor-master-data.component';

describe('DhMarketParticipantActorMasterDataComponent', () => {
  async function setup(changes: ActorChanges) {
    const view = await render(
      DhMarketParticipantActorMasterDataComponent,
      {
        componentProperties: {
          changes: changes,
        },
        imports: [
          DhMarketParticipantActorMasterDataComponentScam,
          getTranslocoTestingModule(),
        ],
      }
    );

    await runOnPushChangeDetection(view.fixture);

    return { view };
  }

  test('should edit actor number for new', async () => {
    // arrange
    const changes: ActorChanges = {
      actorNumber: '',
      status: 'New',
    };

    await setup(changes);

    const expected: ActorChanges = {
      actorNumber: '7071600998397',
      status: 'New',
    };

    // act
    const numberTextBox = screen.getByRole('textbox');
    userEvent.type(numberTextBox, expected.actorNumber);

    // assert
    expect(expected).toEqual(changes);
  });

  test('should edit status for existing', async () => {
    // arrange
    const changes: ActorChanges = {
      actorId: '879AD937-A036-484D-9D3F-76C3D92A1F3F',
      actorNumber: '7071600998397',
      status: 'Active',
    };

    await setup(changes);

    const expected: ActorChanges = {
      actorId: '879AD937-A036-484D-9D3F-76C3D92A1F3F',
      actorNumber: '7071600998397',
      status: 'Inactive',
    };

    // act
    const statusComboBox = screen.getByRole('combobox', {
      name: en.marketParticipant.actor.create.masterData.statuses.Active
    });
    userEvent.click(statusComboBox);

    const statusOption = screen.getByText(
      en.marketParticipant.actor.create.masterData.statuses.Inactive
    );
    userEvent.click(statusOption);

    // assert
    expect(expected).toEqual(changes);
  });
});
