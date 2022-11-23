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
import {
  DhMarketParticipantActorContactDataComponent,
  DhMarketParticipantActorContactDataComponentScam,
} from './dh-market-participant-actor-contact-data.component';
import { ActorContactDto } from '@energinet-datahub/dh/shared/domain';
import { ActorContactChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { EventEmitter } from '@angular/core';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';

describe(DhMarketParticipantActorContactDataComponent.name, () => {
  async function setup(contacts: ActorContactDto[]) {
    const outputFn = jest.fn();
    const view = await render(DhMarketParticipantActorContactDataComponent, {
      componentProperties: {
        contacts,
        contactsChanged: { emit: outputFn } as unknown as EventEmitter<{
          isValid: boolean;
          add: ActorContactChanges[];
          remove: ActorContactDto[];
        }>,
      },
      imports: [
        DhMarketParticipantActorContactDataComponentScam,
        getTranslocoTestingModule(),
      ],
    });

    await runOnPushChangeDetection(view.fixture);

    return { view, outputFn };
  }

  const contacts: ActorContactDto[] = [
    {
      contactId: 'E7199A8C-948C-4BA6-880E-8CBD8D0DB977',
      category: 'Default',
      name: 'John',
      email: 'john@example.com',
    },
  ];

  test('should edit existing', async () => {
    // arrange
    const { outputFn } = await setup(contacts);

    const expected: ActorContactChanges = {
      category: contacts[0].category,
      email: contacts[0].email,
      name: 'Jane',
      phone: contacts[0].phone,
    };

    const nameTextBox = screen.getByRole('textbox', {
      name: /name field for existing contact/i,
    });

    // act
    userEvent.clear(nameTextBox);
    userEvent.type(nameTextBox, expected.name as string);

    // assert
    expect(outputFn).toHaveBeenLastCalledWith({
      isValid: true,
      add: [expected],
      remove: [contacts[0]],
    });
  });

  test('should delete existing', async () => {
    // arrange
    const { outputFn } = await setup(contacts);

    const deleteButton = within(
      screen.getByRole('cell', { name: /delete button for existing contact/i })
    ).getByRole('button');

    // act
    userEvent.click(deleteButton);

    // assert
    expect(outputFn).toHaveBeenLastCalledWith({
      isValid: true,
      add: [],
      remove: [contacts[0]],
    });
  });

  test('should add new', async () => {
    // arrange
    const { outputFn } = await setup([]);

    const expected: ActorContactChanges = {
      category: 'Default',
      email: 'jane@example.com',
      name: 'Jane',
      phone: '12345678',
    };

    const categories = within(
      screen.getByRole('cell', { name: /category field for new contact/i })
    ).getByRole('combobox');
    userEvent.click(categories);

    const category = screen.getAllByRole('option')[1];
    const name = screen.getByRole('textbox', {
      name: /name field for new contact/i,
    });
    const email = screen.getByRole('textbox', {
      name: /mail field for new contact/i,
    });
    const phone = screen.getByRole('textbox', {
      name: /phone field for new contact/i,
    });

    // act
    userEvent.click(category);
    userEvent.type(name, expected.name as string);
    userEvent.type(email, expected.email as string);
    userEvent.type(phone, expected.phone as string);

    // assert
    expect(outputFn).toHaveBeenLastCalledWith({
      isValid: true,
      add: [expected],
      remove: [],
    });
  });
});
