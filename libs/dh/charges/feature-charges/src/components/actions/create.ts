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
import { Component, computed, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';

import { DhChargesTypeSelection } from '@energinet-datahub/dh/charges/ui-shared';
import { ChargeResolution, ChargeType } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl, injectRelativeNavigate } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-charges-create',
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
    DhChargesTypeSelection,
    WattIconComponent,
    WattTooltipDirective,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; prefix: 'charges.actions.create'"
      autoOpen
      size="small"
      (closed)="navigate('..')"
    >
      <h2 vater-stack direction="row" gap="s">
        {{ t('action.' + (type() ?? 'SELECTION')) }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <dh-charges-type-selection [(value)]="type">
        <form
          *transloco="let t; prefix: 'charges.actions.create.form'"
          id="create-charge"
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
          @if (!form().controls.resolution.disabled) {
            <watt-field
              [label]="t('resolution')"
              [control]="form().controls.resolution"
              displayMode="content"
            >
              <watt-radio
                group="resolution"
                [formControl]="form().controls.resolution"
                [value]="dailyResolution"
              >
                {{ t('daily') }}
              </watt-radio>
              <watt-radio
                group="resolution"
                [formControl]="form().controls.resolution"
                [value]="hourlyResolution"
              >
                {{ t('hourly') }}
              </watt-radio>
            </watt-field>
          }
          <watt-field [label]="t('vat')" [control]="form().controls.vat" displayMode="content">
            <watt-radio group="vat" [formControl]="form().controls.vat" [value]="true">
              {{ t('withVat') }}
            </watt-radio>
            <watt-radio group="vat" [formControl]="form().controls.vat" [value]="false">
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
          @if (!form().controls.predictablePrice.disabled) {
            <watt-field
              [label]="t('predictablePrice')"
              [control]="form().controls.predictablePrice"
              displayMode="content"
            >
              <watt-radio
                group="predictablePrice"
                [formControl]="form().controls.predictablePrice"
                [value]="true"
              >
                {{ t('withPredictablePrice') }}
              </watt-radio>
              <watt-radio
                group="predictablePrice"
                [formControl]="form().controls.predictablePrice"
                [value]="false"
              >
                {{ t('withoutPredictablePrice') }}
              </watt-radio>
            </watt-field>
          }
          <!-- datepicker does not support updating formControl -->
          @if (type()) {
            <watt-datepicker [label]="t('validFrom')" [formControl]="form().controls.validFrom" />
          }
        </form>
      </dh-charges-type-selection>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('close') }}
        </watt-button>
        @if (type()) {
          <watt-button variant="primary" formId="create-charge" type="submit">
            {{ t('action.' + type()) }}
          </watt-button>
        }
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhChargesCreate {
  navigate = injectRelativeNavigate();
  dailyResolution: ChargeResolution = 'daily';
  hourlyResolution: ChargeResolution = 'hourly';
  type = signal<ChargeType | null>(null);
  form = computed(
    () =>
      new FormGroup({
        id: dhMakeFormControl('', Validators.required),
        type: dhMakeFormControl<ChargeType>(this.type(), Validators.required),
        name: dhMakeFormControl('', Validators.required),
        description: dhMakeFormControl('', Validators.required),
        validFrom: dhMakeFormControl<Date>(null, Validators.required),
        resolution: dhMakeFormControl<ChargeResolution>(
          { value: null, disabled: this.type() !== 'TARIFF' && this.type() !== 'TARIFF_TAX' },
          Validators.required
        ),
        vat: dhMakeFormControl<boolean>(null, Validators.required),
        transparentInvoicing: dhMakeFormControl<boolean>(
          { value: null, disabled: this.type() == 'FEE' },
          Validators.required
        ),
        predictablePrice: dhMakeFormControl<boolean>(
          { value: null, disabled: this.type() == 'TARIFF_TAX' },
          Validators.required
        ),
      })
  );

  save() {
    console.log(this.form().value, 'saving form');
  }
}
