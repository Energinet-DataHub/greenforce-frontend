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
import { Component, effect, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';

import {
  injectToast,
  dhMakeFormControl,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/shared/ui-util';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { StopChargeDocument } from '@energinet-datahub/dh/shared/domain/graphql';

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
      <form id="stop" [formGroup]="form" (ngSubmit)="save()">
        <watt-datepicker
          [label]="t('terminationDate')"
          [formControl]="form.controls.terminationDate"
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" type="submit" formId="stop">
          {{ t('submit') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhChargesStop {
  private readonly modal = viewChild.required(WattModalComponent);
  navigate = injectRelativeNavigate();
  id = input.required<string>();
  stopCharge = mutation(StopChargeDocument);
  toast = injectToast('charges.actions.stop.toast');
  toastEffect = effect(() => this.toast(this.stopCharge.status()));
  form = new FormGroup({
    terminationDate: dhMakeFormControl<Date>(null, Validators.required),
  });

  async save() {
    if (!this.form.valid) return;
    const { terminationDate } = this.form.getRawValue();
    assertIsDefined(terminationDate);
    await this.stopCharge.mutate({
      variables: {
        input: {
          id: this.id(),
          terminationDate,
        },
      },
    });

    this.modal().close(true);
  }
}
