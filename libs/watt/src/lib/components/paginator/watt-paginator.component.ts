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
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
  viewChild,
  input,
  effect,
  output,
  computed,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

import { IWattTableDataSource } from '../table';
import { WattPaginatorIntlService } from './watt-paginator-intl.service';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Usage:
 * `import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';`
 */
@Component({
  standalone: true,
  imports: [MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-paginator',
  styleUrls: ['./watt-paginator.component.scss'],
  template: `
    <mat-paginator
      class="watt-paginator"
      (page)="changed.emit($event)"
      [length]="length()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [pageIndex]="pageIndex()"
      [showFirstLastButtons]="true"
      [attr.aria-label]="description()"
    />
  `,
})
export class WattPaginatorComponent<T> implements OnInit {
  private intl = inject(WattPaginatorIntlService);
  private matPaginatorIntl = inject(MatPaginatorIntl);

  length = input(0);
  pageSizeOptions = input([50, 100, 150, 200, 250]);
  pageSize = input(50);
  pageIndex = input(0);
  for = input<IWattTableDataSource<T>>();
  changed = output<PageEvent>();
  instance = viewChild.required(MatPaginator);

  changes = toSignal(this.intl.changes);
  description = computed(() => {
    this.changes();
    return this.intl.description;
  });

  updateDataSource = effect(() => {
    const dataSource = this.for();
    const instance = this.instance();
    if (!dataSource) return;
    dataSource.paginator = instance;
  });

  updateLabels = effect(() => {
    this.changes();
    this.matPaginatorIntl.itemsPerPageLabel = this.intl.itemsPerPage;
    this.matPaginatorIntl.nextPageLabel = this.intl.nextPage;
    this.matPaginatorIntl.previousPageLabel = this.intl.previousPage;
    this.matPaginatorIntl.firstPageLabel = this.intl.firstPage;
    this.matPaginatorIntl.lastPageLabel = this.intl.lastPage;
    this.matPaginatorIntl.changes.next();
  });

  ngOnInit() {
    //this.matPaginatorIntl.getRangeLabel = this.getRangeLabel;
  }

  private getRangeLabel = (page: number, pageSize: number, length: number) => {
    console.log('getRangeLabel', length, page, this.pageIndex(), this.length());
    if (length == 0 || pageSize == 0) {
      return `0 ${this.intl.of} ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} ${this.intl.of} ${length}`;
  };
}
