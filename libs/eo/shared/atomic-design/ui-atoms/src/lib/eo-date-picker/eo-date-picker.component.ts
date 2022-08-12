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
  ElementRef,
  NgModule,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EoDatePickerDialogComponent } from './eo-date-picker-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-date-picker',
  styles: [
    `
      eo-date-picker {
        display: block;
      }

      label {
        text-transform: uppercase;
        display: block;
      }

      .dateSelector {
        color: rgba(0, 0, 0, 0.87);
        background-color: white;
        padding: 7px;
        display: inline-flex;
        border: 1px solid #00898a;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;

        mat-icon {
          color: #00898a;
        }
      }
    `,
  ],
  template: `<label class="watt-space-stack-s">Date Range</label>
    <div #selector class="dateSelector" (click)="openDialog()">
      <mat-icon style="margin-right: 16px;">calendar_today</mat-icon>
      <span>1. jan 2021 - 31. dec 2021</span>
      <mat-icon style="margin-left: 8px;">keyboard_arrow_down</mat-icon>
    </div>`,
})
export class EoDatePickerComponent {
  @ViewChild('selector') public elementRef!: ElementRef;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const config = new MatDialogConfig();
    config.data = {
      openerPosition: this.elementRef.nativeElement.getBoundingClientRect(),
    };

    const dialogRef = this.dialog.open(EoDatePickerDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}

@NgModule({
  declarations: [EoDatePickerComponent],
  imports: [MatIconModule, MatDialogModule],
  exports: [EoDatePickerComponent],
})
export class EoDatePickerScam {}
