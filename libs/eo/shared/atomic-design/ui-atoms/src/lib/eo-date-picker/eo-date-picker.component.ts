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
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CalendarDateRange } from '@energinet-datahub/eo/shared/services';
import { EoDatePickerDialogComponent } from './eo-date-picker-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule, MatDialogModule, DatePipe],
  selector: 'eo-date-picker',
  styles: [
    `
      mat-dialog-container {
        padding: 0;
      }

      eo-date-picker {
        display: block;
      }

      .title {
        text-transform: uppercase;
        display: block;
      }

      .dateSelector {
        color: rgba(0, 0, 0, 0.87);
        background-color: var(--watt-color-neutral-white);
        padding: 9px; /* Magic UX number */
        display: inline-flex;
        border: 1px solid var(--watt-color-primary);
        border-radius: var(--watt-space-xs);
        cursor: pointer;
        user-select: none;

        span {
          margin: 0 14px; /* Magic UX number */
        }

        mat-icon {
          color: var(--watt-color-primary);
        }
      }
    `,
  ],
  template: `<label class="watt-space-stack-s title">Date Range</label>
    <div #selector class="dateSelector" (click)="openDialog()">
      <mat-icon>calendar_today</mat-icon>
      <span>
        {{ datesShown.start | date: 'd. MMM y':'UTC' }} -
        {{ datesShown.end | date: 'd. MMM y':'UTC' }}</span
      >
      <mat-icon>keyboard_arrow_down</mat-icon>
    </div> `,
})
export class EoDatePickerComponent implements OnInit {
  datesShown: CalendarDateRange;

  @ViewChild('selector') public elementRef!: ElementRef;

  @Input() dateRangeInput: CalendarDateRange = {
    start: 1609459200,
    end: 1640995200,
  };

  @Output() newDates = new EventEmitter<CalendarDateRange>();

  constructor(public dialog: MatDialog) {
    this.datesShown = this.dateRangeInput;
  }

  ngOnInit() {
    this.datesShown = {
      start: this.dateRangeInput.start,
      end: this.convertToYesterday(this.dateRangeInput.end),
    };
  }

  openDialog(): void {
    const config = new MatDialogConfig();
    config.data = {
      dates: this.dateRangeInput,
      openerPosition: this.elementRef.nativeElement.getBoundingClientRect(),
    };
    config.panelClass = 'eo-mat-dialog';

    const dialogRef = this.dialog.open(EoDatePickerDialogComponent, config);

    dialogRef.afterClosed().subscribe((result: CalendarDateRange) => {
      if (result?.start && result?.end) {
        this.datesShown = {
          start: result.start,
          end: this.convertToYesterday(result.end),
        };
        this.newDates.emit(result);
      }
    });
  }

  convertToYesterday(dateInput: number) {
    return new Date(dateInput).setDate(new Date(dateInput).getDate() - 1);
  }
}
