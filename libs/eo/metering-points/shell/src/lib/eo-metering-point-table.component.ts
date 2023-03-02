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

import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EoMeteringPoint, EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatTableModule, MatSortModule],
  standalone: true,
  selector: 'eo-metering-points-table',
  styles: [
    `
      :host {
        display: block;
      }

      .tag {
        display: inline-flex;
        background-color: var(--watt-color-primary-light);
        padding: var(--watt-space-xs) var(--watt-space-m);
        text-transform: capitalize;
        border-radius: var(--watt-space-m);
      }

      .link {
        text-decoration: none;
      }
    `,
  ],
  template: `
    <mat-table matSort [dataSource]="dataSource">
      <!-- ID Column -->
      <ng-container matColumnDef="gsrn">
        <mat-header-cell *matHeaderCellDef mat-sort-header>ID</mat-header-cell>
        <mat-cell *matCellDef="let element">{{ element.gsrn }}</mat-cell>
      </ng-container>

      <!-- Address Column -->
      <ng-container matColumnDef="address">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Address </mat-header-cell>
        <mat-cell *matCellDef="let element"
          ><ng-container *ngIf="element.address?.address1">
            {{ element.address.address1 + ',' }}
          </ng-container>
          <ng-container *ngIf="element.address?.address2">
            {{ element.address.address2 + ',' }}
          </ng-container>
          <ng-container *ngIf="element.address?.locality">
            {{ element.address.locality + ',' }}
          </ng-container>
          {{ element?.address?.postalCode }}
          {{ element?.address?.city }}</mat-cell
        >
      </ng-container>

      <!-- Tags column -->
      <ng-container matColumnDef="tags">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Tags</mat-header-cell>
        <mat-cell *matCellDef="let element"
          ><div class="tag">{{ element?.type }}</div>
        </mat-cell>
      </ng-container>

      <!-- GC column -->
      <ng-container matColumnDef="granular certificates">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Granular Certificates</mat-header-cell>
        <mat-cell *matCellDef="let element">
          <ng-container *ngIf="element.type === 'production'">
            <span *ngIf="element.contract">Active</span>
            <ng-container *ngIf="!element.contract">
              <a class="link" (click)="createContract(element.gsrn)"> Enable </a>
            </ng-container>
          </ng-container></mat-cell
        >
      </ng-container>

      <!-- No data to show -->
      <ng-container *matNoDataRow> You do not have any metering points. </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
    </mat-table>
  `,
})
export class EoMeteringPointListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  loadingDone$ = this.store.loadingDone$;
  meteringPoints$ = this.store.meteringPoints$;
  dataSource: MatTableDataSource<EoMeteringPoint> = new MatTableDataSource();
  displayedColumns: Array<string> = ['gsrn', 'address', 'tags', 'granular certificates'];

  constructor(private store: EoMeteringPointsStore) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      const itemHasActiveContract = item.contract ? 'active' : 'enable';

      switch (property) {
        case 'tags':
          return item.type;
        case 'address':
          return item.address.address1.toLowerCase();
        case 'granular certificates':
          return item.type === 'production' ? itemHasActiveContract : '';
        default:
          return item[property as keyof unknown];
      }
    };

    this.store.meteringPoints$.subscribe(
      (meteringPoints) => (this.dataSource.data = meteringPoints)
    );
  }

  createContract(gsrn: string) {
    this.store.createCertificateContract(gsrn);
  }
}
