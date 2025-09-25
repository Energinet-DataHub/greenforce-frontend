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
import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import { MoveInCustomerDetailsFormType, MoveInType } from '../types';

@Component({
  selector: 'dh-customer-details',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WattTextFieldComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattRadioComponent,
    WattCheckboxComponent,
    WattFieldErrorComponent,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    .cutOffDate,
    .moveInType {
      width: 320px;
    }

    .name {
      width: 250px;
    }

    .cpr,
    .cvr {
      width: 150px;
    }
  `,
  template: `
    @let form = customerDetailsForm();

    <form
      [formGroup]="form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.customerDetails'"
    >
      <watt-datepicker
        class="cutOffDate"
        [label]="t('cutOffDate')"
        [min]="yesterday"
        [formControl]="form.controls.cutOffDate"
      />

      <watt-dropdown
        class="moveInType"
        dhDropdownTranslator
        translateKey="meteringPoint.moveIn.steps.moveInType"
        [label]="t('moveInType')"
        [options]="moveInTypeDropdownOptions"
        [showResetOption]="false"
        [formControl]="form.controls.moveInType"
      />

      <vater-stack align="start" gap="s" class="watt-space-stack-l">
        <span class="watt-label">{{ t('customerInformation') }}</span>

        <vater-stack direction="row" gap="m">
          <watt-radio
            group="customer-type"
            [formControl]="form.controls.customerType"
            value="private"
            >{{ t('private') }}</watt-radio
          >
          <watt-radio
            group="customer-type"
            [formControl]="form.controls.customerType"
            value="business"
            >{{ t('business') }}</watt-radio
          >
        </vater-stack>
      </vater-stack>

      @if (form.controls.customerType.value === 'private') {
        @let privateCustomer = form.controls.privateCustomer;

        @if (privateCustomer !== undefined) {
          <watt-text-field
            class="name"
            [label]="t('name1')"
            [formControl]="privateCustomer.controls.name1"
          />

          <watt-text-field
            class="cpr"
            [label]="t('cpr1')"
            [formControl]="privateCustomer.controls.cpr1"
            maxLength="10"
          >
            <watt-field-error>
              @if (privateCustomer.controls.cpr1.hasError('containsLetters')) {
                {{ t('cprError.containsLetters') }}
              } @else if (privateCustomer.controls.cpr1.hasError('containsDash')) {
                {{ t('cprError.containsDash') }}
              } @else if (privateCustomer.controls.cpr1.hasError('invalidCprLength')) {
                {{ t('cprError.invalidCprLength') }}
              }
            </watt-field-error>
          </watt-text-field>

          <watt-text-field
            class="name"
            [label]="t('name2')"
            [formControl]="privateCustomer.controls.name2"
          />

          <watt-text-field
            class="cpr"
            [label]="t('cpr2')"
            [formControl]="privateCustomer.controls.cpr2"
            maxLength="10"
          >
            <watt-field-error>
              @if (privateCustomer.controls.cpr2.hasError('containsLetters')) {
                {{ t('cprError.containsLetters') }}
              } @else if (privateCustomer.controls.cpr2.hasError('containsDash')) {
                {{ t('cprError.containsDash') }}
              } @else if (privateCustomer.controls.cpr2.hasError('invalidCprLength')) {
                {{ t('cprError.invalidCprLength') }}
              }
            </watt-field-error>
          </watt-text-field>
        }
      } @else {
        @let businessCustomer = form.controls.businessCustomer;

        @if (businessCustomer !== undefined) {
          <watt-text-field
            [label]="t('companyName')"
            class="name"
            [formControl]="businessCustomer.controls.companyName"
          />

          <watt-text-field
            [label]="t('cvr')"
            class="cvr"
            [formControl]="businessCustomer.controls.cvr"
          />
        }
      }

      <watt-checkbox [formControl]="form.controls.isProtectedAddress">
        {{ t('protectedAddress') }}
      </watt-checkbox>
    </form>
  `,
})
export class DhCustomerDetailsComponent {
  customerDetailsForm = input.required<FormGroup<MoveInCustomerDetailsFormType>>();

  yesterday = dayjs().subtract(1, 'day').toDate();

  moveInTypeDropdownOptions = dhEnumToWattDropdownOptions(MoveInType);
}
