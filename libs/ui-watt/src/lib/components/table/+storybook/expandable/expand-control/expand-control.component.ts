/* eslint-disable sonarjs/no-duplicate-string */
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
import { ChangeDetectorRef, Component, Input, NgModule, OnInit, Optional, ViewChild } from '@angular/core';
import { MatColumnDef, MatTable, MatTableModule } from '@angular/material/table';
import { WattIconModule } from '@energinet-datahub/watt';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'watt-table-expand-control',
  template: `
  <ng-container matColumnDef="WattTableExpandControl">
    <mat-header-cell *matHeaderCellDef class="control-cell-header"></mat-header-cell>
    <mat-cell *matCellDef="let element" class="control-cell">
      <watt-icon name="right" [ngClass]="{'expanded': element.expanded}"></watt-icon>
    </mat-cell>
  </ng-container>
  `,
  styleUrls: ['expand-control.component.scss']
})
export class WattTableExpandControlComponent implements OnInit {
  @ViewChild(MatColumnDef) comlumDef?: MatColumnDef;

  constructor(@Optional() public table: MatTable<unknown>, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    if (this.table && this.comlumDef) {
      this.table.addColumnDef(this.comlumDef);
    }
  }
}

@NgModule({
  imports: [WattIconModule, MatTableModule, CommonModule],
  declarations: [WattTableExpandControlComponent],
  exports: [WattTableExpandControlComponent],
})
export class WattTableExpandControlScam {}
