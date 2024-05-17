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
import { SelectionModel } from '@angular/cdk/collections';
import { KeyValue, KeyValuePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { QueryList } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';

import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTableDataSource } from './watt-table-data-source';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

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
  standalone: true,
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
  standalone: true,
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
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    KeyValuePipe,
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
export class WattTableComponent<T> implements OnChanges, AfterViewInit {
  /**
   * The table's source of data. Property should not be changed after
   * initialization, instead update the data on the instance itself.
   */
  @Input() dataSource!: WattTableDataSource<T>;

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
  @Input()
  initialSelection: T[] = [];

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
  activeRowComparator?: (currentRow: T, activeRow: T) => boolean;

  /**
   * If set to `true`, the column headers will not be shown. Default is `false`.
   */
  @Input()
  hideColumnHeaders = false;

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

  /** @ignore */
  _selectionModel = new SelectionModel<T>(true, []);

  /** @ignore */
  _checkboxColumn = '__checkboxColumn__';

  /** @ignore */
  _element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** @ignore */
  _datePipe = inject(WattDatePipe);

  /** @ignore */
  private isInitialSelectionSet = false;

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

  constructor() {
    this._selectionModel.changed
      .pipe(
        map(() => this._selectionModel.selected),
        takeUntilDestroyed()
      )
      .subscribe((selection) => this.selectionChange.emit(selection));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this._sort;

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

      const sizing = Object.keys(this.columns)
        .filter((key) => !displayedColumns || displayedColumns.includes(key))
        .map((key) => this.columns[key].size)
        .map((size) => size ?? 'auto');

      if (this.selectable) {
        // Add space for extra checkbox column
        sizing.unshift('var(--watt-space-xl)');
      }

      this._element.nativeElement.style.setProperty(
        '--watt-table-grid-template-columns',
        sizing.join(' ')
      );
    }

    this.onSelectableChanges(changes);
  }

  /** @ignore */
  private onSelectableChanges(changes: SimpleChanges) {
    if (changes['selectable']?.currentValue && !this.isInitialSelectionSet) {
      // Note: The reason for having a flag here is because we want the initial selection
      // to be set only once when `selectable` Input is `true`.
      // Without the flag, the selection will be set every time `selectable` Input is set to `true`.
      // This might lead to losing already selected items.
      this.isInitialSelectionSet = true;

      this._selectionModel.setSelection(...this.initialSelection);
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
    const columns = this.displayedColumns ?? Object.keys(this.columns);
    return this.selectable ? [this._checkboxColumn, ...columns] : columns;
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
    this.rowClick.emit(row);
  }
}

@Component({
  standalone: true,
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
