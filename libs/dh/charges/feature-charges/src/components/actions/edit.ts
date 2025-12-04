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
import { Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_MODAL } from '@energinet/watt/modal';

import { dhMakeFormControl, injectRelativeNavigate } from '@energinet-datahub/dh/shared/ui-util';
import {
  GetChargeByIdDocument,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

@Component({
  selector: 'dh-charges-edit',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    WattButtonComponent,
    WattDatepickerComponent,
    WattFieldComponent,
    WattRadioComponent,
    WattTextAreaFieldComponent,
    WattTextFieldComponent,
    WATT_MODAL,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; prefix: 'charges.actions.edit'"
      autoOpen
      size="small"
      [title]="t('title')"
      (closed)="navigate('..')"
    >
      <form
        *transloco="let t; prefix: 'charges.actions.create.form'"
        id="edit-charge"
        vater-stack
        direction="column"
        gap="s"
        align="start"
        [formGroup]="form()"
        (ngSubmit)="save()"
      >
        <vater-stack fill="horizontal" direction="row" gap="m">
          <watt-text-field
            maxLength="10"
            size="10"
            [label]="t('id')"
            [formControl]="form().controls.id"
          />
          <watt-text-field
            vater
            fill="horizontal"
            maxLength="132"
            [label]="t('name')"
            [formControl]="form().controls.name"
          />
        </vater-stack>
        <watt-textarea-field
          small
          [label]="t('description')"
          maxLength="2048"
          [formControl]="form().controls.description"
        />
        <watt-field [label]="t('vat')" [control]="form().controls.vat" displayMode="content">
          <watt-radio group="vat" [formControl]="form().controls.vat" [value]="vat25">
            {{ t('withVat') }}
          </watt-radio>
          <watt-radio group="vat" [formControl]="form().controls.vat" [value]="noVat">
            {{ t('withoutVat') }}
          </watt-radio>
        </watt-field>
        @if (!form().controls.transparentInvoicing.disabled) {
          <watt-field
            [label]="t('transparentInvoicing')"
            [control]="form().controls.transparentInvoicing"
            displayMode="content"
          >
            <watt-radio
              group="transparentInvoicing"
              [formControl]="form().controls.transparentInvoicing"
              [value]="true"
            >
              {{ t('withTransparentInvoicing') }}
            </watt-radio>
            <watt-radio
              group="transparentInvoicing"
              [formControl]="form().controls.transparentInvoicing"
              [value]="false"
            >
              {{ t('withoutTransparentInvoicing') }}
            </watt-radio>
          </watt-field>
        }
        <!-- datepicker does not support updating formControl -->
        @if (cutoffDate()) {
          <watt-datepicker [label]="t('cutoffDate')" [formControl]="form().controls.cutoffDate" />
        }
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" formId="edit-charge" type="submit">
          {{ t('submit') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhChargesEdit {
  id = input.required<string>();
  navigate = injectRelativeNavigate();
  vat25 = VatClassification.Vat25;
  noVat = VatClassification.NoVat;
  query = query(GetChargeByIdDocument, () => ({ variables: { id: this.id() } }));
  charge = computed(() => this.query.data()?.chargeById);
  code = computed(() => this.charge()?.code);
  name = computed(() => this.charge()?.currentPeriod?.name);
  description = computed(() => this.charge()?.currentPeriod?.description);
  type = computed(() => this.charge()?.type);
  vatClassification = computed(() => this.charge()?.currentPeriod?.vatClassification);
  transparentInvoicing = computed(() => this.charge()?.currentPeriod?.transparentInvoicing ?? null);
  cutoffDate = computed(() => this.charge()?.currentPeriod?.period.end);
  form = computed(
    () =>
      new FormGroup({
        id: dhMakeFormControl({ value: this.code(), disabled: true }),
        name: dhMakeFormControl(this.name(), Validators.required),
        description: dhMakeFormControl(this.description(), Validators.required),
        cutoffDate: dhMakeFormControl<Date>(this.cutoffDate(), Validators.required),
        vat: dhMakeFormControl(this.vatClassification(), Validators.required),
        transparentInvoicing: dhMakeFormControl<boolean>(
          { value: this.transparentInvoicing(), disabled: this.type() == 'FEE' },
          Validators.required
        ),
      })
  );

  save() {
    console.log(this.form().value, 'saving form');
  }
}
