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
import { OrganizationChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import {
  DhMarketParticipantOrganizationMasterDataComponent,
  DhMarketParticipantOrganizationMasterDataComponentScam,
} from './dh-market-participant-organization-master-data.component';
import { en } from '@energinet-datahub/dh/globalization/assets-localization';

describe(DhMarketParticipantOrganizationMasterDataComponent.name, () => {
  async function setup(changes: OrganizationChanges) {
    const view = await render(
      DhMarketParticipantOrganizationMasterDataComponent,
      {
        componentProperties: {
          changes: changes,
        },
        imports: [
          DhMarketParticipantOrganizationMasterDataComponentScam,
          getTranslocoTestingModule(),
        ],
      }
    );

    await runOnPushChangeDetection(view.fixture);

    return { view };
  }

  test('should edit', async () => {
    // arrange
    const changes = {
      address: { country: 'DK' },
    };

    await setup(changes);

    const expected = {
      name: 'name',
      businessRegisterIdentifier: 'bri',
      comment: 'comment',
      address: {
        country: 'SE',
        city: 'city',
        number: '10',
        streetName: 'street',
        zipCode: '7000',
      },
    };

    // act
    const nameTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData
        .organizationNameLabel,
    });
    userEvent.type(nameTextBox, expected.name);

    const briTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData
        .businessRegistrationIdetifierLabel,
    });
    userEvent.type(briTextBox, expected.businessRegisterIdentifier);

    const cityTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData.cityLabel,
    });
    userEvent.type(cityTextBox, expected.address.city);

    const streetTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData.streetNameLabel,
    });
    userEvent.type(streetTextBox, expected.address.streetName);

    const numberTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData
        .streetNumberLabel,
    });
    userEvent.type(numberTextBox, expected.address.number);

    const zipCodeTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData.zipCodeLabel,
    });
    userEvent.type(zipCodeTextBox, expected.address.zipCode);

    const countryComboBox = screen.getByRole('combobox', {
      name: en.marketParticipant.organization.create.masterData.countries.dk,
    });
    userEvent.click(countryComboBox);

    const countryOption = screen.getByText(
      en.marketParticipant.organization.create.masterData.countries.se
    );
    userEvent.click(countryOption);

    const commentTextBox = screen.getByRole('textbox', {
      name: en.marketParticipant.organization.create.masterData.commentLabel,
    });
    userEvent.type(commentTextBox, expected.comment);

    // assert
    expect(expected).toEqual(changes);
  });
});
