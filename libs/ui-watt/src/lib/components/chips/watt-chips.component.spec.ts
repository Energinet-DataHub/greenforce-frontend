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

import { EventEmitter } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { render, screen } from '@testing-library/angular';
import user from '@testing-library/user-event';

import { WattChipsModule } from './watt-chips.module';
import { WattChipsComponent, WattChipsSelection } from './watt-chips.component';

const options = [
  { label: 'Chip 1', value: '1' },
  { label: 'Chip 2', value: '2' },
  { label: 'Chip 3', value: '3' },
  { label: 'Chip 4', value: '4' },
];

describe(WattChipsComponent.name, () => {
  it('renders a single chip', async () => {
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        options: options.slice(0, 1),
      },
    });

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
  });

  it('renders multiple chips', async () => {
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        options,
      },
    });

    expect(screen.queryAllByRole('option')).toHaveLength(4);
    expect(
      screen.queryByRole('option', { selected: true })
    ).not.toBeInTheDocument();
  });

  it('renders with default chip', async () => {
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        selection: '3',
        options,
      },
    });

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent(
      'Chip 3'
    );
  });

  it('selects chip on click', async () => {
    const selectionChange = new EventEmitter<WattChipsSelection>();
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        selectionChange,
        options,
      },
    });

    const selection = firstValueFrom(selectionChange);
    user.click(screen.getByText('Chip 1'));

    expect(await selection).toBe('1');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent(
      'Chip 1'
    );
  });

  it('selects at most one chip', async () => {
    const selectionChange = new EventEmitter<WattChipsSelection>();
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        selectionChange,
        options,
      },
    });

    const selections = firstValueFrom(selectionChange.pipe(take(2), toArray()));
    user.click(screen.getByText('Chip 2'));
    user.click(screen.getByText('Chip 4'));

    expect(await selections).toStrictEqual(['2', '4']);
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent(
      'Chip 4'
    );
  });

  it('deselects chip', async () => {
    const selectionChange = new EventEmitter<WattChipsSelection>();
    await render(WattChipsComponent, {
      imports: [WattChipsModule],
      componentProperties: {
        selectionChange,
        options,
      },
    });

    const selections = firstValueFrom(selectionChange.pipe(take(3), toArray()));
    user.click(screen.getByText('Chip 1'));
    user.click(screen.getByText('Chip 3'));
    user.click(screen.getByText('Chip 3'));

    expect(await selections).toStrictEqual(['1', '3', null]);
    expect(
      screen.queryByRole('option', { selected: true })
    ).not.toBeInTheDocument();
  });
});
