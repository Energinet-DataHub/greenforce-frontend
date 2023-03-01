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

import { WattChipsModule } from './watt-chips.module';
import { WattChipsComponent, WattChipsOption, WattChipsSelection } from './watt-chips.component';

const options = [
  { label: 'Chip 1', value: '1' },
  { label: 'Chip 2', value: '2' },
  { label: 'Chip 3', value: '3' },
  { label: 'Chip 4', value: '4' },
];

interface Properties {
  options: WattChipsOption[];
  selection?: string | null;
  selectionChange?: (selection: WattChipsSelection) => void;
}

function setup(componentProperties: Properties) {
  return render(
    `<watt-chips
      [options]="options"
      [selection]="selection"
      (selectionChange)="selectionChange($event)"
      ></watt-chips>`,
    {
      declarations: [WattChipsComponent],
      imports: [WattChipsModule],
      componentProperties,
    }
  );
}

describe(WattChipsComponent.name, () => {
  it('renders a single chip', async () => {
    await setup({ options: options.slice(0, 1) });

    expect(screen.getByText('Chip 1')).toBeInTheDocument();
  });

  it('renders multiple chips', async () => {
    await setup({ options });

    expect(screen.queryAllByRole('option')).toHaveLength(4);
    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
  });

  it('renders with default chip', async () => {
    await setup({ options, selection: '3' });

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Chip 3');
  });

  it('selects chip on click', async () => {
    const selectionChange = jest.fn();
    await setup({ options, selectionChange });

    userEvent.click(screen.getByText('Chip 1'));

    expect(selectionChange).nthCalledWith(1, '1');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Chip 1');
  });

  it('selects at most one chip', async () => {
    const selectionChange = jest.fn();
    await setup({ options, selectionChange });

    userEvent.click(screen.getByText('Chip 2'));
    userEvent.click(screen.getByText('Chip 4'));

    expect(selectionChange).nthCalledWith(1, '2');
    expect(selectionChange).nthCalledWith(2, '4');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Chip 4');
  });

  it('prevents deselection by click', async () => {
    const selectionChange = jest.fn();
    await setup({ options, selectionChange });

    userEvent.click(screen.getByText('Chip 1'));
    userEvent.click(screen.getByText('Chip 3'));
    userEvent.click(screen.getByText('Chip 3'));

    expect(selectionChange).nthCalledWith(1, '1');
    expect(selectionChange).nthCalledWith(2, '3');
    expect(selectionChange).toBeCalledTimes(2);
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Chip 3');
  });

  it('deselects when selection changes to null', async () => {
    const selectionChange = jest.fn();
    const properties = { options, selection: '2', selectionChange };
    const { change } = await setup(properties);

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Chip 2');

    change({ ...properties, selection: null });

    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();
  });
});
