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
  Component,
  Inject,
  NgModule,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DateRange,
  MatCalendar,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { CalendarDateRange } from '@energinet-datahub/eo/shared/services';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  selector: 'eo-date-picker-dialog',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .dialog-container {
        display: flex;
      }

      .button-container {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: var(--watt-space-s);
      }

      .predefined-container {
        padding-top: var(--watt-space-s);
        padding-right: var(--watt-space-l);
      }

      .calendar-container {
        border-left: 1px solid var(--watt-color-neutral-grey-400);
        padding: 0 0 0 20px; /* Magic UX number */
      }

      mat-calendar {
        width: 300px; /* Magic UX number */
        margin-bottom: var(--watt-space-l);
      }

      .eo-mat-dialog {
        mat-dialog-container {
          padding: var(--watt-space-m);
          border-radius: 10px 10px 10px 0; /* Magic UX number */
        }
      }

      div.mat-calendar-header {
        padding: 0;

        .mat-calendar-controls {
          margin: 0;
        }
      }

      div.mat-calendar-content {
        padding: 0;

        .mat-calendar-table-header-divider::after {
          left: 0;
          right: 0;
        }
      }

      .mat-calendar-body-in-range::before {
        background-color: var(--watt-color-primary-light);
      }

      .mat-calendar-body-selected {
        background-color: var(--watt-color-primary-dark);
      }

      .mat-calendar-body-today:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical) {
        border-color: var(--watt-color-primary-dark);
      }

      .radio-group {
        display: flex;
        flex-direction: column;
      }

      mat-radio-button {
        line-height: 1rem; /* Magic UX number */
        padding-bottom: var(--watt-space-s);

        .mat-radio-container {
          width: 14px; /* Magic UX number */
          height: 14px; /* Magic UX number */

          .mat-radio-outer-circle {
            height: 14px; /* Magic UX number */
            width: 14px; /* Magic UX number */
          }

          .mat-radio-inner-circle {
            background-color: var(--watt-typography-label-color);
            width: 14px; /* Magic UX number */
            height: 14px; /* Magic UX number */
          }
        }

        .mat-radio-label-content {
          letter-spacing: initial;
          font-weight: 400;
        }
      }
    `,
  ],
  template: `<div class="dialog-container">
    <div class="predefined-container">
      <label class="watt-space-stack-s title">Predefined</label>
      <mat-radio-group
        (change)="setDatesFromPredefined($event)"
        class="radio-group"
        [(ngModel)]="predefinedValue"
      >
        <mat-radio-button [value]="year2022">2022 (this year)</mat-radio-button>
        <mat-radio-button [value]="year2021"
          >2021 (last year)
        </mat-radio-button>
        <mat-radio-button [value]="year2020">2020</mat-radio-button>
        <mat-radio-button [value]="yearToDate">Year to date</mat-radio-button>
        <mat-radio-button [value]="last7days">Last 7 days</mat-radio-button>
        <mat-radio-button [value]="last30Days">Last 30 days</mat-radio-button>
        <mat-radio-button [value]="last90Days">Last 90 days</mat-radio-button>
        <mat-radio-button [value]="null">Custom</mat-radio-button>
      </mat-radio-group>
    </div>
    <div class="calendar-container">
      <mat-calendar
        #calendar
        [(selected)]="dateRange"
        (selectedChange)="setDatesFromCalendar($event)"
        [maxDate]="today"
        [startAt]="dateRange?.start"
      >
      </mat-calendar>
      <div class="button-container">
        <watt-button variant="secondary" (click)="closeCancel()">
          Cancel
        </watt-button>
        <watt-button (click)="closeAndSendDatesToApp()">Update</watt-button>
      </div>
    </div>
  </div>`,
})
export class EoDatePickerDialogComponent {
  @ViewChild('calendar') calendar!: MatCalendar<Date>;

  #startDate: Date | null = null;
  #endDate: Date | null = null;
  predefinedValue: DateRange<Date> | null = null;
  dateRange: DateRange<Date> | null = null;

  today = new Date();
  year2020 = new DateRange(new Date(2020, 0, 1), new Date(2020, 11, 31));
  year2021 = new DateRange(new Date(2021, 0, 1), new Date(2021, 11, 31));
  year2022 = new DateRange(new Date(2022, 0, 1), new Date(2022, 11, 31));
  last7days = new DateRange(
    new Date(new Date().setDate(this.today.getDate() - 6)),
    this.today
  );
  last30Days = new DateRange(
    new Date(new Date().setDate(this.today.getDate() - 29)),
    this.today
  );
  last90Days = new DateRange(
    new Date(new Date().setDate(this.today.getDate() - 89)),
    this.today
  );
  yearToDate = new DateRange(
    new Date(Date.UTC(this.today.getFullYear(), 0, 1)),
    this.today
  );

  constructor(
    public dialogRef: MatDialogRef<EoDatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public options: { dates: CalendarDateRange; openerPosition: DOMRect }
  ) {
    this.dateRange = new DateRange(
      new Date(options.dates.start),
      new Date(this.convertToYesterday(options.dates.end))
    );

    dialogRef.updatePosition({
      left: `${options.openerPosition.left}px`,
      top: `${options.openerPosition.top - 454}px`,
    });
  }

  setDatesFromPredefined(event: MatRadioChange) {
    if (!event.value.start) return;
    this.dateRange = new DateRange(
      this.toUTCDate(event.value.start),
      this.toUTCDate(event.value.end)
    );

    this.calendar._goToDateInView(event.value.start, 'month');
  }

  setDatesFromCalendar(date: Date): void {
    this.predefinedValue = null;
    const UTCDate = this.toUTCDate(date);

    if (!this.#startDate) {
      this.#startDate = UTCDate;
    } else if (
      !this.#endDate &&
      UTCDate.getTime() >= this.#startDate.getTime()
    ) {
      this.#endDate = UTCDate;
    } else {
      this.#startDate = UTCDate;
      this.#endDate = null;
    }

    this.dateRange = new DateRange(this.#startDate, this.#endDate);
  }

  toUTCDate(input: Date) {
    return new Date(
      Date.UTC(input.getFullYear(), input.getMonth(), input.getDate())
    );
  }

  closeCancel(): void {
    this.dialogRef.close();
  }

  closeAndSendDatesToApp() {
    if (!this.dateRange?.start || !this.dateRange?.end) {
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close({
      start: this.dateRange.start.getTime(),
      end: this.convertToTomorrow(this.dateRange.end),
    });
  }

  convertToTomorrow(input: Date) {
    return input.setUTCHours(24, 0, 0, 0);
  }

  convertToYesterday(input: number) {
    return new Date(input).setDate(new Date(input).getDate() - 1);
  }
}

@NgModule({
  declarations: [EoDatePickerDialogComponent],
  imports: [MatDatepickerModule, WattButtonModule, MatRadioModule, FormsModule],
  exports: [EoDatePickerDialogComponent],
})
export class EoDatePickerDialogScam {}
