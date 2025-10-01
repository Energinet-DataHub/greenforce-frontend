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
import { KeyValue, KeyValuePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import type { Signal, TrackByFunction } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';

import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WattIconComponent } from '@energinet/watt/icon';
import { IWattTableDataSource, WattTableDataSource } from './watt-table-data-source';
import { animateExpandableCells } from './watt-table-expand-animation';

/** Class name for expandable cells. */
export const EXPANDABLE_CLASS = 'watt-table-cell--expandable';

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

  /**
   * CSS class to apply to the header cell element.
   */
  headerCellClass?: string;

  /**
   * CSS class to apply to the data cell element.
   */
  dataCellClass?: string;

  /**
   * Footer configuration for the column.
   */
  footer?: WattTableColumnFooter;

  /**
   * When set to `true`, the column remains visible when horizontally scrolling.
   */
  stickyEnd?: Signal<boolean>;

  /**
   * When `true`, the cell is replaced with an expandable arrow and the content is deferred.
   * Clicking on the arrow reveals the content below the current row.
   *
   * @remarks
   * It is recommended to provide a custom `trackBy` function when using `expandable`,
   * otherwise animations can be inaccurate when data is changed.
   */
  expandable?: boolean;

  /**
   * Tooltip text to show on hover of the header cell.
   */
  tooltip?: string;
}

/**
 * Configuration for the footer cell of a column.
 */
export interface WattTableColumnFooter {
  /**
   * The value that will be displayed in the footer cell.
   */
  value?: Signal<string | number>;

  /**
   * CSS class to apply to the footer cell.
   */
  class?: string;
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
  templateRef = inject(TemplateRef<WattTableCellContext<T>>);

  /**
   * The WattTableColumn this template applies to.
   */
  column = input.required<WattTableColumn<T>>({ alias: 'wattTableCell' });

  /**
   * Optional header text for the column.
   */
  header = input<string>(undefined, { alias: 'wattTableCellHeader' });

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
    KeyValuePipe,
    FormsModule,
    MatSortModule,
    MatTableModule,
    WattIconComponent,
    WattCheckboxComponent,
  ],
  providers: [WattDatePipe],
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-table',
  styleUrls: ['./watt-table.component.scss'],
  templateUrl: './watt-table.component.html',
  host: {
    '[class.watt-table-variant-zebra]': 'variant() === "zebra"',
    '[style.--watt-table-grid-template-columns]': 'sizing().join(" ")',
  },
})
export class WattTableComponent<T> implements AfterViewInit {
  /**
   * The table's source of data. Property should not be changed after
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
   * If true the footer will be sticky
   */
  stickyFooter = input(false);

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
   * Sets the selected rows. Only applicable when selectable is `true`.
   */
  selection = model<T[]>([]);

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
   * Choose from a predefined set of display variants.
   */
  variant = input<'zebra'>();

  /**
   * Array of rows that are currently expanded.
   */
  expanded = model<T[]>([]);

  /**
   * Optional function for uniquely identifying rows.
   */
  trackBy = input<TrackByFunction<T> | keyof T>();

  /**
   * @ignore
   * The `observed` boolean from the `Subject` is used to determine if a row is
   * clickable or not. This is available on `EventEmitter`, but not on `output`,
   * which is why this workaround is used.
   */
  protected _rowClick$ = new Subject<T>();

  /**
   * Emits whenever a row is clicked.
   */
  rowClick = outputFromObservable(this._rowClick$);

  /**
   * Event emitted when the user changes the active sort or sort direction.
   */
  sortChange = output<Sort>();

  // Queries
  protected cells = contentChildren(WattTableCellDirective<T>);
  protected toolbar = contentChild(WattTableToolbarDirective<T>);
  protected sort = viewChild(MatSort);
  protected tableCellElements = viewChildren<ElementRef<HTMLTableCellElement>>('td');

  /** @ignore */
  _animationEffect = animateExpandableCells(this.tableCellElements, this.expanded);

  // Selectable
  protected filterSelectionBy = (rows: T[]) => rows.filter((row) => this.selection().includes(row));
  protected getSelectionState = () => {
    const filteredData = this.dataSource().filteredData;
    const filteredSelection = this.filterSelectionBy(filteredData);
    if (!filteredSelection.length) return false;
    return filteredSelection.length === this.dataSource().filteredData.length ? true : null;
  };

  /** @ignore */
  _checkboxColumn = '__checkboxColumn__';

  /** @ignore */
  _expandableColumn = '__expandableColumn__';

  /** @ignore */
  _datePipe = inject(WattDatePipe);

