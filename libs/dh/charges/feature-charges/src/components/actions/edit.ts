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
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WATT_MODAL } from '@energinet/watt/modal';
import { WATT_RADIO } from '@energinet/watt/radio';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattTooltipDirective } from '@energinet/watt/tooltip';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { dhMakeFormControl, injectRelativeNavigate } from '@energinet-datahub/dh/shared/ui-util';

import {
  VatClassification,
  GetChargeByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-charges-edit',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    TranslocoPipe,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_MODAL,
    WATT_RADIO,
    WattButtonComponent,
    WattDatepickerComponent,
    WattTextAreaFieldComponent,
    WattTextFieldComponent,
    WattIconComponent,
    WattTooltipDirective,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; prefix: 'charges.actions.edit'"
      autoOpen
      size="small"
      (closed)="navigate('..')"
    >
      <h2 vater-stack direction="row" gap="s">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
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
        <watt-radio-group readonly [label]="t('resolution')" [value]="resolution()">
          <watt-radio [value]="resolution()">
            {{ 'charges.resolutions.' + resolution() | transloco }}
          </watt-radio>
        </watt-radio-group>
        <watt-radio-group [label]="t('vat')" [formControl]="form().controls.vat">
          <watt-radio [value]="vat25">
            {{ t('withVat') }}
          </watt-radio>
          <watt-radio [value]="noVat">
            {{ t('withoutVat') }}
          </watt-radio>
        </watt-radio-group>
        @if (!form().controls.transparentInvoicing.disabled) {
          <watt-radio-group
            [label]="t('transparentInvoicing')"
            [formControl]="form().controls.transparentInvoicing"
          >
            <watt-radio [value]="true">
              {{ t('withTransparentInvoicing') }}
            </watt-radio>
            <watt-radio [value]="false">
              {{ t('withoutTransparentInvoicing') }}
            </watt-radio>
          </watt-radio-group>
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
  name = computed(() => this.charge()?.name);
  description = computed(() => this.charge()?.currentPeriod?.description);
  resolution = computed(() => this.charge()?.resolution);
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
