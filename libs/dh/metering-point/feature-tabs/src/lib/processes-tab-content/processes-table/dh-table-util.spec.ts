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
import {
  compareSortValues,
  getRowToExpand,
  wrapInTableRow,
} from './dh-table-util';

describe(wrapInTableRow.name, () => {
  it('should wrap in table row', () => {
    const data: string[] = ['Test data'];

    const wrappedTableRow = wrapInTableRow<string>(data);

    expect(wrappedTableRow.length).toBe(1);
    expect(wrappedTableRow[0].data).toBe(data[0]);
    expect(wrappedTableRow[0].expanded).toBe(false);
    expect(wrappedTableRow[0].maxHeight).toBe(0);
  });
});

describe(getRowToExpand.name, () => {
  it('should return row to expand', async () => {
    document.body.innerHTML = `
      <div>
        <mat-row>
          <div id='process-row' class='mat-row'>
            <div class='column'></div><div class='column'></div>
          </div>
        </mat-row>
        <mat-row>
          <div id='detail-row' class='mat-row'>
            <div class='column'></div><div class='column'></div>
          </div>
        </mat-row>
      </div>
    `;
    const firstRow = document.getElementById('process-row');
    const firstColumnOfFirstRow = firstRow?.children[0];

    if (firstColumnOfFirstRow === undefined) {
      // This is purely to satisfy the linter complaining about a possible undefined value
      throw new Error('Expected to find table cell element');
    }

    const rowToExpand = getRowToExpand(firstColumnOfFirstRow);

    expect(rowToExpand?.children[0].id).toBe('detail-row');
  });
});

describe(compareSortValues.name, () => {
  it('should return the expected sorting values', async () => {
    const oneIsSmallerThanTwoDesc = compareSortValues(1, 2, false);
    const oneIsSmallerThanTwoAsc = compareSortValues(1, 2, true);
    const oneIsEqualToOne = compareSortValues(1, 1, true);

    const aIsSmallerThanBDesc = compareSortValues('a', 'b', false);
    const aIsSmallerThanBAsc = compareSortValues('a', 'b', true);

    expect(oneIsSmallerThanTwoDesc).toBe(1);
    expect(oneIsSmallerThanTwoAsc).toBe(-1);
    expect(oneIsEqualToOne).toBe(1);

    expect(aIsSmallerThanBDesc).toBe(1);
    expect(aIsSmallerThanBAsc).toBe(-1);
  });
});
