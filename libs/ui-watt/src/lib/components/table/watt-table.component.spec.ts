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
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattTableDataSource } from './watt-table-data-source';
import {
  WattTableColumnDef,
  WattTableComponent,
  WATT_TABLE,
} from './watt-table.component';

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const data: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
];

interface Properties<T> {
  dataSource: WattTableDataSource<T>;
  columns: WattTableColumnDef<T>;
  sortBy?: string;
  sortDirection?: string;
  selectable?: boolean;
  selectionChange?: (selection: T[]) => void;
  rowClick?: (row: T) => void;
}

function setup<T>(properties: Properties<T>, template = '') {
  return render(
    `<watt-table
      #table
      [dataSource]="dataSource"
      [columns]="columns"
      [sortBy]="sortBy"
      [sortDirection]="sortDirection"
      [selectable]="selectable"
      (selectionChange)="selectionChange($event)"
      (rowClick)="rowClick($event)"
      >${template}</watt-table>`,
    { imports: WATT_TABLE, componentProperties: properties }
  );
}

describe(WattTableComponent.name, () => {
  it('renders all rows and columns from dataSource', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      name: { header: 'Name' },
      weight: { header: 'Weight' },
      symbol: { header: 'Symbol' },
    };

    await setup({ dataSource, columns });

    expect(screen.queryAllByRole('row')).toHaveLength(7);
    expect(screen.queryAllByRole('columnheader')).toHaveLength(4);
  });

  it('only renders columns as provided in input', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      name: { header: 'Name' },
    };

    await setup({ dataSource, columns });

    expect(screen.queryAllByRole('columnheader')).toHaveLength(2);
  });

  it('renders headers with strings provided in columns', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      name: { header: 'Element' },
    };

    await setup({ dataSource, columns });

    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Element')).toBeInTheDocument();
  });

  it('renders headers using callback provided in columns', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: (id) => id.toUpperCase() },
    };

    await setup({ dataSource, columns });

    expect(screen.getByText('POSITION')).toBeInTheDocument();
  });

  it('renders cells using callback provided in columns', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position', cell: (data) => `Number #${data}` },
    };

    await setup({ dataSource, columns });

    expect(screen.queryAllByText('Number #', { exact: false })).toHaveLength(6);
  });

  it('allows for sorting of column data', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position', sort: true },
      weight: { header: 'Weight', sort: false },
    };

    await setup({
      dataSource,
      columns,
      sortBy: 'position',
      sortDirection: 'asc',
    });

    expect(
      screen.getByRole('columnheader', { name: 'Position' })
    ).toHaveAttribute('aria-sort', 'ascending');
    expect(
      screen.getByRole('columnheader', { name: 'Weight' })
    ).toHaveAttribute('aria-sort', 'none');
  });

  it('renders checkbox column when selectable is true', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, selectable: true });

    expect(screen.queryAllByRole('checkbox')).toHaveLength(7);
  });

  it('outputs entire dataset when selecting all rows', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, selectable: true, selectionChange });

    const [firstCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(firstCheckbox);

    expect(selectionChange).toHaveBeenCalledWith(data);
  });

  it('outputs empty array when unselecting all rows', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, selectable: true, selectionChange });

    const [firstCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(firstCheckbox);
    userEvent.click(firstCheckbox);

    expect(selectionChange).toHaveBeenLastCalledWith([]);
  });

  it('outputs data when checking individual rows', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, selectable: true, selectionChange });

    const [, secondCheckbox, thirdCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(secondCheckbox);
    userEvent.click(thirdCheckbox);

    expect(selectionChange).toHaveBeenNthCalledWith(1, [data[0]]);
    expect(selectionChange).toHaveBeenNthCalledWith(2, [data[0], data[1]]);
  });

  it('automatically checks the select all checkbox', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, selectable: true, selectionChange });

    const [firstCheckbox, ...checkboxes] = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => userEvent.click(checkbox));

    await waitFor(() => expect(firstCheckbox).toBeChecked());
  });

  it('automatically unchecks the select all checkbox', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, selectable: true, selectionChange });

    const [firstCheckbox, secondCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(firstCheckbox);
    userEvent.click(secondCheckbox);

    await waitFor(() => expect(firstCheckbox).not.toBeChecked());
  });

  it('outputs event when clicking on row', async () => {
    const rowClick = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup({ dataSource, columns, rowClick });

    const [firstCell] = screen.getAllByRole('cell');
    userEvent.click(firstCell);

    expect(rowClick).toHaveBeenCalledWith(data[0]);
  });

  it('renders cell content using template', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { header: 'Position' },
      weight: { header: 'Weight' },
    };

    await setup(
      { dataSource, columns },
      `<ng-container *wattTableCell="table.columns.position; let element">
         <span>Numero {{ element.position }}</span>
       </ng-container>`
    );

    expect(screen.getByText('Numero 1')).toBeInTheDocument();
  });
});
