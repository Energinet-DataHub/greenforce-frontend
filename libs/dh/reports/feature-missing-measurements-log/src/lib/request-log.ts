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
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoDirective } from '@jsverse/transloco';
import { filter, map } from 'rxjs';

import { RequestMissingMeasurementsLogInput } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { getMinDate, getMaxDate } from '@energinet-datahub/dh/wholesale/domain';
import {
  DhCalculationsGridAreasDropdown,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/wholesale/shared';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

import { DhRequestMissingMeasurementLogService } from './request-log-service';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-reports-missing-measurements-log-request-log',
  imports: [
    DhCalculationsGridAreasDropdown,
    MatSelectModule,
    ReactiveFormsModule,
    TranslocoDirective,
    VaterFlexComponent,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattFieldErrorComponent,
  ],
  template: `
    <watt-modal
      *transloco="let t; read: 'reports.missingMeasurementsLog.requestLog'"
      #modal
      size="small"
      [title]="t('title')"
      autoOpen
      (closed)="navigate('..')"
    >
      <form
        id="request-log"
        [formGroup]="form"
        (ngSubmit)="handleSubmit(modal)"
        vater-flex
        direction="column"
        gap="s"
        offset="m"
      >
        <watt-datepicker
          [label]="t('period')"
          [range]="true"
          [min]="minDate"
          [max]="maxDate"
          [formControl]="form.controls.period"
          data-testid="missingMeasurementsLog.requestLog.datePeriod"
        >
          @if (form.controls.period.errors?.['maxDays']) {
            <watt-field-error>{{ t('maxPeriodLength') }}</watt-field-error>
          } @else if (form.controls.period.errors?.['monthOnly']) {
            <watt-field-error>{{ t('monthOnlyError') }}</watt-field-error>
          }
        </watt-datepicker>
        <dh-calculations-grid-areas-dropdown
          [period]="period() ?? null"
          [control]="form.controls.gridAreaCodes"
          [multiple]="true"
          [preselectAll]="true"
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button variant="primary" formId="request-log" type="submit">
          {{ t('request') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhReportsMissingMeasurementsLogRequestLog {
  private readonly requestLogService = inject(DhRequestMissingMeasurementLogService);

  protected form = new FormGroup({
    period: dhMakeFormControl<WattRange<string>>(null, [
      Validators.required,
      WattRangeValidators.required,
      WattRangeValidators.maxDays(31),
    ]),
    gridAreaCodes: dhMakeFormControl<string[]>([], Validators.required),
  });
  protected period = toSignal(
    this.form.controls.period.valueChanges.pipe(
      filter(Boolean),
      map((interval) => ({
        interval: {
          start: dayjs(interval.start).toDate(),
          end: dayjs(interval.end).toDate(),
        },
      }))
    )
  );

  protected navigate = injectRelativeNavigate();
  protected minDate = getMinDate();
  protected maxDate = getMaxDate();

  // Request mutation handling
  protected handleSubmit = (modal: WattModalComponent) => {
    if (!this.form.valid) return;
    modal.close(true);
    this.requestLogService.mutate(this.makeRequestMissingMeasurementsLogInput());
  };

  private readonly makeRequestMissingMeasurementsLogInput =
    (): RequestMissingMeasurementsLogInput => {
      const { gridAreaCodes, period } = this.form.value;

      // Satisfy the type checker, since fields should be defined at this point (due to validators)
      assertIsDefined(period);

      return {
        period: {
          start: dayjs(period.start).toDate(),
          end: dayjs(period.end).toDate(),
        },
        gridAreaCodes: gridAreaCodes ?? [],
      };
    };
}
