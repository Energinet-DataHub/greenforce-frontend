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
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { WattResizeObserverDirective } from '../../utils/resize-observer';
import { WattTableDataSource } from './watt-table-data-source';

export interface WattTableCellContext<T> {
  $implicit: T;
  column: string;
}

export type WattTableSizing =
  | `auto`
  | `min-content`
  | `max-content`
  | `${number}fr`
  | `${number}%`
  | `${number}px`
  | `${number}em`
  | `${number}rem`;

@Directive({
  standalone: true,
  selector: '[wattTableCell]',
})
export class WattTableCellDirective<T> {
  @Input()
  wattTableCell!: WattTableComponent<T>;

  @Input('wattTableCellColumn')
  column?: string;

  templateRef = inject(TemplateRef<WattTableCellContext<T>>);

  static ngTemplateContextGuard<T>(
    _directive: WattTableCellDirective<T>,
    context: unknown
  ): context is WattTableCellContext<T> {
    return true;
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, WattResizeObserverDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-table',
  styleUrls: ['./watt-table.component.scss'],
  templateUrl: './watt-table.component.html',
})
export class WattTableComponent<T> implements OnChanges, AfterViewInit {
  private thead: HTMLElement | null = null;
  private tbody: HTMLElement | null = null;

  element: ElementRef<HTMLElement> = inject(ElementRef);

  @ContentChildren(WattTableCellDirective)
  cells = new QueryList<WattTableCellDirective<T>>();

  @Input()
  columns: string[] = [];

  @Input()
  columnSizing: WattTableSizing[] = [];

  @Input()
  dataSource!: WattTableDataSource<T>;

  @Input()
  formatHeader = (id: string) => id;

  private setGridTemplateStyle() {
    const headerCells =
      this.element.nativeElement.querySelectorAll('.watt-header-cell');

    const sizing = this.columns.map((_, i) => this.columnSizing[i] ?? 'auto');
    const computedSizing = !headerCells.length
      ? sizing
      : Array.from(headerCells)
          .map((element) => element.getBoundingClientRect())
          .map((rect) => Math.round(rect.width))
          .map((width, i) => `minmax(min(${width}px, 100%), ${sizing[i]})`);

    this.element.nativeElement.style.setProperty(
      '--watt-table-grid-template-columns',
      computedSizing.join(' ')
    );
  }

  ngAfterViewInit() {
    this.setGridTemplateStyle();
    this.thead = this.element.nativeElement.querySelector('.mat-header-row');
    this.tbody = this.element.nativeElement.querySelector('tbody');

    this.tbody?.addEventListener('scroll', () => {
      if (this.thead && this.tbody) {
        this.thead.style.marginLeft = `-${this.tbody.scrollLeft}px`;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns || changes.columnSizing) {
      this.setGridTemplateStyle();
    }
  }

  getTemplate(column: string) {
    const cell = this.cells.find((item) => item.column === column);
    return cell
      ? cell.templateRef
      : this.cells.find((item) => !item.column)?.templateRef;
  }

  updateStyle() {
    if (this.thead && this.tbody) {
      const { gridTemplateColumns } = window.getComputedStyle(this.tbody);
      this.thead.style.gridTemplateColumns = gridTemplateColumns;
    }
  }
}
