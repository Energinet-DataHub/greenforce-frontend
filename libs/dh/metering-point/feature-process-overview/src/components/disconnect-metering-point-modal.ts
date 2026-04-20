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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { dayjs } from '@energinet/watt/core/date';
import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

export interface DisconnectMeteringPointResult {
  validityDate: Date;
}

@Component({
  selector: 'dh-disconnect-metering-point-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
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
          [min]="minDate"
          [max]="maxDate"
        />
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="dialogRef.close()">
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
export class DhDisconnectMeteringPointModal extends WattTypedModal {
  private readonly today = dayjs().startOf('day').toDate();

  readonly minDate = dayjs(this.today).subtract(1, 'day').toDate();
  readonly maxDate = this.today;

  readonly form = new FormGroup({
    validityDate: dhMakeFormControl<Date>(this.today, Validators.required),
  });

  submit() {
    if (this.form.invalid) return;

    this.dialogRef.close({
      validityDate: this.form.controls.validityDate.value,
    } satisfies DisconnectMeteringPointResult);
  }
}
