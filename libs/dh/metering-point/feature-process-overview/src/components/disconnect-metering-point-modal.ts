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
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { dayjs } from '@energinet/watt/core/date';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

export interface DisconnectMeteringPointResult {
  validityDate: Date;
}

export interface DisconnectMeteringPointModalData {
  executeMutation: (config: {
    result: DisconnectMeteringPointResult;
    onCompleted: () => void;
    onError: () => void;
  }) => void;
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
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="disconnect-form" [loading]="submitting()">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhDisconnectMeteringPointModal extends WattTypedModal<DisconnectMeteringPointModalData> {
  readonly modal = viewChild.required(WattModalComponent);
  readonly submitting = signal(false);

  private readonly today = dayjs().startOf('day').toDate();

  readonly minDate = dayjs(this.today).subtract(1, 'day').toDate();
  readonly maxDate = this.today;

  readonly form = new FormGroup({
    validityDate: dhMakeFormControl<Date>(this.today, Validators.required),
  });

  submit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.modalData.executeMutation({
      result: { validityDate: this.form.controls.validityDate.value },
      onCompleted: () => {
        this.submitting.set(false);
        this.modal().close(true);
      },
      onError: () => {
        this.submitting.set(false);
        this.modal().close(false);
      },
    });
  }
}
