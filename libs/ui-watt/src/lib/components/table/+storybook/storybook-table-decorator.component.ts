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
import { AfterViewInit, Component, ContentChild } from '@angular/core';
import { WattCardModule } from '../../card';
import { WattPaginatorComponent } from '../../paginator';
import { WattTableDataSource } from '../watt-table-data-source';
import { WattTableComponent } from '../watt-table.component';

@Component({
  standalone: true,
  imports: [WattCardModule, WattPaginatorComponent],
  selector: 'watt-storybook-table-decorator',
  styles: [
    `
      watt-card {
        display: grid;
        height: calc(100vh - 2rem);
        grid-template-rows: minmax(10rem, auto) min-content;
      }

      watt-paginator {
        margin: calc(-1.5 * var(--watt-space-m));
        margin-top: 0;
      }
    `,
  ],
  template: `
    <watt-card>
      <ng-content></ng-content>
      <watt-paginator
        [pageSize]="10"
        [pageSizeOptions]="[5, 10, 20, 50]"
        [for]="dataSource"
      ></watt-paginator>
    </watt-card>
  `,
})
export class WattStorybookTableDecoratorComponent<T> implements AfterViewInit {
  @ContentChild(WattTableComponent) table!: WattTableComponent<T>;
  dataSource!: WattTableDataSource<T>;

  ngAfterViewInit() {
    this.dataSource = this.table.dataSource as WattTableDataSource<T>;
  }
}