  protected hasFooter = computed(() => Object.values(this.columns()).some((c) => c.footer));
  protected isExpandable = computed(() => Object.values(this.columns()).some((c) => c.expandable));
  protected renderedColumns = computed(() => {
    const columns = this.displayedColumns() ?? Object.keys(this.columns());
    return [
      ...(this.selectable() ? [this._checkboxColumn] : []),
      ...columns.filter((key) => !this.columns()[key].expandable),
      ...(this.isExpandable() ? [this._expandableColumn] : []),
      ...columns.filter((key) => this.columns()[key].expandable),
    ];
  });

  protected sizing = computed(() => {
    const columns = this.columns();
    return this.renderedColumns()
      .filter((key) => !columns[key]?.expandable)
      .map((key) => {
        switch (key) {
          case this._checkboxColumn:
            return 'var(--watt-space-xl)';
          case this._expandableColumn:
            return 'min-content';
          default:
            return columns[key]?.size ?? 'auto';
        }
      });
  });

  /** @ignore */
  private formatCellData(cell: unknown) {
    if (!cell) return '—';
    if (cell instanceof Date) return this._datePipe.transform(cell);
    return cell;
  }

  /** @ignore */
  private getCellData(row: T, column?: WattTableColumn<T>) {
    if (!column?.accessor) return null;
    const { accessor } = column;
    const cell = typeof accessor === 'function' ? accessor(row) : row[accessor];
    return this.formatCellData(cell);
  }

  ngAfterViewInit() {
    const dataSource = this.dataSource();
    if (dataSource === undefined) return;

    dataSource.sort = this.sort();
    if (dataSource instanceof WattTableDataSource === false) return;
    dataSource.sortingDataAccessor = (row: T, sortHeaderId: string) => {
      const sortColumn = this.columns()[sortHeaderId];
      if (!sortColumn?.accessor) return '';

      // Access raw value for sorting, instead of applying default formatting.
      const { accessor } = sortColumn;
      const cell = typeof accessor === 'function' ? accessor(row) : row[accessor];

      // Make sorting by text case insensitive.
      if (typeof cell === 'string') return cell.toLowerCase();
      if (cell instanceof Date) return cell.getTime();
      return cell as number;
    };
  }

  /**
   * Clears the selection.
   */
  clearSelection = () => this.selection.set([]);

  /**
   * Toggles the selection of a row.
   */
  toggleSelection = (row: T) =>
    this.selection.update((s) => (s.includes(row) ? s.filter((r) => r !== row) : s.concat(row)));

  /** @ignore */
  _getColumnTemplate(column: WattTableColumn<T>) {
    return this.cells().find((item) => item.column() === column)?.templateRef;
  }

  /** @ignore */
  _getColumnHeader(column: KeyValue<string, WattTableColumn<T>>) {
    if (typeof column.value.header === 'string') return column.value.header;
    const cell = this.cells().find((item) => item.column() === column.value);
    return cell?.header ?? this.resolveHeader()?.(column.key) ?? column.key;
  }

  /** @ignore */
  _getColumnHelperAction(column: KeyValue<string, WattTableColumn<T>>) {
    return column.value.helperAction;
  }

  /** @ignore */
  _getColumnHeaderTooltip(column: KeyValue<string, WattTableColumn<T>>) {
    return column.value.tooltip;
  }

  /** @ignore */
  _getColumnCell(column: KeyValue<string, WattTableColumn<T>>, row: T) {
    return column.value.cell?.(row) ?? this.getCellData(row, column.value);
  }

  /** @ignore */
  _getRowKey = (index: number, row: T) => {
    const trackBy = this.trackBy();
    if (typeof trackBy === 'string') return row[trackBy];
    if (typeof trackBy === 'function') return trackBy(index, row);
    return this.dataSource().data.indexOf(row);
  };

  /** @ignore */
  _isActiveRow(row: T) {
    const activeRow = this.activeRow();
    const activeRowComparator = this.activeRowComparator();
    if (!activeRow) return false;
    return activeRowComparator ? activeRowComparator(row, activeRow) : row === activeRow;
  }

  /** @ignore */
  _onRowClick(row: T) {
    if (this.disabled() || window.getSelection()?.toString() !== '') return;
    if (this.isExpandable()) {
      this.expanded.update((rows) =>
        rows.includes(row) ? rows.filter((r) => r != row) : [...rows, row]
      );
    }

    this._rowClick$.next(row);
  }
}

export const WATT_TABLE = [WattTableComponent, WattTableCellDirective, WattTableToolbarDirective];
