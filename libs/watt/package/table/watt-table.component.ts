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
  afterRenderEffect,
  AfterViewInit,
  Component,
  computed,
  ContentChild,
  ContentChildren,
  Directive,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  linkedSignal,
  model,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import type { QueryList, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';

import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattDatePipe } from '@energinet/watt/core/date';
import { WattIconComponent } from '@energinet/watt/icon';
import { IWattTableDataSource, WattTableDataSource } from './watt-table-data-source';

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
  @Input() dataSource!: IWattTableDataSource<T>;

  /**
   * Column definition record with keys representing the column identifiers
   * and values being the column configuration. The order of the columns
   * is determined by the property order, but can be overruled by the
   * `displayedColumns` input.
   */
  @Input() columns: WattTableColumnDef<T> = {};

  /**
   * Used for hiding or reordering columns defined in the `columns` input.
   */
  @Input() displayedColumns?: string[];

  /**
   * Used for disabling the table. This will disable all user interaction
   */
  @Input() disabled = false;

  /**
   * Provide a description of the table for visually impaired users.
   */
  @Input() description = '';

  /**
   * If set to `true`, the table will show a loading indicator
   * when there is no data.
   */
  @Input() loading = false;

  /**
   * If true the footer will be sticky
   */
  @Input() stickyFooter = false;

  /**
   * Optional callback for determining header text for columns that
   * do not have a static header text set in the column definition.
   * Useful for providing translations of column headers.
   */
  @Input()
  resolveHeader?: (key: string) => string;

  /**
   * Identifier for column that should be sorted initially.
   */
  @Input()
  sortBy = '';

  /**
   * The sort direction of the initially sorted column.
   */
  @Input()
  sortDirection: SortDirection = '';

  /**
   * Whether to allow the user to clear the sort. Defaults to `true`.
   */
  @Input()
  sortClear = true;

  /**
   * Whether the table should include a checkbox column for row selection.
   */
  @Input()
  selectable = false;

  /**
   * Sets the initially selected rows. Only works when selectable is `true`.
   */
  initialSelection = input<T[]>([]);

  /**
   * Set to true to disable row hover highlight.
   */
  @Input()
  suppressRowHoverHighlight = false;

  /**
   * Highlights the currently active row.
   */
  @Input()
  activeRow?: T;

  /**
   * Custom comparator function to determine if two rows are equal.
   *
   * @remarks
   * The default behavior for determining the active row is to compare
   * the two row objects using strict equality check. This is sufficient
   * as long as the instances remain the same, which may not be the case
   * if row data is recreated or rebuilt from serialization.
   */
  @Input()
  // TODO: rename to rowComparator?
  activeRowComparator?: (currentRow: T, activeRow: T) => boolean;

  /**
   * If set to `true`, the column headers will not be shown. Default is `false`.
   */
  @Input()
  hideColumnHeaders = false;

  /**
   * Choose from a predefined set of display variants.
   */
  variant = input<'zebra'>();

  /**
   * Array of rows that are currently expanded.
   */
  expanded = model<T[]>([]);

  /**
   * Emits whenever the selection updates. Only works when selectable is `true`.
   */
  @Output()
  selectionChange = new EventEmitter<T[]>();

  /**
   * Emits whenever a row is clicked.
   */
  @Output()
  rowClick = new EventEmitter<T>();

  /**
   * Event emitted when the user changes the active sort or sort direction.
   */
  @Output()
  sortChange = new EventEmitter<Sort>();

  /** @ignore */
  @ContentChildren(WattTableCellDirective)
  _cells!: QueryList<WattTableCellDirective<T>>;

  /** @ignore */
  @ContentChild(WattTableToolbarDirective)
  _toolbar?: WattTableToolbarDirective<T>;

  /** @ignore */
  @ViewChild(MatSort)
  _sort!: MatSort;

  cells = viewChildren<ElementRef<HTMLTableCellElement>>('td');

  status = computed(() => {
    this.expanded();
    return this.cells()
      .map((cell) => cell.nativeElement)
      .filter((cell) => cell.classList.contains('watt-table-cell--expandable'))
      .map((cell) => cell.offsetHeight);
  });

  test1 = linkedSignal<number[], number[]>({
    source: this.status, // maybe this.animating() source instead
    computation: (_, previous) => {
      return this.cells()
        .map((cell) => cell.nativeElement)
        .filter((cell) => cell.classList.contains('watt-table-cell--expandable'))
        .map((cell) => cell.offsetHeight)
        .map((height, i) => {
          return previous?.source[i] == height ? 0 : height - (previous?.source[i] ?? 0);
        });
    },
  });

  test2 = afterRenderEffect(() => {
    const cells = this.cells();
    console.log(this.test1());
    this.test1().forEach((delta, index) => {
      if (!delta) return;
      const rowIndex = cells[index].nativeElement.dataset.rowIndex;
      cells
        .map((c) => c.nativeElement)
        .filter((c) => c.dataset.rowIndex! > rowIndex!)
        .forEach((c) => {
          c.animate(
            {
              transform: [`translateY(${delta * -1}px)`, 'translateY(0)'],
            },
            {
              duration: 300,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }
          );
        });
    });
  });

  /** @ignore */
  _selectionModel = new SelectionModel<T>(true, []);

  /** @ignore */
  _checkboxColumn = '__checkboxColumn__';

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
    this._hasFooter.set(Object.values(this.columns).some((column) => !!column.footer));
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
    if (this.dataSource === undefined) return;

    this.checkHasFooter();
    this.dataSource.sort = this._sort;
    if (this.dataSource instanceof WattTableDataSource === false) return;
    this.dataSource.sortingDataAccessor = (row: T, sortHeaderId: string) => {
      const sortColumn = this.columns[sortHeaderId];
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
      const { displayedColumns } = this;

      if (this.columns === undefined) return;

      const columns = Object.keys(this.columns)
        .filter((key) => !displayedColumns || displayedColumns.includes(key))
        .map((key) => this.columns[key]);

      const sizing = columns
        .filter((column) => !column.expandable)
        .map((column) => column.size ?? 'auto');

      if (this.selectable) {
        // Add space for extra checkbox column
        sizing.unshift('var(--watt-space-xl)');
      }

      if (columns.some((column) => column.expandable)) {
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
    if (this.selectable) {
      this._selectionModel.clear();
    }
  }

  /** @ignore */
  get _columnSelection() {
    if (this.dataSource.filteredData.length === 0) return false;
    return this.dataSource.filteredData.every((row) => this._selectionModel.isSelected(row));
  }

  /** @ignore */
  set _columnSelection(value) {
    if (value) {
      this._selectionModel.setSelection(...this.dataSource.filteredData);
    } else {
      this.clearSelection();
    }
  }

  get _filteredSelection() {
    return this._selectionModel.selected.filter((row) =>
      this.dataSource.filteredData.includes(row)
    );
  }

  /** @ignore */
  _getColumns() {
    if (this.columns === undefined) return [];

    const columns = this.displayedColumns ?? Object.keys(this.columns);
    const visibleColumns = columns.filter((key) => !this.columns[key].expandable);
    const expandableColumns = columns.filter((key) => this.columns[key].expandable);
    const adjustedColumns =
      expandableColumns.length > 0
        ? [...visibleColumns, '__expandable__', ...expandableColumns]
        : visibleColumns;

    return this.selectable ? [this._checkboxColumn, ...adjustedColumns] : adjustedColumns;
  }

  /** @ignore */
  _getColumnTemplate(column: WattTableColumn<T>) {
    return this._cells.find((item) => item.column === column)?.templateRef;
  }

  /** @ignore */
  _getColumnHeader(column: KeyValue<string, WattTableColumn<T>>) {
    if (typeof column.value.header === 'string') return column.value.header;
    const cell = this._cells.find((item) => item.column === column.value);
    return cell?.header ?? this.resolveHeader?.(column.key) ?? column.key;
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
  _isActiveRow(row: T) {
    if (!this.activeRow) return false;
    return this.activeRowComparator
      ? this.activeRowComparator(row, this.activeRow)
      : row === this.activeRow;
  }

  /** @ignore */
  _onRowClick(row: T) {
    if (this.disabled || window.getSelection()?.toString() !== '') return;

    // TODO: Maybe check for __expanded__ or similar
    this.expanded.update((rows) =>
      rows.includes(row) ? rows.filter((r) => r != row) : [...rows, row]
    );

    this.rowClick.emit(row);
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
