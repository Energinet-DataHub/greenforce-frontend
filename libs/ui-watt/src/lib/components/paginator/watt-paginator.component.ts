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
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  MatLegacyPaginator as MatPaginator,
  MatLegacyPaginatorIntl as MatPaginatorIntl,
  MatLegacyPaginatorModule as MatPaginatorModule,
  LegacyPageEvent as PageEvent,
} from '@angular/material/legacy-paginator';
import { Subscription } from 'rxjs';
import { WattPaginatorIntlService } from './watt-paginator-intl.service';

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
      [length]="length"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      [showFirstLastButtons]="true"
      [attr.aria-label]="description"
    ></mat-paginator>
  `,
})
export class WattPaginatorComponent implements OnInit, OnDestroy {
  @Input() length = 0;
  @Input() pageSizeOptions = [50, 100, 150, 200, 250];
  @Input() pageSize = 50;

  @Output() changed = new EventEmitter<PageEvent>();

  @ViewChild(MatPaginator, { static: true }) instance!: MatPaginator;

  description?: string;

  private intl = inject(WattPaginatorIntlService);
  private matPaginatorIntl = inject(MatPaginatorIntl);
  private subscription?: Subscription;

  ngOnInit() {
    this.matPaginatorIntl.getRangeLabel = this.getRangeLabel;
    this.subscription = this.intl.changes.subscribe(this.updateLabels);
    this.updateLabels();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private updateLabels = () => {
    this.description = this.intl.description;
    this.matPaginatorIntl.itemsPerPageLabel = this.intl.itemsPerPage;
    this.matPaginatorIntl.nextPageLabel = this.intl.nextPage;
    this.matPaginatorIntl.previousPageLabel = this.intl.previousPage;
    this.matPaginatorIntl.firstPageLabel = this.intl.firstPage;
    this.matPaginatorIntl.lastPageLabel = this.intl.lastPage;
    this.matPaginatorIntl.changes.next();
  };

  private getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 ${this.intl.of} ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} ${this.intl.of} ${length}`;
  };
}
