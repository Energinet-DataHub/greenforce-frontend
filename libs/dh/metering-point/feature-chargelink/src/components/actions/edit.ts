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

import { Component, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { EditChargeLinkDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-edit-charge-link',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
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
      #edit
      autoOpen
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.edit'"
      [title]="t('title')"
      (closed)="navigate.navigate('details', id())"
    >
      <form vater-stack align="start" direction="column" gap="s" tabindex="-1" [formGroup]="form">
        <watt-text-field [formControl]="form.controls.factor" [label]="t('factor')" type="number" />
        <watt-datepicker [formControl]="form.controls.startDate" [label]="t('startDate')" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="edit.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" (click)="editLink(edit)">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointEditChargeLink {
  private edit = mutation(EditChargeLinkDocument);
  navigate = inject(DhNavigationService);
  form = new FormGroup({
    factor: dhMakeFormControl<number>(null, [Validators.min(1)]),
    startDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  id = input.required<string>();

  editLink(component: WattModalComponent) {
    const startDate = this.form.value.startDate;
    const factor = this.form.value.factor;
    if (this.form.invalid) return;
    if (!startDate) return;
    if (!factor) return;

    this.edit.mutate({
      variables: {
        chargeLinkId: this.id(),
        newStartDate: startDate,
        factor,
      },
    });

    component.close(true);
  }
}
