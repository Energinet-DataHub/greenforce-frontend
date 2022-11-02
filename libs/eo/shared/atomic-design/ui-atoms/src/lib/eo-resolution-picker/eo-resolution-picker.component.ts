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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  NgModule,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  AppSettingsStore,
  Resolution,
} from '@energinet-datahub/eo/shared/services';
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { map } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-resolution-picker',
  styles: [
    `
      :host {
        display: block;
      }

      .title {
        text-transform: uppercase;
        display: block;
      }

      mat-button-toggle-group {
        border-color: var(--watt-color-primary) !important;
      }

      mat-button-toggle {
        border-color: var(--watt-color-primary) !important;
      }

      mat-button-toggle.mat-button-toggle-appearance-standard
        .mat-button-toggle-label-content {
        line-height: unset;
        padding: 10px 14px;
      }

      mat-button-toggle:not(.mat-button-toggle-disabled, .mat-button-toggle-checked) {
        color: var(--watt-color-primary);
      }

      mat-button-toggle.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
        background-color: var(--watt-color-primary);
        color: var(--watt-color-neutral-white);
      }
    `,
  ],
  template: `<label class="watt-space-stack-s title">Resolution</label>
    <mat-button-toggle-group
      [value]="appSettingsResolution$ | async"
      name="resolution"
      *rxLet="differenceIn$ as differenceIn"
    >
      <mat-button-toggle
        [disabled]="!(differenceIn.days <= 7)"
        (change)="setResolution('HOUR')"
        value="HOUR"
        >Per Hour</mat-button-toggle
      >
      <mat-button-toggle (change)="setResolution('DAY')" value="DAY"
        >Day</mat-button-toggle
      >
      <mat-button-toggle
        [disabled]="!(differenceIn.days >= 7)"
        (change)="setResolution('WEEK')"
        value="WEEK"
        >Week</mat-button-toggle
      >
      <mat-button-toggle
        [disabled]="!(differenceIn.months >= 1)"
        (change)="setResolution('MONTH')"
        value="MONTH"
        >Month</mat-button-toggle
      >
      <mat-button-toggle
        [disabled]="!(differenceIn.years >= 1)"
        (change)="setResolution('YEAR')"
        value="YEAR"
        >Year</mat-button-toggle
      >
    </mat-button-toggle-group>`,
})
export class EoResolutionPickerComponent {
  differenceIn$ = this.appSettingsStore.calenderDateRangeDates$.pipe(
    map((dates) => ({
      days: differenceInDays(dates.end, dates.start) ?? 0,
      months: differenceInMonths(dates.end, dates.start) ?? 0,
      years: differenceInYears(dates.end, dates.start) ?? 0,
    }))
  );
  appSettingsResolution$ = this.appSettingsStore.resolution$;

  constructor(private appSettingsStore: AppSettingsStore) {}

  @Output() newResolution = new EventEmitter<Resolution>();

  setResolution(resolution: Resolution) {
    this.appSettingsStore.setResolution(resolution);
    this.newResolution.emit(resolution);
  }
}

@NgModule({
  declarations: [EoResolutionPickerComponent],
  imports: [CommonModule, MatButtonToggleModule, LetModule],
  exports: [EoResolutionPickerComponent],
})
export class EoResolutionPickerScam {}
