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
import { Component, Inject, NgModule, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { CalendarDateRange } from '@energinet-datahub/eo/shared/services';
import { WattButtonModule } from '@energinet-datahub/watt';

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
        padding: 0 0 0 20px; /* Magix UX number */
      }

      mat-calendar {
        width: 300px; /* Magix UX number */
        margin-bottom: var(--watt-space-l);
      }

      .eo-mat-dialog {
        mat-dialog-container {
          padding: var(--watt-space-m);
          border-radius: 10px 10px 10px 0px; /* Magix UX number */
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
          width: 14px; /* Magix UX number */
          height: 14px; /* Magix UX number */

          .mat-radio-outer-circle {
            height: 14px; /* Magix UX number */
            width: 14px; /* Magix UX number */
          }

          .mat-radio-inner-circle {
            background-color: var(--watt-typography-label-color);
            width: 14px; /* Magix UX number */
            height: 14px; /* Magix UX number */
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
        [(selected)]="visualDateRange"
        (selectedChange)="setDatesFromCalendar($event)"
        [maxDate]="today"
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
  #openerPosition: DOMRect;
  #startDate: Date | null = null;
  #endDate: Date | null = null;
  predefinedValue: DateRange<Date> | null = null;
  visualDateRange: DateRange<Date> | null = null;
  logicalDateRange: CalendarDateRange | null = null;

  today = new Date();
  year2020 = new DateRange(new Date(1577836800000), new Date(this.convertToYesterday(1609459200000)));
  year2021 = new DateRange(new Date(1609459200000), new Date(this.convertToYesterday(1640995200000)));
  year2022 = new DateRange(new Date(1640995200000), new Date(this.convertToYesterday(1672531200000)));
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
    new Date(Date.UTC(this.today.getUTCFullYear(), 0, 1)),
    this.today
  );

  constructor(
    public dialogRef: MatDialogRef<EoDatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public options: { dates: CalendarDateRange; openerPosition: DOMRect }
  ) {
    this.updateVisualDateRange(options.dates.start, options.dates.end);
    this.updateLogicalDateRange(options.dates.start, options.dates.end);

    this.#openerPosition = options.openerPosition;
    dialogRef.updatePosition({
      left: `${this.#openerPosition.left}px`,
      top: `${this.#openerPosition.top - 454}px`,
    });
  }

  updateVisualDateRange(start: number, end: number | undefined | null) {
    this.visualDateRange = new DateRange(
      new Date(start),
      end ? new Date(this.convertToYesterday(end)) : null
    );
  }
  updateLogicalDateRange(start: number, end: number | undefined | null) {
    this.logicalDateRange = start && end ? {start, end} : null;
  }

  setDatesFromPredefined(event: MatRadioChange) {
    if (!event.value) return;
    this.updateVisualDateRange(event.value.start, event.value.end);
    this.updateLogicalDateRange(event.value.start, event.value.end.setUTCHours(24,0,0,0));
  }

  setDatesFromCalendar(date: Date): void {
    this.predefinedValue = null;
    if (!this.#startDate) {
      this.#startDate = date;
    } else if (!this.#endDate && date.getTime() >= this.#startDate.getTime()) {
      this.#endDate = date;
    } else {
      this.#startDate = date;
      this.#endDate = null;
    }
    this.updateVisualDateRange(this.#startDate.getTime(), this.#endDate?.getTime());
    this.updateLogicalDateRange(this.#startDate.getTime(), this.#endDate?.setUTCHours(24,0,0,0));
  }

  closeCancel(): void {
    this.dialogRef.close();
  }

  closeAndSendDatesToApp() {
    this.dialogRef.close(this.logicalDateRange);
  }

  convertToUTC(input : Date | null) {
    if(!input) return
    console.log("Input for UTC convert", input);
    if(input.getTimezoneOffset() < 0)
    {
      console.log("Output UTC convert", input.setUTCHours(24,0,0,0))
    } else {
      console.log("Output UTC convert", input.setUTCHours(0,0,0,0))
    }
    return input.getTimezoneOffset() < 0 ? input.setUTCHours(24,0,0,0) : input.setUTCHours(0,0,0,0);
  }

  convertToYesterday(input : number) {
    return new Date(input).setDate(new Date(input).getDate() - 1)
  }
}

@NgModule({
  declarations: [EoDatePickerDialogComponent],
  providers: [{provide: MAT_DATE_LOCALE, useValue: "UTC"}],
  imports: [MatDatepickerModule, WattButtonModule, MatRadioModule, FormsModule],
  exports: [EoDatePickerDialogComponent],
})
export class EoDatePickerDialogScam {}
