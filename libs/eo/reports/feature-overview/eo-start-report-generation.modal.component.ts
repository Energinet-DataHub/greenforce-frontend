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
import { WattButtonComponent } from '@energinet/watt/button';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { WattDatepickerComponent } from '@energinet/watt/picker/datepicker';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  EoReportRequestModel,
  EoReportsService,
} from '@energinet-datahub/eo/reports/data-access-api';
import { WattFieldErrorComponent } from '@energinet/watt/field';

@Component({
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    WattDatepickerComponent,
    WattFieldErrorComponent,
  ],
  styles: [
    `
      .modal-content-margin {
        margin-top: var(--watt-space-m);
      }

      .disclaimer {
        margin-bottom: var(--watt-space-m);
        font-weight: normal;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      [title]="translations.reports.overview.modal.title | transloco"
      closeLabel="Close modal"
    >
      <form [formGroup]="dateForm" (ngSubmit)="createReport()">
        <div class="modal-content-margin">
          <h6 class="disclaimer">{{ translations.reports.overview.modal.disclaimer | transloco }}</h6>
          <watt-datepicker
            formControlName="startDate"
            [max]="today"
            label="{{ translations.reports.overview.modal.startDateLabel | transloco }}"
          />
          @if (dateForm.errors?.['dateRange']) {
            <watt-field-error>{{ translations.reports.overview.modal.startDateAfterEndDateErrorMessage | transloco }}</watt-field-error>
          }
          <watt-datepicker
            formControlName="endDate"
            [max]="today"
            label="{{ translations.reports.overview.modal.endDateLabel | transloco }}"
          />
        </div>
      </form>
        <watt-modal-actions>
          <watt-button type="button" variant="secondary" (click)="modal.close(false)">
            {{ translations.reports.overview.modal.cancel | transloco }}
          </watt-button>
          <watt-button
            type="submit"
            [disabled]="dateForm.invalid"
          >
            {{ translations.reports.overview.modal.start | transloco }}
          </watt-button>
        </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoStartReportGenerationModalComponent extends WattTypedModal {
  get startDateControl() {
    return this.dateForm.get('startDate') as FormControl;
  }

  get endDateControl() {
    return this.dateForm.get('endDate') as FormControl;
  }

  dateForm = new FormGroup(
    {
      startDate: new FormControl(dayjs().toDate(), [Validators.required]),
      endDate: new FormControl(dayjs().toDate(), [Validators.required]),
    },
    { validators: startDateCannotBeAfterEndDate() }
  );

  protected translations = translations;
  today = dayjs().toDate();

  private modal = viewChild.required(WattModalComponent);
  private reportService = inject(EoReportsService);

  createReport() {
    const startDate = dayjs(this.startDateControl.value);
    const endDate = dayjs(this.endDateControl.value);
    const newReportRequest: EoReportRequestModel = {
      startDate: startDate.valueOf(),
      endDate: endDate.valueOf(),
    };

    this.reportService.startReportGeneration(newReportRequest);
    this.modal().close(true);
  }
}

export function startDateCannotBeAfterEndDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) return null;

    return dayjs(startDate).isAfter(dayjs(endDate)) ? { dateRange: true } : null;
  };
}
