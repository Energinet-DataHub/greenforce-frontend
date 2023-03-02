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
import {
  DhMarketParticipantActorMasterDataComponent,
  DhMarketParticipantActorMasterDataComponentScam,
} from './dh-market-participant-actor-master-data.component';

describe('DhMarketParticipantActorMasterDataComponent', () => {
  async function setup(changes: ActorChanges) {
    const view = await render(DhMarketParticipantActorMasterDataComponent, {
      componentProperties: {
        changes: changes,
      },
      imports: [DhMarketParticipantActorMasterDataComponentScam, getTranslocoTestingModule()],
    });

    return { view };
  }

  test('should edit actor number for new', async () => {
    // arrange
    const changes: ActorChanges = {
      existingActor: false,
      actorNumber: '',
      status: 'New',
      name: '',
    };

    const { view } = await setup(changes);
    await runOnPushChangeDetection(view.fixture);

    const expected: ActorChanges = {
      existingActor: false,
      actorNumber: '7071600998397',
      status: 'New',
      name: '',
    };

    // act
    const numberTextBox: HTMLInputElement = screen.getByRole('textbox', {
      name: en.marketParticipant.actor.create.masterData.labelActorNumber,
    });
    await userEvent.type(numberTextBox, expected.actorNumber);

    expect(numberTextBox).toHaveValue(expected.actorNumber);

    // assert
    expect(changes).toEqual(expected);
  });

  test('should edit status for existing', async () => {
    // arrange
    const changes: ActorChanges = {
      existingActor: true,
      actorNumber: '7071600998397',
      status: 'Active',
      name: '',
    };

    const { view } = await setup(changes);
    await runOnPushChangeDetection(view.fixture);

    const expected: ActorChanges = {
      existingActor: true,
      actorNumber: '7071600998397',
      status: 'Inactive',
      name: '',
    };

    // act
    const statusComboBox = await screen.findByRole('combobox', {
      name: en.marketParticipant.actor.create.masterData.statuses.Active,
    });
    await userEvent.click(statusComboBox);

    const statusOption = screen.getByText(
      en.marketParticipant.actor.create.masterData.statuses.Inactive
    );
    await userEvent.click(statusOption);

    // assert
    expect(changes).toEqual(expected);
  });

  test('should disable actor number and enable status combobox for existing', async () => {
    // arrange
    const changes: ActorChanges = {
      existingActor: true,
      actorNumber: '7071600998397',
      status: 'Active',
      name: '',
    };

    const { view } = await setup(changes);
    await runOnPushChangeDetection(view.fixture);

    // act
    const numberTextBox: HTMLInputElement = screen.getByRole('textbox', {
      name: en.marketParticipant.actor.create.masterData.labelActorNumber,
    });
    const statusComboBox = await screen.findByRole('combobox', {
      name: en.marketParticipant.actor.create.masterData.statuses.Active,
    });

    // assert
    expect(numberTextBox).toBeDisabled();
    expect(statusComboBox.getAttribute('aria-disabled')).toEqual('false');
  });

  test('should enable enable actor number and disable status combox for new', async () => {
    // arrange
    const changes: ActorChanges = {
      existingActor: false,
      actorNumber: '7071600998397',
      status: 'New',
      name: '',
    };

    const { view } = await setup(changes);
    await runOnPushChangeDetection(view.fixture);

    // act
    const numberTextBox: HTMLInputElement = screen.getByRole('textbox', {
      name: en.marketParticipant.actor.create.masterData.labelActorNumber,
    });
    const statusComboBox = await screen.findByRole('combobox', {
      name: en.marketParticipant.actor.create.masterData.statuses.New,
    });

    // assert
    expect(numberTextBox).toBeEnabled();
    expect(statusComboBox.getAttribute('aria-disabled')).toEqual('true');
  });

  test('should edit actor name for new', async () => {
    // arrange
    const changes: ActorChanges = {
      existingActor: false,
      actorNumber: '7071600998397',
      status: 'New',
      name: '',
    };

    const { view } = await setup(changes);
    await runOnPushChangeDetection(view.fixture);

    const expected: ActorChanges = {
      existingActor: false,
      actorNumber: '7071600998397',
      status: 'New',
      name: 'NewName',
    };

    // act
    const nameTextBox: HTMLInputElement = screen.getByRole('textbox', {
      name: en.marketParticipant.actor.create.masterData.labelActorName,
    });
    await userEvent.clear(nameTextBox);
    await userEvent.type(nameTextBox, expected.name);

    expect(nameTextBox).toHaveValue(expected.name);

    // assert
    expect(changes).toEqual(expected);
  });

  test('should edit name for existing', async () => {
    // arrange
    const changes: ActorChanges = {
      existingActor: true,
      actorNumber: '7071600998397',
      status: 'Active',
      name: 'CurrentName',
    };

    const { view } = await setup(changes);
    await runOnPushChangeDetection(view.fixture);

    const expected: ActorChanges = {
      existingActor: true,
      actorNumber: '7071600998397',
      status: 'Active',
      name: 'NewName',
    };

    // act
    const nameTextBox: HTMLInputElement = screen.getByRole('textbox', {
      name: en.marketParticipant.actor.create.masterData.labelActorName,
    });
    await userEvent.clear(nameTextBox);
    await userEvent.type(nameTextBox, expected.name);

    // assert
    expect(changes).toEqual(expected);
  });
});
