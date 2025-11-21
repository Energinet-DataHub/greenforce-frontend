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

import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-metering-point-stop-charge-link',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,

    VaterStackComponent,
  ],
  styles: `
    :host {
      form > * {
        width: 50%;
      }
    }
  `,
  template: `
    <watt-modal
      size="small"
      #stop
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.stop'"
      [title]="t('title')"
    >
      <form vater-stack align="start" direction="column" gap="s" tabindex="-1" [formGroup]="form">
        <watt-datepicker [formControl]="form.controls.stopDate" [label]="t('stopDate')" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="stop.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button
          variant="primary"
          (click)="stopLink(); stop.close(true)"
          [disabled]="form.invalid"
        >
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMeteringPointStopChargeLink extends WattTypedModal {
  form = new FormGroup({
    stopDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  stopLink() {
    console.log('Stopping link with values:', this.form.value);
  }
}
