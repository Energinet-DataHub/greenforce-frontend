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
import { SelectionModel } from '@angular/cdk/collections';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  TemplateRef,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { map, Subject } from 'rxjs';

import { WattCheckboxComponent } from '../checkbox';
import { IWattTableDataSource, WattTableDataSource } from './watt-table-data-source';
import { WattDatePipe } from '../../utils/date/watt-date.pipe';
import { WattIconComponent } from '../../foundations/icon/icon.component';

export interface WattTableColumn<T> {
  /**
   * The data that this column should be bound to, either as a property of `T`
   * or derived from each row of `T` using an accessor function.  Use `null`
   * for columns that should not be associated with data, but note that this
   * will disable sorting and automatic cell population.
   */
  accessor: keyof T | ((row: T) => unknown) | null;

  /**
   * Resolve the header text to a static display value. This will prevent
   * the `resolveHeader` input function from being called for this column.
   */
  header?: string;

  /**
   * Callback for determining cell content when not using template. By default,
   * cell content is found using the `accessor` (unless it is `null`).
   */
  cell?: (row: T) => string;

  /**
   * Enable or disable sorting for this column. Defaults to `true`
   * unless `accessor` is `null`.
   */
  sort?: boolean;

  /**
   * Set the column size using grid sizing values. Defaults to `"auto"`.
   *
   * @remarks
   * Accepts all of the CSS grid track size keywords (such as `min-content`,
   * `max-content`, `minmax()`) as well as fractional (`fr`), percentage (`%`)
   * and length (`px`, `em`, etc) units.
   *
   * @see https://drafts.csswg.org/css-grid/#track-sizes
   */
  size?: string;

  /**
   * Horizontally align the contents of the column. Defaults to `"left"`.
   */
  align?: 'left' | 'right' | 'center';

  /**
   * Helper icon will be shown in the header cell, with an click event.
   */
  helperAction?: () => void;
}

/**
 * Record for defining columns with keys used as column identifiers.
 */
export type WattTableColumnDef<T> = Record<string, WattTableColumn<T>>;

// Used for strongly typing the structural directive
interface WattTableCellContext<T> {
  $implicit: T;
}

interface WattTableToolbarContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[wattTableCell]',
})
export class WattTableCellDirective<T> {
  /** The WattTableColumn this template applies to. */
  column = input.required<WattTableColumn<T>>({ alias: 'wattTableCell' });
  header = input<string>(undefined, { alias: 'wattTableCellHeader' });
  templateRef = inject(TemplateRef<WattTableCellContext<T>>);
  static ngTemplateContextGuard<T>(
    _directive: WattTableCellDirective<T>,
    context: unknown
  ): context is WattTableCellContext<T> {
    return true;
  }
}

@Directive({
  selector: '[wattTableToolbar]',
})
export class WattTableToolbarDirective<T> {
  templateRef = inject(TemplateRef<WattTableToolbarContext<T[]>>);
  static ngTemplateContextGuard<T>(
    _directive: WattTableToolbarDirective<T>,
    context: unknown
  ): context is WattTableToolbarContext<T[]> {
    return true;
  }
}

/**
 * Usage:
 * `import { WATT_TABLE } from '@energinet-datahub/watt/table';`
 */
@Component({
  imports: [
    NgClass,
    NgTemplateOutlet,
    FormsModule,
    MatSortModule,
    MatTableModule,
    WattCheckboxComponent,
    WattIconComponent,
  ],
  providers: [WattDatePipe],
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-table',
  styleUrls: ['./watt-table.component.scss'],
  templateUrl: './watt-table.component.html',
})
export class WattTableComponent<T> {
  /**
   * The table's source of data. Input should not be changed after
   * initialization, instead update the data on the instance itself.
   */
  dataSource = input.required<IWattTableDataSource<T>>();

