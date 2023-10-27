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
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  MatLegacyPaginator as MatPaginator,
  MatLegacyPaginatorModule as MatPaginatorModule,
} from '@angular/material/legacy-paginator';
import {
  MatLegacyTableDataSource as MatTableDataSource,
  MatLegacyTableModule as MatTableModule,
} from '@angular/material/legacy-table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { EoCertificate } from '@energinet-datahub/eo/certificates/domain';
import { eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificatesStore } from '@energinet-datahub/eo/certificates/data-access-api';

@Component({
  selector: 'eo-certificates-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, MatTableModule, MatSortModule, RouterModule, WattDatePipe],
  standalone: true,
  styles: [
    `
      .link {
        text-decoration: none;
      }
    `,
  ],
  template: `
    <mat-paginator
      [pageSize]="10"
      [pageSizeOptions]="[10, 25, 50, 100, 250]"
      [showFirstLastButtons]="true"
      aria-label="Select page"
    >
      <mat-table matSort [dataSource]="dataSource">
        <!-- Time Column -->
        <ng-container matColumnDef="dateFrom">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Time </mat-header-cell>
          <mat-cell *matCellDef="let element">
            {{ element.dateFrom | wattDate : 'longAbbr' }}-{{ element.dateTo | wattDate : 'time' }}
          </mat-cell>
        </ng-container>

        <!-- GSRN Column -->
        <ng-container matColumnDef="gsrn">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Metering Point </mat-header-cell>
          <mat-cell *matCellDef="let element">{{ element.gsrn }}</mat-cell>
        </ng-container>

        <!-- Quantity Column -->
        <ng-container matColumnDef="quantity">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Amount </mat-header-cell>
          <mat-cell *matCellDef="let element">{{ element.quantity.toLocaleString() }} Wh </mat-cell>
        </ng-container>

        <!-- Action column -->
        <ng-container matColumnDef="action">
          <mat-header-cell *matHeaderCellDef />
          <mat-cell *matCellDef="let element"
            ><h4>
              <a class="link" routerLink="/${eoCertificatesRoutePath}/{{ element.id }}">
                View certificate
              </a>
            </h4>
          </mat-cell>
        </ng-container>

        <!-- No data to show -->
        <ng-container *matNoDataRow>
          You do not have any certificates to show right now.
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns" />
        <mat-row *matRowDef="let row; columns: displayedColumns" />
      </mat-table>
    </mat-paginator>
  `,
})
export class EoCertificatesTableComponent implements AfterViewInit {
  certificates: EoCertificate[] = [];
  dataSource: MatTableDataSource<EoCertificate> = new MatTableDataSource();
  displayedColumns: string[] = ['dateFrom', 'gsrn', 'quantity', 'action'];

  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: EoCertificatesStore) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    // It's really important that data gets loaded after paginator, due to performance
    this.populateCertTable();
  }

  populateCertTable() {
    this.store.certificates$.subscribe((certs) => (this.dataSource.data = certs));
  }
}
