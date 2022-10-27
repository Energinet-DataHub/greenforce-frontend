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
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EoCertificatesStore } from './eo-certificates.store';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';

@Component({
  selector: 'eo-certificates-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatPaginatorModule, MatTableModule],
  standalone: true,
  styles: [],
  template: `
    <mat-paginator
      #paginator
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [showFirstLastButtons]="true"
      aria-label="Select page"
    ></mat-paginator>
    <mat-table #matTable matSort [dataSource]="dataSource">
      <!-- Time Column -->
      <ng-container matColumnDef="time">
        <mat-header-cell *matHeaderCellDef mat-sort-header
          >Time
        </mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.time }}</mat-cell>
      </ng-container>

      <!-- GSRN Column -->
      <ng-container matColumnDef="gsrn">
        <mat-header-cell *matHeaderCellDef mat-sort-header
          >Metering Point
        </mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.gsrn }}</mat-cell>
      </ng-container>

      <!-- Quantity Column -->
      <ng-container matColumnDef="quantity">
        <mat-header-cell *matHeaderCellDef mat-sort-header
          >Amount
        </mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.quantity }}</mat-cell>
      </ng-container>

      <!-- View certificate Column -->
      <ng-container matColumnDef="action">
        <mat-header-cell *matHeaderCellDef mat-sort-header></mat-header-cell>
        <mat-cell *matCellDef="let element">View certificate</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
    </mat-table>
  `,
})
export class EoCertificatesTableComponent {
  loadingDone$ = this.store.loadingDone$;
  data$ = this.store.certificates$;
  dataSource: MatTableDataSource<{
    time: number;
    gsrn: string;
    quantity: number;
  }> = new MatTableDataSource();
  displayedColumns: string[] = ['time', 'gsrn', 'quantity', 'action'];

  @ViewChild(MatSort) matSort?: MatSort;
  @ViewChild('paginator') paginator?: MatPaginator;

  constructor(private store: EoCertificatesStore) {
    this.data$.subscribe((certs) => {
      this.dataSource.data = certs.map((cert) => ({
        time: cert.dateFrom,
        gsrn: cert.gsrn,
        quantity: cert.quantity,
      }));

      this.dataSource.paginator = <MatPaginator>this.paginator;
    });
  }

  sortData(sort: Sort) {
    if (sort.direction === '') {
      this.setDefaultSorting();
    }
  }

  setDefaultSorting() {
    this.matSort?.sort(this.matSort.sortables.get('position') as MatSortable);
  }
}