  /**
   * Column definition record with keys representing the column identifiers
   * and values being the column configuration. The order of the columns
   * is determined by the property order, but can be overruled by the
   * `displayedColumns` input.
   */
  columns = input<WattTableColumnDef<T>>({});

  /**
   * Used for hiding or reordering columns defined in the `columns` input.
   */
  displayedColumns = input<string[]>();

  /**
   * Used for disabling the table. This will disable all user interaction
   */
  disabled = input(false);

  /**
   * Provide a description of the table for visually impaired users.
   */
  description = input('');

  /**
   * If set to `true`, the table will show a loading indicator
   * when there is no data.
   */
  loading = input(false);

  /**
   * Optional callback for determining header text for columns that
   * do not have a static header text set in the column definition.
   * Useful for providing translations of column headers.
   */
  resolveHeader = input<(key: string) => string>();

  /**
   * Identifier for column that should be sorted initially.
   */
  sortBy = input('');

  /**
   * The sort direction of the initially sorted column.
   */
  sortDirection = input<SortDirection>('');

  /**
   * Whether to allow the user to clear the sort. Defaults to `true`.
   */
  sortClear = input(true);

  /**
   * Whether the table should include a checkbox column for row selection.
   */
  selectable = input(false);

  /**
   * Sets the initially selected rows. Only works when selectable is `true`.
   */
  initialSelection = input<T[]>([]);

  /**
   * Set to true to disable row hover highlight.
   */
  suppressRowHoverHighlight = input(false);

  /**
   * Highlights the currently active row.
   */
  activeRow = input<T>();

  /**
   * Custom comparator function to determine if two rows are equal.
   *
   * @remarks
   * The default behavior for determining the active row is to compare
   * the two row objects using strict equality check. This is sufficient
   * as long as the instances remain the same, which may not be the case
   * if row data is recreated or rebuilt from serialization.
   */
  activeRowComparator = input<(currentRow: T, activeRow: T) => boolean>();

  /**
   * If set to `true`, the column headers will not be shown. Default is `false`.
   */
  hideColumnHeaders = input(false);

  /**
   * Emits whenever the selection updates. Only works when selectable is `true`.
   */
  selectionChange = output<T[]>();

  /** @ignore */
  _rowClick$ = new Subject<T>();

  /**
   * Emits whenever a row is clicked.
   */
  rowClick = outputFromObservable(this._rowClick$);

  /**
   * Event emitted when the user changes the active sort or sort direction.
   */
  sortChange = output<Sort>();

  /** @ignore */
  _cells = contentChildren<WattTableCellDirective<T>>(WattTableCellDirective);

  /** @ignore */
  _toolbar = contentChild<WattTableToolbarDirective<T>>(WattTableToolbarDirective);

  /** @ignore */
  _sort = viewChild.required(MatSort);

  /** @ignore */
  _selectionModel = new SelectionModel<T>(true, []);

  /** @ignore */
  _checkboxColumn = '__checkboxColumn__';

  /** @ignore */
  _element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** @ignore */
  _datePipe = inject(WattDatePipe);

  computedColumns = computed(() => {
    const columns = this.columns();
    const cells = this._cells();
    const resolveHeader = this.resolveHeader();
    return Object.keys(columns).map((key) => {
      const column = columns[key];
      const cell = cells.find((item) => untracked(() => item.column() === column));
      const header = cell?.header() ?? resolveHeader?.(key) ?? key;
      return {
        accessor: column.accessor,
        action: column.helperAction,
        align: column.align,
        cell: column.cell ?? this.getCellData(column),
        header,
        key,
        sort: column.sort,
        template: cell?.templateRef,
      };
    });
  });

  computedDisplayedColumns = computed(() => {
    const columns = this.columns();
    const selectable = this.selectable();
    const displayedColumns = this.displayedColumns();
    if (!columns) return [];
    const columnsOrDisplayedColumns = displayedColumns ?? Object.keys(columns);
    return selectable
      ? [this._checkboxColumn, ...columnsOrDisplayedColumns]
      : columnsOrDisplayedColumns;
  });

