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
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import {
  WattChipsModule,
  WattChipsSelection,
  WattChipsOption,
} from '@energinet-datahub/watt/chips';
import {
  DatePickerData,
  DrawerDatepickerService,
} from './drawer-datepicker.service';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  standalone: true,
  imports: [
    TranslocoModule,
    CommonModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattDatepickerModule,
    WattChipsModule,
    DhFeatureFlagDirectiveModule,
  ],
  selector: 'dh-drawer-datepicker',
  templateUrl: './dh-drawer-datepicker.component.html',
  styleUrls: ['./dh-drawer-datepicker.component.scss'],
})
export class DhDrawerDatepickerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() changed = new EventEmitter();

  private readonly chipOptions: WattChipsOption[] = [
    { label: 'day', value: 'd' },
    { label: 'week', value: 'w' },
    { label: 'month', value: 'm' },
    { label: 'quarter', value: 'q' },
    { label: 'year', value: 'y' },
  ];

  options = this.chipOptions;
  optionSelected: WattChipsSelection = '';
  data: DatePickerData = this.datepickerService.getData();
  startDate = this.data.startDate;
  endDate = this.data.endDate;
  timer: NodeJS.Timeout | undefined;

  formControlDateRange = new FormControl<{ start: string; end: string }>(
    { start: this.startDate, end: this.endDate },
    [WattRangeValidators.required()]
  );

  constructor(
    private translocoService: TranslocoService,
    private datepickerService: DrawerDatepickerService
  ) {}

  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    this.formControlDateRange.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateRange) => {
        this.updateDateRange({
          startDate: dateRange?.start ?? '',
          endDate: dateRange?.end ?? '',
        });
      });
  }

  ngOnInit(): void {
    this.setupDateChipTranslation();

    this.datepickerService.dateRange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateRange) => {
        const value = this.formControlDateRange.value;
        if (dateRange.endDate == null) return;
        if (
          value?.start == dateRange.startDate &&
          value?.end == dateRange.endDate
        )
          return;

        this.formControlDateRange.patchValue(
          {
            start:
              value?.start == dateRange.startDate
                ? value.start
                : dateRange.startDate,
            end:
              value?.end == dateRange.endDate ? value.end : dateRange.endDate,
          },
          {
            emitEvent: false,
          }
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private setupDateChipTranslation() {
    this.translocoService
      .selectTranslateObject('charges.prices.drawer.dateChips')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translationKeys) => {
          this.options = Object.values(
            this.chipOptions.map((option) => {
              return {
                label: translationKeys[option.label],
                value: option.value,
              };
            })
          );
        },
      });
  }

  private updateDateRange(dateRange: DatePickerData) {
    clearTimeout(this.timer);

    this.datepickerService.setData({
      endDate: dateRange?.endDate ?? '',
      startDate: dateRange?.startDate ?? '',
    });

    this.timer = setTimeout(() => {
      if (dateRange?.endDate != '') this.changed.emit(dateRange);
    }, 1000);
  }
}
