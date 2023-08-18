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

import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Calendar, Month } from '@energinet-datahub/gf/util-calendar';
import { WattButtonComponent } from '../button';

@Component({
  standalone: true,
  imports: [NgFor, WattButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-calendar',
  styles: [
    `
      td,
      th {
        vertical-align: top;
        font-size: 14px;
        padding: var(--watt-space-s);
      }

      .weekNumber {
        min-width: 50px;
        padding-right: 20px;
        text-align: right;
      }

      td:not(.weekNumber) {
        width: 100px;
        height: 100px;
        color: var(--watt-on-light-low-emphasis);
      }

      .isCurrentMonth {
        color: var(--watt-on-light-high-emphasis);
        background-color: var(--watt-color-primary-light);
      }

      .isWeekend {
        background-color: var(--watt-color-neutral-grey-300);
      }

      .isToday {
        background-color: var(--watt-color-secondary);
      }
    `,
  ],
  template: `
    <div style="width: 768px; display: flex; gap: var(--watt-space-m)">
      <watt-button (click)="today()" style="margin-right: auto">Today</watt-button>
      <watt-button (click)="previous()">Previous</watt-button>
      <watt-button (click)="next()">Next</watt-button>
    </div>
    <h3 style="width: 768px; text-align: center;">
      {{ month.startOfMonth.toLocaleString('en-US', { month: 'long' }) }}
      {{ month.startOfMonth.getFullYear() }}
    </h3>
    <table>
      <tr>
        <th></th>
        <th>Monday</th>
        <th>Tuesday</th>
        <th>Wednesday</th>
        <th>Thursday</th>
        <th>Friday</th>
        <th>Saturday</th>
        <th>Sunday</th>
      </tr>
      <tr *ngFor="let week of weeks">
        <td class="weekNumber">{{ week.number }}</td>
        <td
          *ngFor="let day of week.days"
          [class.isToday]="day.isToday"
          [class.isCurrentMonth]="day.isCurrentMonth"
          [class.isWeekend]="day.isWeekend"
        >
          {{ day.date }}
        </td>
      </tr>
    </table>
  `,
})
export class WattCalendarComponent {
  calendar = Calendar.make(new Date());
  month = Calendar.getCurrentMonth(this.calendar);

  get weeks() {
    return Month.toArray(this.month);
  }

  next = () => (this.month = Month.next(this.month));

  previous = () => (this.month = Month.previous(this.month));

  today = () => (this.month = Month.today(this.month));
}
