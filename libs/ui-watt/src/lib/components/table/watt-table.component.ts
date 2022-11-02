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
  Host,
  Inject,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { WattIcon } from '../../foundations/icon/icons';
import { WattTableDataSource } from './watt-table-data-source';

export interface WattTableCell {
  [key: string]: {
    value: string | number | WattIcon;
  };
}

// columns = [
//   {
//     columnDef: 'position',
//     header: 'No.',
//     cell: (element: PeriodicElement) => `${element.position}`,
//   },
//   {
//     columnDef: 'name',
//     header: 'Name',
//     cell: (element: PeriodicElement) => `${element.name}`,
//   },
//   {
//     columnDef: 'weight',
//     header: 'Weight',
//     cell: (element: PeriodicElement) => `${element.weight}`,
//   },
//   {
//     columnDef: 'symbol',
//     header: 'Symbol',
//     cell: (element: PeriodicElement) => `${element.symbol}`,
//   },
// ];

class Context<T> {
  $implicit!: T;
  subscribe!: T;

  constructor(value: T) {
    this.$implicit = value;
    this.subscribe = value;
  }
}

@Directive({
  standalone: true,
  selector: '[wattTableCell]',
})
export class WattTableCellDirective<T> {
  @Input()
  set wattTableCell(_table: WattTableComponent<T>) {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  @Input('wattTableCellColumn')
  column?: string;

  constructor(
    public templateRef: TemplateRef<Context<T>>,
    private viewContainer: ViewContainerRef
  ) {}

  static ngTemplateContextGuard<T>(
    directive: WattTableCellDirective<T>,
    context: unknown
  ): context is Context<T> {
    return true;
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-table',
  styleUrls: ['./watt-table.component.scss'],
  templateUrl: './watt-table.component.html',
})
export class WattTableComponent<T> {
  @Input()
  columns!: string[];

  @Input()
  dataSource!: WattTableDataSource<T>;

  @ContentChildren(WattTableCellDirective)
  cells = new QueryList<WattTableCellDirective<T>>();

  getTemplate(column: string) {
    //TODO fallback to template without id OR defaultTemplate
    return (
      this.cells.find((item) => item.column === column)?.templateRef ?? null
    );
  }
}
