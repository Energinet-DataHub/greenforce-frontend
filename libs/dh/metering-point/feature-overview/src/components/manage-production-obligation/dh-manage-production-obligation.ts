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
import { Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { dayjs } from '@energinet/watt/date';
import { WATT_RADIO } from '@energinet/watt/radio';

import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-manage-production-obligation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,

    WATT_MODAL,
    WATT_RADIO,
    WattButtonComponent,
    WattDatepickerComponent,
    WattIconComponent,
    WattTooltipDirective,
  ],
  styles: `
    #production-obligation-form {
      width: 50%;
    }
  `,
  template: `
    <watt-modal #modal *transloco="let t; prefix: 'meteringPoint.manageProductionObligation'">
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('modalTitle') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>

      <form [formGroup]="form" id="production-obligation-form" (ngSubmit)="save()">
        <watt-radio-group
          [label]="t('changeToLabel')"
          [formControl]="form.controls.productionObligation"
        >
          <watt-radio [value]="true">{{ 'yes' | transloco }}</watt-radio>
          <watt-radio [value]="false">{{ 'no' | transloco }}</watt-radio>
        </watt-radio-group>

        <watt-datepicker
          [label]="t('cutOffDate')"
          [formControl]="form.controls.cutOffDate"
          [min]="minDate"
          [max]="maxDate"
        />
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button formId="production-obligation-form" type="submit">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhManageProductionObligation extends WattTypedModal<{
  meteringPointId: string;
  currentProductionObligation: boolean;
}> {
  private today = dayjs().startOf('day');
  private yesterday = this.today.subtract(1, 'day');

  form = new FormGroup({
    productionObligation: dhMakeFormControl(!this.modalData.currentProductionObligation),
    cutOffDate: dhMakeFormControl(this.today.toDate(), Validators.required),
  });

  maxDate = this.today.add(60, 'day').toDate();
  minDate = this.yesterday.toDate();

  async save() {
    if (this.form.invalid) {
      return;
    }

    const { productionObligation, cutOffDate } = this.form.getRawValue();

    console.log('Saving with values', { productionObligation, cutOffDate });
  }
}
