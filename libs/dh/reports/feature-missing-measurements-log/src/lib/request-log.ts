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
import { Component, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  RequestMissingMeasurementsLogInput,
  RequestMissingMeasurementsLogDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { mutation, MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { getMinDate, getMaxDate } from '@energinet-datahub/dh/wholesale/domain';
import { DhCalculationsGridAreasDropdown } from '@energinet-datahub/dh/wholesale/shared';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';

/** Helper function for displaying a toast message based on MutationStatus. */
const injectToast = () => {
  const transloco = inject(TranslocoService);
  const toast = inject(WattToastService);
  const t = (key: string) => transloco.translate(`reports.missingMeasurementsLog.toast.${key}`);
  return (status: MutationStatus) => {
    switch (status) {
      case MutationStatus.Loading:
        return toast.open({ type: 'loading', message: t('loading') });
      case MutationStatus.Error:
        return toast.update({ type: 'danger', message: t('error') });
      case MutationStatus.Resolved:
        return toast.update({ type: 'success', message: t('success') });
    }
  };
};

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
    >
      <form
        id="request-log"
        [formGroup]="form"
        (ngSubmit)="handleSubmit()"
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
          [period]="period()"
          [control]="form.controls.gridAreaCodes"
          [multiple]="true"
          [preselect]="false"
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
  form = new FormGroup({
    period: dhMakeFormControl<WattRange<string>>(null, [
      Validators.required,
      WattRangeValidators.required,
      WattRangeValidators.maxDays(31),
    ]),
    gridAreaCodes: dhMakeFormControl<string[]>([], Validators.required),
  });
  period = toSignal(
    this.form.controls.period.valueChanges.pipe(
      map((interval) => {
        return interval
          ? {
              interval: {
                start: dayjs(interval.start).toDate(),
                end: dayjs(interval.end).toDate(),
              },
            }
          : undefined;
      })
    )
  );
  modal = viewChild(WattModalComponent);
  open = () => this.modal()?.open();
  close = (result: boolean) => this.modal()?.close(result);

  minDate = getMinDate();
  maxDate = getMaxDate();

  // Request mutation handling
  request = mutation(RequestMissingMeasurementsLogDocument);
  toast = injectToast();
  toastEffect = effect(() => this.toast(this.request.status()));
  handleSubmit = () => {
    if (!this.form.valid) return;
    this.close(true);

    this.request.mutate({
      variables: { input: this.makeRequestMissingMeasurementsLogInput() },
    });
  };

  makeRequestMissingMeasurementsLogInput = (): RequestMissingMeasurementsLogInput => {
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

  constructor() {
    effect(() => {
      const modal = this.modal();
      setTimeout(() => {
        modal?.open();
      });
    });
  }
}
