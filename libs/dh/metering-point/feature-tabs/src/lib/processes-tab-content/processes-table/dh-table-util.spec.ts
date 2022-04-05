import { DhProcessesTableComponent } from './dh-processes-table.component';
import { getRowToExpand, wrapInTableRow } from './dh-table-util';

describe(wrapInTableRow.name, () => {
  it('should wrap in table row', () => {
    const data: string[] = ['Test data'];

    const wrappedTableRow = wrapInTableRow<string>(data);

    expect(wrappedTableRow.length).toBe(1);
    expect(wrappedTableRow[0].data).toBe(data[0]);
  });
});

describe(getRowToExpand.name, () => {
  it('should return row to expand', () => {
    const cell1 = document.createElement('td');
    const cell2 = document.createElement('td');
    const cell3 = document.createElement('td');
    const cell4 = document.createElement('td');

    const processRow = document.createElement('tr');
    processRow.classList.add('mat-row');
    processRow.append(cell1, cell2);

    const detailRow = document.createElement('tr');
    detailRow.classList.add('mat-row');
    detailRow.append(cell3, cell4);

    const tbody = document.createElement('tbody');
    tbody.append(processRow, detailRow);

    const table = document.createElement('table');
    table.append(tbody);

    const rowToExpand = getRowToExpand(cell1);

    expect(rowToExpand).toBe(detailRow);
  });
});
