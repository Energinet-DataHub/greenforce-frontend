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
  DhMarketParticipantActorMarketRolesComponent,
  DhMarketParticipantActorMarketRolesComponentScam,
} from './dh-market-participant-actor-market-roles.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { EventEmitter } from '@angular/core';
import { MarketRoleService } from './market-role.service';
import { EicFunction } from '@energinet-datahub/dh/shared/domain';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectionListHarness } from '@angular/material/list/testing';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

let loader: HarnessLoader;
const marketRoles = enTranslations.marketParticipant.marketRoles;

describe(DhMarketParticipantActorMarketRolesComponent.name, () => {
  async function setup(marketRolesEicFunctionsToTest: EicFunction[] = []) {
    const outputFn = jest.fn();

    const view = await render(DhMarketParticipantActorMarketRolesComponent, {
      componentProperties: {
        marketRolesEicFunctions: marketRolesEicFunctionsToTest,
        marketRolesEicFunctionsChange: {
          emit: outputFn,
        } as unknown as EventEmitter<EicFunction[]>,
      },
      imports: [
        DhMarketParticipantActorMarketRolesComponentScam,
        getTranslocoTestingModule(),
      ],
    });

    loader = TestbedHarnessEnvironment.loader(view.fixture);

    await runOnPushChangeDetection(view.fixture);

    return {
      view,
      outputFn,
    };
  }

  function getAllOptions() {
    return screen.getAllByRole('option');
  }

  test('should render checkbox list', async () => {
    await setup();

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('should render checkbox options', async () => {
    await setup();

    const marketRoleService = new MarketRoleService();
    const availableMarketRolesCount =
      marketRoleService.getAvailableMarketRoles.length;

    const allOptions = getAllOptions();
    expect(allOptions).toHaveLength(availableMarketRolesCount);
  });

  test('should render checkbox options, preselected', async () => {
    await setup([EicFunction.GridAccessProvider]);

    const matSelectionList = await loader.getHarness(MatSelectionListHarness);

    const result = await matSelectionList.getItems({ selected: true });

    expect(result).toHaveLength(1);
  });

  test('should render checkbox options, on selection output', async () => {
    // Arrange
    const { outputFn } = await setup([
      EicFunction.GridAccessProvider,
      EicFunction.MeterAdministrator,
    ]);

    const gridAccessProviderOption = await screen.findByText(
      new RegExp(marketRoles.GridAccessProvider, 'i')
    );

    // Act
    userEvent.click(gridAccessProviderOption);

    // Assert
    expect(outputFn).toHaveBeenCalledWith([EicFunction.MeterAdministrator]);
  });

  test('should render checkbox options, disabled option click', async () => {
    // Arrange
    const { outputFn } = await setup([EicFunction.GridAccessProvider]);

    const systemOperatorOptionDisabled = await screen.findByText(
      new RegExp(marketRoles.SystemOperator, 'i')
    );

    const meterAdministratorOption = await screen.findByText(
      new RegExp(marketRoles.MeterAdministrator, 'i')
    );

    // Act + Assert - Disabled output
    expect(() => userEvent.click(systemOperatorOptionDisabled)).toThrow();
    expect(outputFn).not.toHaveBeenCalled();

    // Act, available click
    userEvent.click(meterAdministratorOption);

    // Assert new output
    expect(outputFn).toHaveBeenCalledWith([
      EicFunction.GridAccessProvider,
      EicFunction.MeterAdministrator,
    ]);
  });
});
