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
import { KeyValue, KeyValuePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  model,
  OnChanges,
  output,
  Output,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import type { Signal, TrackByFunction } from '@angular/core';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { map, Subject } from 'rxjs';

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
  /** The WattTableColumn this template applies to. */
  @Input('wattTableCell') column!: WattTableColumn<T>;
  @Input('wattTableCellHeader') header?: string;
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
  },
})
export class WattTableComponent<T> implements OnChanges, AfterViewInit {
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
   * Emits whenever the selection updates. Only works when selectable is `true`.
   */
  selectionChange = output<T[]>();

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

  protected cells = contentChildren(WattTableCellDirective<T>);

  /** @ignore */
  @ContentChild(WattTableToolbarDirective)
  _toolbar?: WattTableToolbarDirective<T>;

  /** @ignore */
  @ViewChild(MatSort)
  _sort!: MatSort;

  /** @ignore */
  _tableCellElements = viewChildren<ElementRef<HTMLTableCellElement>>('td');

  /** @ignore */
  _animationEffect = animateExpandableCells(this._tableCellElements, this.expanded);

  /** @ignore */
  _selectionModel = new SelectionModel<T>(true, []);

  /** @ignore */
  _checkboxColumn = '__checkboxColumn__';

  /** @ignore */
  _expandableColumn = '__expandableColumn__';

  /** @ignore */
  _element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** @ignore */
  _datePipe = inject(WattDatePipe);

  /** @ignore */
  _hasFooter = signal(false);

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

  /** @ignore */
  private checkHasFooter(): void {
    this._hasFooter.set(Object.values(this.columns()).some((column) => !!column.footer));
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

  ngAfterViewInit() {
    const dataSource = this.dataSource();
    if (dataSource === undefined) return;

    this.checkHasFooter();
    dataSource.sort = this._sort;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns'] || changes['displayedColumns'] || changes['selectable']) {
      const displayedColumns = this.displayedColumns();
      const sizing = Object.keys(this.columns())
        .filter((key) => !displayedColumns || displayedColumns.includes(key))
        .map((key) => this.columns()[key])
        .filter((column) => !column.expandable)
        .map((column) => column.size ?? 'auto');

      if (this.selectable()) {
        // Add space for extra checkbox column
        sizing.unshift('var(--watt-space-xl)');
      }

      if (this._isExpandable()) {
        // Add space for extra expandable column
        sizing.push('min-content');
      }

      this._element.nativeElement.style.setProperty(
        '--watt-table-grid-template-columns',
        sizing.join(' ')
      );

      this.checkHasFooter();
    }
  }

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

  get _filteredSelection() {
    return this._selectionModel.selected.filter((row) =>
      this.dataSource().filteredData.includes(row)
    );
  }

  /** @ignore */
  _getColumns() {
    const columns = this.displayedColumns() ?? Object.keys(this.columns());
    return [
      ...(this.selectable() ? [this._checkboxColumn] : []),
      ...columns.filter((key) => !this.columns()[key].expandable),
      ...(this._isExpandable() ? [this._expandableColumn] : []),
      ...columns.filter((key) => this.columns()[key].expandable),
    ];
  }

  /** @ignore */
  _getColumnTemplate(column: WattTableColumn<T>) {
    return this.cells().find((item) => item.column === column)?.templateRef;
  }

  /** @ignore */
  _getColumnHeader(column: KeyValue<string, WattTableColumn<T>>) {
    if (typeof column.value.header === 'string') return column.value.header;
    const cell = this.cells().find((item) => item.column === column.value);
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
  _isExpandable() {
    return Object.values(this.columns()).some((column) => column.expandable);
  }

  /** @ignore */
  _onRowClick(row: T) {
    if (this.disabled() || window.getSelection()?.toString() !== '') return;
    if (this._isExpandable()) {
      this.expanded.update((rows) =>
        rows.includes(row) ? rows.filter((r) => r != row) : [...rows, row]
      );
    }

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