  /** @ignore */
  computedIsActiveRow = computed(() => {
    const activeRow = this.activeRow();
    const activeRowComparator = this.activeRowComparator();
    return (row: T) => {
      if (!activeRow) return false;
      return activeRowComparator ? activeRowComparator(row, activeRow) : row === activeRow;
    };
  });

  filteredSelection = computed(() => {
    const dataSource = this.dataSource();
    return this._selectionModel.selected.filter((row) => dataSource.filteredData.includes(row));
  });

  /** @ignore */
  private formatCellData(cell: unknown) {
    if (!cell) return '—';
    if (cell instanceof Date) return this._datePipe.transform(cell);
    return cell;
  }

  /** @ignore */
  private getCellData(column?: WattTableColumn<T>) {
    return (row: T) => {
      if (!column?.accessor) return null;
      const { accessor } = column;
      const cell = typeof accessor === 'function' ? accessor(row) : row[accessor];
      return this.formatCellData(cell);
    };
  }

  constructor() {
    effect(() => {
      this._selectionModel.setSelection(...(this.initialSelection() ?? []));
    });
    this._selectionModel.changed
      .pipe(
        map(() => this._selectionModel.selected),
        takeUntilDestroyed()
      )
      .subscribe((selection) => this.selectionChange.emit(selection));
  }

  sortEffect = effect(() => {
    const dataSource = this.dataSource();
    const sort = this._sort();
    const columns = this.columns();

    if (!dataSource) return;

    dataSource.sort = sort;

    if (dataSource instanceof WattTableDataSource === false) return;

    dataSource.sortingDataAccessor = (row: T, sortHeaderId: string) => {
      const sortColumn = columns[sortHeaderId];
      if (!sortColumn?.accessor) return '';

      // Access raw value for sorting, instead of applying default formatting.
      const { accessor } = sortColumn;
      const cell = typeof accessor === 'function' ? accessor(row) : row[accessor];

      // Make sorting by text case insensitive.
      if (typeof cell === 'string') return cell.toLowerCase();
      if (cell instanceof Date) return cell.getTime();
      return cell as number;
    };
  });

  sizingEffect = effect(() => {
    const columns = this.columns();
    const displayedColumns = this.displayedColumns();
    const selectable = this.selectable();

    if (!columns) return;

    const sizing = Object.keys(columns)
      .filter((key) => !displayedColumns || displayedColumns.includes(key))
      .map((key) => columns[key].size)
      .map((size) => size ?? 'auto');

    if (selectable) {
      // Add space for extra checkbox column
      sizing.unshift('var(--watt-space-xl)');
    }

    this._element.nativeElement.style.setProperty(
      '--watt-table-grid-template-columns',
      sizing.join(' ')
    );
  });

  /**
   * Clears the selection. Only works when selectable is `true`.
   */
  clearSelection() {
    if (this.selectable()) {
      this._selectionModel.clear();
    }
  }

  /** @ignore */
  get _columnSelection() {
    if (this.dataSource().filteredData.length === 0) return false;
    return this.dataSource().filteredData.every((row) => this._selectionModel.isSelected(row));
  }

  /** @ignore */
  set _columnSelection(value) {
    if (value) {
      this._selectionModel.setSelection(...this.dataSource().filteredData);
    } else {
      this.clearSelection();
    }
  }

  /** @ignore */
  _onRowClick(row: T) {
    if (this.disabled() || window.getSelection()?.toString() !== '') return;
    this._rowClick$.next(row);
  }
}

@Component({
  selector: 'watt-table-toolbar-spacer',
  template: '',
  styles: [
    `
      :host {
        width: var(--watt-space-xl);
      }
    `,
  ],
})
export class WattTableToolbarSpacerComponent {}

export const WATT_TABLE = [
  WattTableComponent,
  WattTableCellDirective,
  WattTableToolbarDirective,
  WattTableToolbarSpacerComponent,
];
