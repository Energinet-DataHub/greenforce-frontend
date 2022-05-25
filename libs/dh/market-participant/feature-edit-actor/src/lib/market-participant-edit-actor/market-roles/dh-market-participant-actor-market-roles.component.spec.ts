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
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { DhMarketParticipantActorMarketRolesComponent } from './dh-market-participant-actor-market-roles.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { MarketRoleService } from './market-role.service';
import { EicFunction } from '@energinet-datahub/dh/shared/domain';
import {HarnessLoader, parallel} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ListItemHarnessFilters, ListOptionHarnessFilters, MatSelectionListHarness} from '@angular/material/list/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
let loader: HarnessLoader;

describe('MarketRolesComponent', () => {
  async function setup(marketRolesEicFunctionsArrToTest: EicFunction[]) {
    const view = await render(DhMarketParticipantActorMarketRolesComponent, {
      componentProperties: {
        marketRolesEicFunctions: marketRolesEicFunctionsArrToTest as EicFunction[]
      },
      imports: [
        NoopAnimationsModule,
        HttpClientModule,
        DhApiModule.forRoot(),
        getTranslocoTestingModule(),
      ],
    });
    loader = TestbedHarnessEnvironment.loader(view.fixture);
    return view;
  }

  function getAllOptions() {
    return screen.getAllByRole('option');
  }

  xtest('should render checkbox list', async () => {
    await setup([]);

    const elm = screen.getByRole('listbox');
    expect(elm).toBeInTheDocument();
  });

  xtest('should render checkbox options', async () => {
    await setup([]);

    const marketRoleService = new MarketRoleService();
    const availableMarketRolesCount =
      marketRoleService.getAvailableMarketRoles.length;

    const allOptions = getAllOptions();
    expect(allOptions).toHaveLength(availableMarketRolesCount);
  });

  xtest('should render checkbox options, preselected', async () => {
    const view = await setup([ EicFunction.GridAccessProvider ]);

    await view.fixture.whenStable();

    view.fixture.detectChanges();

    const compo = await loader.getHarness(MatSelectionListHarness)

    const filter123 = { selected: true };

    const result = await compo.getItems(filter123);

    expect(result).toHaveLength(1);
  });

  test('should render checkbox options, on selection output', async () => {
    // Arrange
    const view = await setup([EicFunction.GridAccessProvider, EicFunction.MeterAdministrator]);

    await view.fixture.whenStable();

    const allOptions = getAllOptions();

    const ngReflectValue = 'ng-reflect-value';
    const gridAccessProviderOption = allOptions.find(e => e.attributes.getNamedItem(ngReflectValue)?.value == EicFunction.GridAccessProvider) as HTMLOptionElement;
    const meterAdministratorOption = allOptions.find(e => e.attributes.getNamedItem(ngReflectValue)?.value == EicFunction.MeterAdministrator) as HTMLOptionElement;
    const systemOperatorOption = allOptions.find(e => e.attributes.getNamedItem(ngReflectValue)?.value == EicFunction.SystemOperator) as HTMLOptionElement;

    /*let outputSelectionResult: EicFunction[] = [];
    view.fixture.componentInstance.marketRolesEicFunctionsChange.subscribe(
      (value) => outputSelectionResult = value
    );*/

    // Act
    /*userEvent.click(gridAccessProviderOption);
    await view.fixture.whenStable();

    userEvent.click(meterAdministratorOption);
    view.fixture.detectChanges();

    await view.fixture.whenStable();
*/
    /*userEvent.click(systemOperatorOption, undefined,
      { skipPointerEventsCheck: true,
    }); // not selectable by disabled validation
*/
    // Assert
    const compo = await loader.getHarness(MatSelectionListHarness)

    const filter123 = { selected: true };

    const items = await compo.getItems();

    //await items[0].toggle();
    //await items[1].toggle();

    console.log("selected0", await items[0].isSelected())
    console.log("selected2", await items[1].isSelected())

    view.fixture.detectChanges();

    await view.fixture.whenStable();

    console.log("disabled5", await items[5].isDisabled())

    expect(items.length).toBe(16);
    expect(await items[0].isDisabled()).toBe(false);
    expect(await items[5].isDisabled()).toBe(true);

    const selectedRoles = await compo.getItems(filter123);
    const disabledOptions =  await parallel(() => items.filter((e) => e.isDisabled()));

    expect(selectedRoles).toHaveLength([gridAccessProviderOption, meterAdministratorOption].length);
    expect(await disabledOptions).toHaveLength(10);
  });
});
