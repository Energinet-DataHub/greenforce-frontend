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
import { Component, computed, effect, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WATT_MODAL } from '@energinet/watt/modal';
import { WATT_RADIO, WattRadioComponent } from '@energinet/watt/radio';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattTooltipDirective } from '@energinet/watt/tooltip';

import { DhChargesTypeSelection } from '@energinet-datahub/dh/charges/ui-shared';
import {
  ChargeResolution,
  ChargeType,
  CreateChargeDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhMakeFormControl,
  injectRelativeNavigate,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

@Component({
  selector: 'dh-charges-create',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_MODAL,
    WATT_RADIO,
    WattButtonComponent,
    WattDatepickerComponent,
    WattRadioComponent,
    WattTextAreaFieldComponent,
    WattTextFieldComponent,
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
      <h2 class="watt-modal-title watt-modal-title-icon">
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
              [formControl]="form().controls.code"
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
            <watt-radio-group [label]="t('resolution')" [formControl]="form().controls.resolution">
              <watt-radio [value]="dailyResolution">
                {{ t('DAILY') }}
              </watt-radio>
              <watt-radio [value]="hourlyResolution">
                {{ t('HOURLY') }}
              </watt-radio>
            </watt-radio-group>
          }
          <watt-radio-group [label]="t('vat')" [formControl]="form().controls.vat">
            <watt-radio [value]="true">
              {{ t('withVat') }}
            </watt-radio>
            <watt-radio [value]="false">
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
          <!-- @if (!form().controls.predictablePrice.disabled) {
            <watt-radio-group
              [label]="t('predictablePrice')"
              [formControl]="form().controls.predictablePrice"
            >
              <watt-radio [value]="true">
                {{ t('withPredictablePrice') }}
              </watt-radio>
              <watt-radio [value]="false">
                {{ t('withoutPredictablePrice') }}
              </watt-radio>
            </watt-radio-group>
          } -->
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
  createCharge = mutation(CreateChargeDocument);
  toast = injectToast('charges.actions.create.toast');
  toastEffect = effect(() => this.toast(this.createCharge.status()));
  dailyResolution: ChargeResolution = 'DAILY';
  hourlyResolution: ChargeResolution = 'HOURLY';
  type = signal<ChargeType | null>(null);
  form = computed(
    () =>
      new FormGroup({
        code: dhMakeFormControl('', Validators.required),
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
        // predictablePrice: dhMakeFormControl<boolean>(
        //   { value: null, disabled: this.type() == 'TARIFF_TAX' },
        //   Validators.required
        // ),
      })
  );

  save() {
    if (!this.form().valid) return;

    const { resolution, transparentInvoicing, type, validFrom, vat, ...input } =
      this.form().getRawValue();

    assertIsDefined(resolution);
    assertIsDefined(transparentInvoicing);
    assertIsDefined(type);
    assertIsDefined(validFrom);
    assertIsDefined(vat);

    this.createCharge.mutate({
      variables: {
        input: {
          resolution,
          transparentInvoicing,
          type,
          validFrom,
          vat,
          ...input,
        },
      },
    });
  }
}
