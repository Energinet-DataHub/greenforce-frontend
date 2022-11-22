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
import {
  AfterViewInit,
  Component,
  ViewChild,
  ContentChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { WattTableComponent } from '../watt-table.component';

@Component({
  standalone: true,
  imports: [MatPaginatorModule],
  selector: 'watt-storybook-table-decorator',
  styles: [
    `
      :host {
        display: grid;
        height: calc(100vh - 2rem);
        grid-template-rows: min-content minmax(10rem, min-content);
      }
    `,
  ],
  template: `
    <mat-paginator
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 20, 50]"
      [showFirstLastButtons]="true"
    ></mat-paginator>
    <ng-content></ng-content>
  `,
})
export class WattStorybookTableDecoratorComponent<T> implements AfterViewInit {
  // Avoid using MatPaginator directly, instead prefer app specific
  // implementations (for now) such as DhSharedUiPaginatorComponent.
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ContentChild(WattTableComponent) table!: WattTableComponent<T>;

  ngAfterViewInit() {
    this.table.dataSource.paginator = this.paginator;
  }
}
