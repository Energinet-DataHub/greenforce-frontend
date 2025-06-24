//#region License
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
//#endregion
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { translate, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { dayjs } from '@energinet-datahub/watt/date';
import { EoReportRequest, EoReportsService } from '@energinet-datahub/eo/reports/data-access-api';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  firstDayOfLastYear,
  getMonthDropDownOptions,
  getMonthRange,
  getWeekDropDownOptions,
  getWeekRange,
  getYearDropDownOptions,
  getYearRange,
  lastMonthNameInEnglish,
  lastWeekNumberAsString, lastYear,
  lastYearAsString,
  startDateCannotBeAfterEndDate,
  today,
} from './report-dates.helper';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

export type EoReportSegmentType = 'week' | 'month' | 'year' | 'custom';

export interface EoReportDateRange {
  startDate: number;
  endDate: number;
}

@Component({
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    WattDatepickerComponent,
    WattFieldErrorComponent,
    WattDropdownComponent,
    WattRadioComponent,
    VaterFlexComponent,
  ],
  styles: [
    `
      .form-margin {
        margin-top: var(--watt-space-m);
      }

      .modal-content-margin {
        margin-top: var(--watt-space-m);
      }

      .disclaimer {
        margin-top: var(--watt-space-m);
        margin-bottom: var(--watt-space-m);
        font-weight: normal;
      }

      .custom-date-range-container {
        display: flex;
        gap: var(--watt-space-m);
      }

      .radio-group-centered {
        display: flex;
        justify-content: space-evenly;
        margin-top: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      [title]="translations.reports.overview.modal.title | transloco"
      closeLabel="Close modal"
    >
      <form [formGroup]="dateForm" (ngSubmit)="createReport()" class="form-margin">
        <div class="radio-group-centered">
          <watt-radio group="fav_framework" formControlName="segment" value="week"
            >{{ translations.reports.overview.modal.segment.week | transloco }}
          </watt-radio>
          <watt-radio group="fav_framework" formControlName="segment" value="month"
            >{{ translations.reports.overview.modal.segment.month | transloco }}
          </watt-radio>
          <watt-radio group="fav_framework" formControlName="segment" value="year"
            >{{ translations.reports.overview.modal.segment.year | transloco }}
          </watt-radio>
          <watt-radio group="fav_framework" formControlName="segment" value="custom"
            >{{ translations.reports.overview.modal.segment.custom | transloco }}
          </watt-radio>
        </div>
        <div class="modal-content-margin">
          @switch (dateForm.get('segment')?.value) {
            @case ('week') {
              <vater-flex direction="row" gap="l">
                <watt-dropdown
                  [label]="translations.reports.overview.modal.segment.week | transloco"
                  [showResetOption]="false"
                  [options]="weeks"
                  formControlName="week"
                />
                <watt-dropdown
                  [label]="translations.reports.overview.modal.segment.year | transloco"
                  [showResetOption]="false"
                  [options]="years"
                  formControlName="year"
                />
              </vater-flex>
            }
            @case ('month') {
              <vater-flex direction="row" gap="l">
                <watt-dropdown
                  [label]="translations.reports.overview.modal.segment.month | transloco"
                  [options]="months"
                  [showResetOption]="false"
                  formControlName="month"
                />
                <watt-dropdown
                  [label]="translations.reports.overview.modal.segment.year | transloco"
                  [showResetOption]="false"
                  [options]="years"
                  formControlName="year"
                />
              </vater-flex>
            }
            @case ('year') {
              <watt-dropdown
                [label]="translations.reports.overview.modal.segment.year | transloco"
                [options]="years"
                [showResetOption]="false"
                formControlName="year"
              />
            }
            @case ('custom') {
              <div class="custom-date-range-container">
                <watt-datepicker
                  formControlName="startDate"
                  [max]="today"
                  label="{{ translations.reports.overview.modal.startDateLabel | transloco }}"
                />
                <watt-datepicker
                  formControlName="endDate"
                  [max]="today"
                  label="{{ translations.reports.overview.modal.endDateLabel | transloco }}"
                />
              </div>
              @if (dateForm.errors?.['dateRange']) {
                <watt-field-error
                  >{{
                    translations.reports.overview.modal.startDateAfterEndDateErrorMessage
                      | transloco
                  }}
                </watt-field-error>
              }
            }
          }
          <h6 class="disclaimer">
            {{ translations.reports.overview.modal.disclaimer | transloco }}
          </h6>
        </div>
      </form>
      <watt-modal-actions>
        <watt-button type="button" variant="secondary" (click)="modal.close(false)">
          {{ translations.reports.overview.modal.cancel | transloco }}
        </watt-button>
        <watt-button type="submit" [disabled]="dateForm.invalid" (click)="createReport()">
          {{ translations.reports.overview.modal.start | transloco }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoStartReportGenerationModalComponent extends WattTypedModal implements OnInit {
  protected reportService = inject(EoReportsService);
  protected toastService = inject(WattToastService);
  protected translocoService = inject(TranslocoService);

  today = today;
  lastWeekNumberAsString = lastWeekNumberAsString;
  lastMonthNameInEnglish = lastMonthNameInEnglish;
  lastYearName = lastYearAsString;

  get startDateControl() {
    return this.dateForm.get('startDate') as FormControl;
  }

  get endDateControl() {
    return this.dateForm.get('endDate') as FormControl;
  }

  private readonly firstDayOfLastYear = firstDayOfLastYear;
  private readonly lastDayOfLastYear = dayjs().subtract(1, 'year').endOf('year').toDate();

  dateForm = new FormGroup(
    {
      segment: new FormControl('year' as EoReportSegmentType, [Validators.required]),
      week: new FormControl(this.lastWeekNumberAsString),
      month: new FormControl(this.lastMonthNameInEnglish),
      year: new FormControl(this.lastYearName),
      startDate: new FormControl(this.firstDayOfLastYear, [Validators.required]),
      endDate: new FormControl(this.lastDayOfLastYear, [Validators.required]),
    },
    { validators: startDateCannotBeAfterEndDate() }
  );

  protected translations = translations;

  weeks: WattDropdownOptions = getWeekDropDownOptions(lastYear);
  months: WattDropdownOptions = getMonthDropDownOptions(lastYear, this.translocoService);
  years: WattDropdownOptions = getYearDropDownOptions();

  private modal = viewChild.required(WattModalComponent);

  ngOnInit(): void {
    this.dateForm.get('year')?.valueChanges.subscribe((yearAsString) => {
      const year = Number(yearAsString);
      this.setWeekOptions(year);
      this.setMonthOptions(year);
    });
  }

  createReport() {
    const formResult = this.getFormResult();
    const newReportRequest: EoReportRequest = {
      startDate: formResult.startDate,
      endDate: formResult.endDate,
    };

    this.reportService.startReportGeneration(newReportRequest).subscribe(() => {
      this.toastService.open({
        type: 'success',
        message: translate('reports.overview.modal.reportStarted'),
      });
      this.modal().close(true);
    });
  }

  setWeekOptions(year: number) {
    this.weeks = getWeekDropDownOptions(year);
    const weekValue = this.dateForm.get('week')?.value;
    const valueDoesNotExistInOptions = !this.weeks.some((option) => option.value === weekValue);
    if (valueDoesNotExistInOptions) {
      this.dateForm.get('week')?.setValue(this.weeks.at(-1)?.value ?? null);
    }
  }

  setMonthOptions(year: number) {
    this.months = getMonthDropDownOptions(year, this.translocoService);
    const monthValue = this.dateForm.get('month')?.value;
    const valueDoesNotExistInOptions = !this.months.some((option) => option.value === monthValue);
    if (valueDoesNotExistInOptions) {
      this.dateForm.get('month')?.setValue(this.months.at(-1)?.value ?? null);
    }
  }

  private getFormResult(): EoReportDateRange {
    const week = this.dateForm.get('week')?.value ?? '';
    const month = this.dateForm.get('month')?.value ?? '';
    const year = this.dateForm.get('year')?.value ?? '';

    switch (this.dateForm.get('segment')?.value) {
      case 'week': {
        return getWeekRange(week, year);
      }
      case 'month': {
        return getMonthRange(month, year);
      }
      case 'year': {
        return getYearRange(year);
      }
      default: {
        return {
          startDate: this.startDateControl.value.valueOf(),
          endDate: this.endDateControl.value.valueOf(),
        };
      }
    }
  }
}
