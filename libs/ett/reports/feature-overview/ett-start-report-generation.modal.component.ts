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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { translate, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/ett/translations';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { dayjs } from '@energinet-datahub/watt/date';
import { EttReportRequest, EttReportsService } from '@energinet-datahub/ett/reports/data-access-api';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  customDateRangeEndDate,
  customDateRangeStartDate,
  getFinancialYearDropDownOptions,
  getFinancialYearRange,
  getMonthDropDownOptions,
  getMonthRange,
  getWeekDropDownOptions,
  getWeekRange,
  getYearDropDownOptions,
  getYearRange,
  lastMonthNameInEnglish,
  lastWeekNumberAsString,
  lastYear,
  lastYearAsString,
  maxDate,
  rangeIsMoreThanAYear,
} from './report-dates.helper';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';

export type EttReportSegmentType = 'week' | 'month' | 'year' | 'financialYear' | 'custom';

export interface EttReportDateRange {
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
    WattDropdownComponent,
    WattRadioComponent,
  ],
  styles: [
    `
      .form-margin {
        margin-top: var(--watt-space-m);
      }

      .modal-content {
        margin-top: var(--watt-space-m);
      }

      .radio-group-centered {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-s);
        margin-top: var(--watt-space-l);
      }

      .flex-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .gap-m {
        gap: var(--watt-space-m);
      }

      .dropdown-wrapper-small {
        width: 33%;
      }

      .year-radio {
        width: 33%;
      }

      .year-explainer-text {
        text-align: end;
        font-style: italic;
        font-weight: lighter;
      }

      .period-wrapper {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;

        watt-datepicker {
          width: 50%;
        }

        span {
          color: var(--watt-color-state-danger);
        }
      }

      .disclaimer-bold {
        font-weight: bold;
      }

      .disclaimer-text-font-weight {
        font-weight: normal;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      size="small"
      [title]="translations.reports.overview.modal.title | transloco"
      closeLabel="Close modal"
    >
      <h6 class="disclaimer-bold">
        {{ translations.reports.overview.modal.disclaimer | transloco }}
      </h6>
      <h6 class="disclaimer-text-font-weight">
        {{ translations.reports.overview.modal.disclaimerText | transloco }}
      </h6>
      <form [formGroup]="dateForm" (ngSubmit)="createReport()" class="form-margin">
        <div class="radio-group-centered">
          <watt-radio group="fav_framework" formControlName="segment" value="week"
            >{{ translations.reports.overview.modal.segment.week | transloco }}
          </watt-radio>
          <watt-radio group="fav_framework" formControlName="segment" value="month"
            >{{ translations.reports.overview.modal.segment.month | transloco }}
          </watt-radio>
          <div class="flex-row">
            <watt-radio
              class="year-radio"
              group="fav_framework"
              formControlName="segment"
              value="year"
              >{{ translations.reports.overview.modal.segment.year | transloco }}
            </watt-radio>
            <span class="year-explainer-text">{{
              translations.reports.overview.modal.segment.yearExplainer | transloco
            }}</span>
          </div>
          <div class="flex-row">
            <watt-radio
              class="year-radio"
              group="fav_framework"
              formControlName="segment"
              value="financialYear"
              >{{ translations.reports.overview.modal.segment.financialYear | transloco }}
            </watt-radio>
            <span class="year-explainer-text">{{
              translations.reports.overview.modal.segment.financialYearExplainer | transloco
            }}</span>
          </div>
          <watt-radio group="fav_framework" formControlName="segment" value="custom"
            >{{ translations.reports.overview.modal.segment.custom | transloco }}
          </watt-radio>
        </div>
        <div class="modal-content">
          @switch (dateForm.get('segment')?.value) {
            @case ('week') {
              <div class="flex-row gap-m">
                <div class="dropdown-wrapper-small">
                  <watt-dropdown
                    [label]="translations.reports.overview.modal.segment.week | transloco"
                    [showResetOption]="false"
                    [options]="weeks"
                    formControlName="week"
                  />
                </div>
                <div class="dropdown-wrapper-small">
                  <watt-dropdown
                    [label]="translations.reports.overview.modal.year | transloco"
                    [showResetOption]="false"
                    [options]="years"
                    formControlName="year"
                  />
                </div>
              </div>
            }
            @case ('month') {
              <div class="flex-row gap-m">
                <div class="dropdown-wrapper-small">
                  <watt-dropdown
                    [label]="translations.reports.overview.modal.segment.month | transloco"
                    [options]="months"
                    [showResetOption]="false"
                    formControlName="month"
                  />
                </div>
                <div class="dropdown-wrapper-small">
                  <watt-dropdown
                    [label]="translations.reports.overview.modal.year | transloco"
                    [showResetOption]="false"
                    [options]="years"
                    formControlName="year"
                  />
                </div>
              </div>
            }
            @case ('year') {
              <div class="dropdown-wrapper-small">
                <watt-dropdown
                  [label]="translations.reports.overview.modal.segment.year | transloco"
                  [options]="years"
                  [showResetOption]="false"
                  formControlName="year"
                />
              </div>
            }
            @case ('financialYear') {
              <div class="dropdown-wrapper-small">
                <watt-dropdown
                  [label]="translations.reports.overview.modal.segment.financialYear | transloco"
                  [options]="financialYears"
                  [showResetOption]="false"
                  formControlName="financialYear"
                />
              </div>
            }
            @case ('custom') {
              <div class="period-wrapper">
                <watt-datepicker
                  formControlName="dateRange"
                  [label]="translations.reports.overview.modal.periodLabel | transloco"
                  [range]="true"
                  [max]="maxDate"
                />
                @if (dateForm.controls.dateRange.errors) {
                  <span>{{
                    translations.reports.overview.modal.exceedAYearError | transloco
                  }}</span>
                }
              </div>
            }
          }
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
export class EttStartReportGenerationModalComponent extends WattTypedModal implements OnInit {
  protected reportService = inject(EttReportsService);
  protected toastService = inject(WattToastService);
  protected translocoService = inject(TranslocoService);

  maxDate = maxDate;
  lastWeekNumberAsString = lastWeekNumberAsString;
  lastMonthNameInEnglish = lastMonthNameInEnglish;
  customDateRangeStartDate = customDateRangeStartDate;
  customDateRangeEndDate = customDateRangeEndDate;
  lastYearName = lastYearAsString;

  dateForm = new FormGroup({
    segment: new FormControl('financialYear' as EttReportSegmentType),
    week: new FormControl(this.lastWeekNumberAsString),
    month: new FormControl(this.lastMonthNameInEnglish),
    year: new FormControl(this.lastYearName),
    financialYear: new FormControl(this.lastYearName),
    dateRange: new FormControl(
      {
        start: this.customDateRangeStartDate,
        end: this.customDateRangeEndDate,
      },
      rangeIsMoreThanAYear()
    ),
  });

  protected translations = translations;

  weeks: WattDropdownOptions = getWeekDropDownOptions(lastYear);
  months: WattDropdownOptions = getMonthDropDownOptions(lastYear, this.translocoService);
  years: WattDropdownOptions = getYearDropDownOptions();
  financialYears: WattDropdownOptions = getFinancialYearDropDownOptions();

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
    const newReportRequest: EttReportRequest = {
      startDate: dayjs(formResult.startDate).utc(true).unix(),
      endDate: dayjs(formResult.endDate).utc(true).unix(),
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

  private getFormResult(): EttReportDateRange {
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
      case 'financialYear': {
        return getFinancialYearRange(year);
      }
      default: {
        return {
          startDate: dayjs(this.dateForm.get('dateRange')?.value?.start).valueOf(),
          endDate: dayjs(this.dateForm.get('dateRange')?.value?.end).valueOf(),
        };
      }
    }
  }
}
