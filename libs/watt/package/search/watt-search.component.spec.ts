//#region License
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
//#endregion
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattSearchComponent } from './watt-search.component';

describe(WattSearchComponent, () => {
  it('clear input (using button)', async () => {
    await render(WattSearchComponent);

    const search = screen.getByRole('searchbox');
    const button = screen.getByRole('button');

    userEvent.type(search, 'test');
    expect(search).toHaveValue('test');

    userEvent.click(button);
    expect(search).toHaveValue('');
  });

  it('clear input (using component API)', async () => {
    const { fixture } = await render(WattSearchComponent);

    const search = screen.getByRole('searchbox');
    userEvent.type(search, 'test');

    fixture.componentInstance.clear();

    expect(search).toHaveValue('');
  });
});
