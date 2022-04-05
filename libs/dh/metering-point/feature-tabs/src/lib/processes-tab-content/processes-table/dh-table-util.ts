import { DhTableRow } from './dh-table-row';

export function wrapInTableRow<T>(dataRows: T[]): DhTableRow<T>[] {
  return dataRows.map((data) => ({
    data: data,
    expanded: false,
    maxHeight: 0,
  }));
}

export function getRowToExpand(
  clickedElement: Element
): HTMLElement | undefined {
  return (
    // Get the row next to the parent row
    (clickedElement.closest('mat-row')?.nextElementSibling as HTMLElement) ??
    undefined
  );
}

export function getRowHeight(rowElement: HTMLElement): number {
  return rowElement.children[0].clientHeight;
}

export function compareSortValues(
  a: number | string,
  b: number | string,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
