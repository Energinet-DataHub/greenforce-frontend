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
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { dayjs } from '@energinet/watt/core/date';
import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattFieldErrorComponent } from '@energinet/watt/field';

function isTodayOrYesterday(date: Date): boolean {
  const today = dayjs().startOf('day');
  const yesterday = today.subtract(1, 'day');
  const d = dayjs(date).startOf('day');
  return d.isSame(today) || d.isSame(yesterday);
}

export interface DisconnectMeteringPointModalData {
  cutoffDate?: Date | null;
}

export interface DisconnectMeteringPointResult {
  validityDate: Date;
}

@Component({
  selector: 'dh-disconnect-metering-point-modal',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattFieldErrorComponent,
  ],
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.disconnectProcess'"
      [title]="t('title')"
      size="small"
    >
      <form id="disconnect-form" [formGroup]="form" (ngSubmit)="submit()">
        <watt-datepicker
          [label]="t('validityDateLabel')"
          [formControl]="form.controls.validityDate"
          [dateFilter]="dateFilter"
        >
          @if (form.controls.validityDate.hasError('invalidDate')) {
            <watt-field-error>
              {{ t('invalidDateError') }}
            </watt-field-error>
          }
        </watt-datepicker>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="cancel()">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="disconnect-form">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhDisconnectMeteringPointModal
  extends WattTypedModal<DisconnectMeteringPointModalData>
  implements OnInit
{
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    validityDate: this.fb.control<Date | null>(new Date(), [
      Validators.required,
      // Custom validator to check if the date is today or yesterday
      (control: AbstractControl<Date | null>): ValidationErrors | null => {
        if (!control.value) return null;
        return isTodayOrYesterday(control.value) ? null : { invalidDate: true };
      },
    ]),
  });

  readonly dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return isTodayOrYesterday(date);
  };

  ngOnInit() {
    if (this.modalData.cutoffDate) {
      this.form.controls.validityDate.setValue(this.modalData.cutoffDate);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid) return;

    const { validityDate } = this.form.getRawValue();
    if (!validityDate) return;

    this.dialogRef.close({ validityDate } satisfies DisconnectMeteringPointResult);
  }
}
