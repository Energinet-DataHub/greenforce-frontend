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
export class WattTableComponent<T> implements OnChanges {
  element = inject(ElementRef);

  @ContentChildren(WattTableCellDirective)
  cells = new QueryList<WattTableCellDirective<T>>();

  @Input()
  columns!: string[];

  @Input()
  dataSource!: WattTableDataSource<T>;

  @Input()
  formatHeader = (id: string) => id;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      this.element.nativeElement.style.setProperty(
        '--columns',
        this.columns.length
      );
    }
  }

  getTemplate(column: string) {
    const cell = this.cells.find((item) => item.column === column);
    return cell
      ? cell.templateRef
      : this.cells.find((item) => !item.column)?.templateRef;
  }

  updateStyle() {
    const tbody = this.element.nativeElement.querySelector('tbody');
    const thead = this.element.nativeElement.querySelector('.mat-header-row');

    thead.style.gridTemplateColumns =
      window.getComputedStyle(tbody).gridTemplateColumns;
  }
}
