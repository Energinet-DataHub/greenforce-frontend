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
import { Sort } from '@angular/material/sort';
import { render, screen, waitFor, fireEvent } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattTableDataSource } from './watt-table-data-source';
import { WattTableColumnDef, WattTableComponent, WATT_TABLE } from './watt-table.component';
import { InputSignal } from '@angular/core';

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

describe(WattTableComponent, () => {
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

    expect(screen.getByRole('columnheader', { name: 'position' }).children[0]).toHaveAttribute(
      'aria-sort',
      'ascending'
    );
    expect(screen.getByRole('columnheader', { name: 'weight' }).children[0]).toHaveAttribute(
      'aria-sort',
      'none'
    );
  });

  it('outputs event when sorting column', async () => {
    const sortChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', sort: true },
      weight: { accessor: 'weight', sort: false },
    };

    await setup({ dataSource, columns, sortChange });

    const position = screen.getByRole('columnheader', { name: 'position' });
    await userEvent.click(position.children[0]);

    expect(sortChange).toHaveBeenCalledWith({
      active: 'position',
      direction: 'asc',
    });
  });

  it('outputs event when clicking on row', async () => {
    const rowClick = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({ dataSource, columns, rowClick });

    const [firstCell] = screen.getAllByRole('gridcell');
    await userEvent.click(firstCell);

    expect(rowClick).toHaveBeenCalledWith(data[0]);
  });

  it('selects the active row', async () => {
    const rowClick = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position', sort: true },
      weight: { accessor: 'weight', sort: false },
    };

    const result = await setup({ dataSource, columns, rowClick });

    const [, secondRow] = result.getAllByRole('row');
    await userEvent.click(secondRow);

    const [row] = rowClick.mock.lastCall;
    result.rerender({ componentProperties: { dataSource, columns, rowClick, activeRow: row } });

    expect(result.getByRole('row', { selected: true })).toEqual(secondRow);
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
      initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
    });

    expect(screen.queryAllByRole('checkbox')).toHaveLength(7);
  });

  it('outputs entire dataset when selecting all rows', async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const { fixture } = await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
      selectionChange,
    });

    await fixture.whenStable();

    // Get the component instance and directly interact with it
    const tableComponent = fixture.debugElement.children[0].componentInstance as WattTableComponent<PeriodicElement>;

    // Directly select all items
    tableComponent._columnSelection = true;

    // Force change detection
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selectionChange).toHaveBeenCalledWith(data);
  });

  it('outputs empty array when unselecting all rows', async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const { fixture } = await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
      selectionChange,
    });

    await fixture.whenStable();

    const tableComponent = fixture.debugElement.children[0].componentInstance as WattTableComponent<PeriodicElement>;

    // Select all
    tableComponent._columnSelection = true;
    fixture.detectChanges();
    await fixture.whenStable();

    // Deselect all
    tableComponent._columnSelection = false;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selectionChange).toHaveBeenLastCalledWith([]);
  });

  it('outputs data when checking individual rows', async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const { fixture } = await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
      selectionChange,
    });

    await fixture.whenStable();

    const tableComponent = fixture.debugElement.children[0].componentInstance as WattTableComponent<PeriodicElement>;

    // Select first row
    tableComponent._selectionModel.select(data[0]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selectionChange).toHaveBeenNthCalledWith(1, [data[0]]);

    // Select second row
    tableComponent._selectionModel.select(data[1]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(selectionChange).toHaveBeenNthCalledWith(2, [data[0], data[1]]);
  });

  it('automatically checks the select all checkbox', async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const { fixture } = await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
      selectionChange,
    });

    await fixture.whenStable();

    const tableComponent = fixture.debugElement.children[0].componentInstance as WattTableComponent<PeriodicElement>;

    // Select all rows individually
    for (const row of data) {
      tableComponent._selectionModel.select(row);
    }

    fixture.detectChanges();
    await fixture.whenStable();

    const [firstCheckbox] = screen.getAllByRole('checkbox');
    await waitFor(() => expect(firstCheckbox).toBeChecked());
  });

  it('automatically unchecks the select all checkbox', async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
      selectionChange,
    });

    const [firstCheckbox, secondCheckbox] = screen.getAllByRole('checkbox');
    fireEvent.click(firstCheckbox);
    fireEvent.click(secondCheckbox);

    await waitFor(() => expect(firstCheckbox).not.toBeChecked());
  });

  it('can set initially selected rows', async () => {
    const selectionChange = vi.fn();
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
      initialSelection: [firstRow, secondRow] as any,
      selectionChange,
    });

    const [selectAllCheckbox, firstCheckbox, secondCheckbox, ...otherCheckboxes] =
      screen.getAllByRole('checkbox');

    await waitFor(() => expect(selectAllCheckbox).not.toBeChecked());
    await waitFor(() => expect(firstCheckbox).toBeChecked());
    await waitFor(() => expect(secondCheckbox).toBeChecked());

    await waitFor(() => otherCheckboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked()));
  });

  it("does NOT reset initial selection when 'selectable' Input is toggled", async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const [firstRow, secondRow] = data;

    const initialSelection = [firstRow, secondRow] as any;

    const result = await setup({
      dataSource,
      columns,
      selectable: true,
      initialSelection,
      selectionChange,
    });

    let [, firstCheckbox] = screen.getAllByRole('checkbox');

    await waitFor(() => expect(firstCheckbox).toBeChecked());
    await userEvent.click(firstCheckbox);

    result.rerender({
      componentProperties: {
        dataSource,
        columns,
        initialSelection,
        selectionChange,
        selectable: false,
      },
    });
    result.rerender({
      componentProperties: {
        dataSource,
        columns,
        initialSelection,
        selectionChange,
        selectable: true,
      },
    });

    [, firstCheckbox] = screen.getAllByRole('checkbox');

    await waitFor(() => expect(firstCheckbox).not.toBeChecked());
  });

  it('renders cell content using template', async () => {
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    await setup(
      { dataSource, columns },
      `<ng-container *wattTableCell="columns.position; let element">
         <span>Numero {{ element.position }}</span>
       </ng-container>`
    );

    expect(screen.getByText('Numero 1')).toBeInTheDocument();
  });

  it('shows toolbar when selecting rows', async () => {
    const selectionChange = vi.fn();
    const dataSource = new WattTableDataSource(data);
    const columns: WattTableColumnDef<PeriodicElement> = {
      position: { accessor: 'position' },
      weight: { accessor: 'weight' },
    };

    const { fixture } = await setup(
      {
        dataSource,
        columns,
        selectable: true,
        selectionChange,
        initialSelection: [] as unknown as InputSignal<PeriodicElement[]>,
      },
      `<ng-container *wattTableToolbar="let selection">{{ selection.length }}</ng-container>`
    );

    await fixture.whenStable();

    const tableComponent = fixture.debugElement.children[0].componentInstance as WattTableComponent<PeriodicElement>;

    // Select all rows directly via selection model
    tableComponent._selectionModel.select(...data);
    fixture.detectChanges();
    await fixture.whenStable();

    // Wait a bit for toolbar to update
    await waitFor(() => {
      expect(screen.queryByRole('toolbar')).toHaveTextContent('6');
    });
  });
});
