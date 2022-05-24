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

import { HttpClientModule } from '@angular/common/http';
import { fireEvent, render, screen } from '@testing-library/angular';
import { DhMarketParticipantActorMarketRolesComponent } from './dh-market-participant-actor-market-roles.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { MarketRoleService } from './market-role.service';
import { EicFunction } from '@energinet-datahub/dh/shared/domain';

describe('MarketRolesChk', () => {
  test('should render checkbox list', async () => {
    await render(DhMarketParticipantActorMarketRolesComponent, {
      imports: [
        HttpClientModule,
        DhApiModule.forRoot(),
        getTranslocoTestingModule(),
      ],
    });

    const elm = screen.getByRole('listbox');
    expect(elm).toBeInTheDocument();
  });

  test('should render checkbox options', async () => {
    await render(DhMarketParticipantActorMarketRolesComponent, {
      imports: [
        HttpClientModule,
        DhApiModule.forRoot(),
        getTranslocoTestingModule(),
      ],
    });

    const marketRoleService = new MarketRoleService();
    const availableMarketRolesCount =
      marketRoleService.getAvailableMarketRoles.length;

    const elms = screen.getAllByRole('option');
    expect(elms).toHaveLength(availableMarketRolesCount);
  });

  test('should render checkbox options, preselected', async () => {
    const view = await render(DhMarketParticipantActorMarketRolesComponent, {
      componentProperties: {
        actor: {
          actorId: '123',
          externalActorId: '1234',
          gln: { value: '13' },
          gridAreas: [],
          marketRoles: [{ eicFunction: EicFunction.GridAccessProvider }],
          meteringPointTypes: [],
          status: 'New',
        },
      },
      imports: [
        HttpClientModule,
        DhApiModule.forRoot(),
        getTranslocoTestingModule(),
      ],
    });

    await view.fixture.whenStable();

    view.fixture.detectChanges();

    const allOptions = screen.getAllByRole('option');
    const selectedRoles = allOptions.filter(
      (e) => e.attributes.getNamedItem('aria-selected')?.value == 'true'
    );
    expect(selectedRoles).toHaveLength(1);
  });

  test('should render checkbox options, on selection', async () => {
    // Arrange
    const view = await render(DhMarketParticipantActorMarketRolesComponent, {
      componentProperties: {
        actor: {
          actorId: '123',
          externalActorId: '1234',
          gln: { value: '13' },
          gridAreas: [],
          marketRoles: [],
          meteringPointTypes: [],
          status: 'New',
        },
      },
      imports: [
        HttpClientModule,
        DhApiModule.forRoot(),
        getTranslocoTestingModule(),
      ],
    });

    await view.fixture.whenStable();

    const allOptions = screen.getAllByRole('option');

    const elemToSelect1 = allOptions[0] as HTMLOptionElement;
    const elemToSelect2 = allOptions[1] as HTMLOptionElement;
    const elemNotSelectable = allOptions[5] as HTMLOptionElement;

    // Act
    fireEvent.click(elemToSelect1);
    fireEvent.click(elemToSelect2);
    fireEvent.click(elemNotSelectable); // not selectable

    view.fixture.detectChanges();

    // Assert
    const selectedRoles = allOptions.filter(
      (e) => e.attributes.getNamedItem('aria-selected')?.value == 'true'
    );
    const changes = view.fixture.componentInstance.changes;

    expect(selectedRoles).toHaveLength([elemToSelect1, elemToSelect2].length);
    expect(changes.marketRoles).toHaveLength(
      [elemToSelect1, elemToSelect2].length
    );
  });
});
