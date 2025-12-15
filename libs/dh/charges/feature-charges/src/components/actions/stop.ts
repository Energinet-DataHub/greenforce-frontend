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

import { WATT_MODAL } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { dhMakeFormControl, injectRelativeNavigate } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-charges-stop',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattButtonComponent,
    WattDatepickerComponent,
    WATT_MODAL,
    WattIconComponent,
    WattTooltipDirective,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; prefix: 'charges.actions.stop'"
      autoOpen
      size="small"
      (closed)="navigate('..')"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <form id="stop-charge" [formGroup]="form" (ngSubmit)="save()">
        <watt-datepicker [label]="t('date')" [formControl]="form.controls.date" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" formId="stop-charge" type="submit">
          {{ t('submit') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhChargesStop {
  navigate = injectRelativeNavigate();
  form = new FormGroup({
    date: dhMakeFormControl<Date>(null, Validators.required),
  });

  save() {
    console.log(this.form.value, 'saving form');
  }
}
