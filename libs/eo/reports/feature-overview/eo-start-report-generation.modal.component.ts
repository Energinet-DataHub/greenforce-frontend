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
import { Component, inject, viewChild } from '@angular/core';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { dayjs } from '@energinet-datahub/watt/date';
import { EoReportRequest, EoReportsService } from '@energinet-datahub/eo/reports/data-access-api';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  WattSegmentedButtonComponent,
  WattSegmentedButtonsComponent,
} from '@energinet-datahub/watt/segmented-buttons';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  today,
  lastWeek,
  lastMonth,
  lastYear,
  weekDropDownOptions,
  getMonthDropDownOptions,
  getYearDropDownOptions,
  firstDayOfLastYear,
  lastDayOfLastYear, startDateCannotBeAfterEndDate,
} from './report-dates.helper';

export type EoReportSegmentType = 'week' | 'month' | 'year' | 'custom';

@Component({
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    WattDatepickerComponent,
    WattFieldErrorComponent,
    WattSegmentedButtonsComponent,
    WattSegmentedButtonComponent,
    WattDropdownComponent,
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

      .segmented-buttons-centered {
        display: flex;
        justify-content: center;
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

        <watt-segmented-buttons class="segmented-buttons-centered" formControlName="segment">
          <watt-segmented-button value="week"
            >{{ translations.reports.overview.modal.segment.week | transloco }}
          </watt-segmented-button>
          <watt-segmented-button value="month"
            >{{ translations.reports.overview.modal.segment.month | transloco }}
          </watt-segmented-button>
          <watt-segmented-button value="year"
            >{{ translations.reports.overview.modal.segment.year | transloco }}
          </watt-segmented-button>
          <watt-segmented-button value="custom"
            >{{ translations.reports.overview.modal.segment.custom | transloco }}
          </watt-segmented-button>
        </watt-segmented-buttons>
        <div class="modal-content-margin">
          @switch (dateForm.get('segment')?.value) {
            @case ('week') {
              <watt-dropdown
                [label]="translations.reports.overview.modal.segment.week | transloco"
                [showResetOption]="false"
                [options]="weeks"
                formControlName="week"
              />
            }
            @case ('month') {
              <watt-dropdown
                [label]="translations.reports.overview.modal.segment.month | transloco"
                [options]="months"
                [showResetOption]="false"
                formControlName="month"
              />
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
export class EoStartReportGenerationModalComponent extends WattTypedModal {
  today = today;
  lastWeekNumber = lastWeek.toString();
  lastMonthName = lastMonth.format('MMMM').toLowerCase();
  lastYearName = lastYear.format('YYYY');

  get startDateControl() {
    return this.dateForm.get('startDate') as FormControl;
  }

  get endDateControl() {
    return this.dateForm.get('endDate') as FormControl;
  }

  private readonly firstDayOfLastYear = firstDayOfLastYear
  private readonly lastDayOfLastYear = dayjs().subtract(1, 'year').endOf('year').toDate();

  dateForm = new FormGroup(
    {
      segment: new FormControl('year' as EoReportSegmentType, [Validators.required]),
      week: new FormControl(this.lastWeekNumber),
      month: new FormControl(this.lastMonthName),
      year: new FormControl(this.lastYearName),
      startDate: new FormControl(this.firstDayOfLastYear, [Validators.required]),
      endDate: new FormControl(this.lastDayOfLastYear, [Validators.required]),
    },
    { validators: startDateCannotBeAfterEndDate() }
  );

  protected translations = translations;

  weeks: WattDropdownOptions = weekDropDownOptions;
  months: WattDropdownOptions = getMonthDropDownOptions();
  years: WattDropdownOptions = getYearDropDownOptions();


  private modal = viewChild.required(WattModalComponent);
  private reportService = inject(EoReportsService);
  private toastService = inject(WattToastService);

  createReport() {
    const startDate = dayjs(this.startDateControl.value);
    const endDate = dayjs(this.endDateControl.value);
    const newReportRequest: EoReportRequest = {
      startDate: startDate.valueOf(),
      endDate: endDate.valueOf(),
    };

    this.reportService.startReportGeneration(newReportRequest).subscribe(() => {
      this.toastService.open({
        type: 'success',
        message: translate('reports.overview.modal.reportStarted'),
      });
      this.modal().close(true);
    });
  }
}
