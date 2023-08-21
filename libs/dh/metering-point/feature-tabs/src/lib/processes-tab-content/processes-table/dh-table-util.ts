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
import { DhTableRow } from './dh-table-row';

export function wrapInTableRow<T>(dataRows: T[]): DhTableRow<T>[] {
  return dataRows.map((data) => ({
    data: data,
    expanded: false,
    maxHeight: 0,
  }));
}

export function getRowToExpand(clickedElement: Element): HTMLElement | undefined {
  return (
    // Get the row next to the parent row
    (clickedElement.closest('mat-row')?.nextElementSibling as HTMLElement) ?? undefined
  );
}

export function getRowHeight(rowElement: HTMLElement): number {
  return rowElement.children[0].clientHeight;
}

export function compareSortValues(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
