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
import { Sort } from '@angular/material/sort';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattTableDataSource } from './watt-table-data-source';
import { WattTableColumnDef, WattTableComponent, WATT_TABLE } from './watt-table.component';

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

type WattTableOptions<T> = Partial<
  Pick<
    WattTableComponent<T>,
    | 'dataSource'
    | 'displayedColumns'
    | 'columns'
    | 'sortBy'
    | 'sortDirection'
    | 'activeRow'
    | 'selectable'
    | 'initialSelection'
    | 'resolveHeader'
  > & {
    selectionChange?: (selection: T[]) => void;
    rowClick?: (row: T) => void;
    sortChange?: (sort: Sort) => void;
  }
>;

function setup<T>(properties: WattTableOptions<T>, template = '') {
  return render(
    `<watt-table
      #table
      [dataSource]="dataSource"
      [columns]="columns"
      [displayedColumns]="displayedColumns"
      [sortBy]="sortBy"
      [sortDirection]="sortDirection"
      [selectable]="selectable"
      [activeRow]="activeRow"
      [resolveHeader]="resolveHeader"
      (selectionChange)="selectionChange($event)"
      [initialSelection]="initialSelection"
      (rowClick)="rowClick($event)"
      (sortChange)="sortChange($event)"
      >${template}</watt-table>`,
    { imports: WATT_TABLE, componentProperties: properties }
  );
}

describe(WattTableComponent.name, () => {
  it('renders all rows and columns from dataSource', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      name: { accessor: 'name' },
      weight: { accessor: 'weight' },
      symbol: { accessor: 'symbol' },
    };

    await setup({ dataSource, columns });

    expect(screen.queryAllByRole('row')).toHaveLength(7);
    expect(screen.queryAllByRole('columnheader')).toHaveLength(4);
  });

  it('only renders columns as provided in input', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      name: { accessor: 'name' },
    };

    await setup({ dataSource, columns });

    expect(screen.queryAllByRole('columnheader')).toHaveLength(2);
  });

  it('only renders columns provided in displayColumns', async () => {
    const dataSource = new WattTableDataSource(data);
    const displayedColumns = ['position', 'name'];
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      name: { accessor: 'name' },
      weight: { accessor: 'weight' },
      symbol: { accessor: 'symbol' },
    };

    await setup({ dataSource, columns, displayedColumns });

    expect(screen.queryAllByRole('columnheader')).toHaveLength(2);
  });

  it('renders headers with strings provided in columns', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', header: 'Position' },
      name: { accessor: 'name', header: 'Element' },
    };

    await setup({ dataSource, columns });

    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Element')).toBeInTheDocument();
  });

  it('renders headers using the resolveHeader input', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      name: { accessor: 'name' },
      weight: { accessor: 'weight' },
      symbol: { accessor: 'symbol', header: '⚛' },
    };

    const resolveHeader = (key: string) => {
      switch (key) {
        case 'position':
          return 'Position';
        case 'name':
          return 'Navn';
        case 'weight':
          return 'Vægt';
        default:
          throw Error('Test failed');
      }
    };

    await setup({ dataSource, columns, resolveHeader });

    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Navn')).toBeInTheDocument();
    expect(screen.getByText('Vægt')).toBeInTheDocument();
    expect(screen.getByText('⚛')).toBeInTheDocument();
  });

  it('renders cells using callback provided in columns', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', cell: (data) => `Number #${data}` },
    };

    await setup({ dataSource, columns });

    expect(screen.queryAllByText('Number #', { exact: false })).toHaveLength(6);
  });

  it('allows for sorting of column data', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', sort: true },
      weight: { accessor: 'weight', sort: false },
    };

    await setup({
      dataSource,
      columns,
      sortBy: 'position',
      sortDirection: 'asc',
    });

    expect(screen.getByRole('columnheader', { name: 'position' })).toHaveAttribute(
      'aria-sort',
      'ascending'
    );
    expect(screen.getByRole('columnheader', { name: 'weight' })).toHaveAttribute(
      'aria-sort',
      'none'
    );
  });

  it('outputs event when sorting column', async () => {
    const sortChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', sort: true },
      weight: { accessor: 'weight', sort: false },
    };

    await setup({ dataSource, columns, sortChange });

    const position = screen.getByRole('columnheader', { name: 'position' });
    userEvent.click(position);

    expect(sortChange).toHaveBeenCalledWith({
      active: 'position',
      direction: 'asc',
    });
  });

  it('outputs event when clicking on row', async () => {
    const rowClick = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({ dataSource, columns, rowClick });

    const [firstCell] = screen.getAllByRole('gridcell');
    userEvent.click(firstCell);

    expect(rowClick).toHaveBeenCalledWith(data[0]);
  });

  it('selects the active row', async () => {
    const rowClick = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', sort: true },
      weight: { accessor: 'weight', sort: false },
    };

    const result = await setup({ dataSource, columns, rowClick });

    const [, secondRow] = screen.getAllByRole('row');
    userEvent.click(secondRow);

    const [row] = rowClick.mock.lastCall;
    result.change({ activeRow: row });

    expect(screen.getByRole('row', { selected: true })).toEqual(secondRow);
  });

  it('renders checkbox column when selectable is true', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [],
    });

    expect(screen.queryAllByRole('checkbox')).toHaveLength(7);
  });

  it('outputs entire dataset when selecting all rows', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [],
      selectionChange,
    });

    const [firstCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(firstCheckbox);

    expect(selectionChange).toHaveBeenCalledWith(data);
  });

  it('outputs empty array when unselecting all rows', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [],
      selectionChange,
    });

    const [firstCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(firstCheckbox);
    userEvent.click(firstCheckbox);

    expect(selectionChange).toHaveBeenLastCalledWith([]);
  });

  it('outputs data when checking individual rows', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [],
      selectionChange,
    });

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
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [],
      selectionChange,
    });

    const [firstCheckbox, ...checkboxes] = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => userEvent.click(checkbox));

    await waitFor(() => expect(firstCheckbox).toBeChecked());
  });

  it('automatically unchecks the select all checkbox', async () => {
    const selectionChange = jest.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [],
      selectionChange,
    });

    const [firstCheckbox, secondCheckbox] = screen.getAllByRole('checkbox');
    userEvent.click(firstCheckbox);
    userEvent.click(secondCheckbox);

    await waitFor(() => expect(firstCheckbox).not.toBeChecked());
  });

  it('can set initially selected rows', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const [firstRow, secondRow] = data;

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [firstRow, secondRow],
    });

    const [selectAllCheckbox, firstCheckbox, secondCheckbox, ...otherCheckboxes] =
      screen.getAllByRole('checkbox');

    expect(selectAllCheckbox).not.toBeChecked();
    expect(firstCheckbox).toBeChecked();
    expect(secondCheckbox).toBeChecked();

    otherCheckboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it('renders cell content using template', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
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
