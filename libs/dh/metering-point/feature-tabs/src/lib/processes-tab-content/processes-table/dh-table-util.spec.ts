import { getRowToExpand, wrapInTableRow } from './dh-table-util';
import { render } from '@testing-library/angular';
import {
  DhProcessesTableComponent,
  DhProcessesTableScam,
} from './dh-processes-table.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';

describe(wrapInTableRow.name, () => {
  it('should wrap in table row', () => {
    const data: string[] = ['Test data'];

    const wrappedTableRow = wrapInTableRow<string>(data);

    expect(wrappedTableRow.length).toBe(1);
    expect(wrappedTableRow[0].data).toBe(data[0]);
  });
});

describe(getRowToExpand.name, () => {
  // const cell1 = document.createElement('td');
  // const cell2 = document.createElement('td');
  // const cell3 = document.createElement('td');
  // const cell4 = document.createElement('td');
  //
  // const processRow = document.createElement('tr');
  // processRow.classList.add('mat-row');
  // processRow.append(cell1, cell2);
  //
  // const detailRow = document.createElement('tr');
  // detailRow.classList.add('mat-row');
  // detailRow.append(cell3, cell4);
  //
  // const tbody = document.createElement('tbody');
  // tbody.append(processRow, detailRow);
  //
  // const table = document.createElement('table');
  // table.append(tbody);
  //
  // async function setup() {
  //   await render(table.innerHTML);
  // }

  it('should return row to expand', async () => {
    customElements.define(
      'mat-row',
      class extends HTMLElement {
        constructor() {
          super();
          const template = document.createElement('template');
          template.innerHTML = `
            <slot></slot>
          `;
          const shadowRoot = this.attachShadow({ mode: 'open' });
          shadowRoot.appendChild(template.content.cloneNode(true));
        }
      }
    );
    // await setup();
    document.body.innerHTML = `
      <table>
        <tbody>
          <mat-row>
            <tr id="process-row" class='mat-row'>
              <td></td><td></td>
            </tr>
          </mat-row>
          <mat-row>
            <tr id="detail-row">
              <td></td><td></td>
            </tr>
          </mat-row>
        </tbody>
      </table>
    `;
    const firstRow = document.getElementById('process-row');
    const firstColumnOfFirstRow = firstRow?.children[0];

    if (firstColumnOfFirstRow === undefined) {
      // This is purely to satisfy the linter complaining about a possible undefined value
      throw new Error('Expected to find table cell element');
    }

    const rowToExpand = getRowToExpand(firstColumnOfFirstRow);

    expect(rowToExpand?.id).toBe('detail-row');
  });
});
