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
import user from '@testing-library/user-event';

import { WattChipsModule } from './watt-chips.module';
import { WattChipsComponent, WattChipsSelection } from './watt-chips.component';
import { EventEmitter } from '@angular/core';

describe(WattChipsComponent.name, () => {
  it('renders a single chip', async () => {
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        options: [{ label: 'Chip 1', value: '1' }],
      },
    });

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
  });

  it('renders multiple chips', async () => {
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        options: [
          { label: 'Chip 1', value: '1' },
          { label: 'Chip 2', value: '2' },
          { label: 'Chip 3', value: '3' },
          { label: 'Chip 4', value: '4' },
        ],
      },
    });

    expect(screen.queryAllByText('Chip', { exact: false })).toHaveLength(4);
  });

  it('selects chip on click', async () => {
    const spy = jest.fn();
    const options = [
      { label: 'Chip 1', value: '1' },
      { label: 'Chip 2', value: '2' },
      { label: 'Chip 3', value: '3' },
      { label: 'Chip 4', value: '4' },
    ];

    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        selectionChange: {
          emit: (option) => spy(option),
        } as EventEmitter<WattChipsSelection>,
        options,
      },
    });

    user.click(screen.getByText('Chip 1'));

    expect(spy).toHaveBeenCalledWith(options[0]);
  });
});
