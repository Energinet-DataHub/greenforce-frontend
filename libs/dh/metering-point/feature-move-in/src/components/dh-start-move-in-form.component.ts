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

import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { dayjs } from '@energinet/watt/date';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import { StartMoveInFormType } from '../types';
import { ChangeOfSupplierBusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-start-move-in-form',
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
    @let form = startMoveInForm();

    <form [formGroup]="form" *transloco="let t; prefix: 'meteringPoint.moveIn.customerDetails'">
      <watt-datepicker
        class="cutOffDate"
        [label]="t('cutOffDate')"
        [min]="sevenDaysAgo"
        [max]="sixtyDaysFromNow"
        [formControl]="form.controls.cutOffDate"
      />

      <watt-dropdown
        class="moveInType"
        dhDropdownTranslator
        translateKey="meteringPoint.moveIn.businessReason"
        [label]="t('moveInType')"
        [options]="businessReasonDropdownOptions"
        [showResetOption]="false"
        [formControl]="form.controls.businessReason"
      />

      <vater-stack align="start" gap="s" class="watt-space-stack-l">
        <span class="watt-label">{{ t('customerInformation') }}</span>

        <vater-stack direction="row" gap="m">
          <watt-radio
            group="customer-type"
            [formControl]="form.controls.customerType"
            value="private"
            >{{ t('private') }}
          </watt-radio>
          <watt-radio
            group="customer-type"
            [formControl]="form.controls.customerType"
            value="business"
            >{{ t('business') }}
          </watt-radio>
        </vater-stack>
      </vater-stack>

      @if (form.controls.customerType.value === 'private') {
        @let privateCustomer = form.controls.privateCustomer;

        @if (privateCustomer !== undefined) {
          <watt-text-field
            class="name"
            [label]="t('name')"
            [formControl]="privateCustomer.controls.name"
          />

          <watt-text-field
            class="cpr"
            [label]="t('cpr')"
            [formControl]="privateCustomer.controls.cpr"
            maxLength="10"
          >
            <watt-field-error>
              @if (privateCustomer.controls.cpr.hasError('containsLetters')) {
                {{ t('cprError.containsLetters') }}
              } @else if (privateCustomer.controls.cpr.hasError('containsDash')) {
                {{ t('cprError.containsDash') }}
              } @else if (privateCustomer.controls.cpr.hasError('invalidCprLength')) {
                {{ t('cprError.invalidCprLength') }}
              } @else if (privateCustomer.controls.cpr.hasError('invalidDate')) {
                {{ t('cprError.invalidDate') }}
              } @else if (privateCustomer.controls.cpr.hasError('allOnes')) {
                {{ t('cprError.allOnes') }}
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

          <vater-stack direction="row" gap="m">
            <watt-text-field
              [label]="t('cvr')"
              class="cvr"
              [formControl]="businessCustomer.controls.cvr"
            >
              <watt-field-error>
                @if (businessCustomer.controls.cvr.hasError('invalidCvrNumber')) {
                  {{ t('cvrInvalid') }}
                }
              </watt-field-error>
            </watt-text-field>
            <watt-checkbox [formControl]="businessCustomer.controls.isForeignCompany">
              {{ t('foreignCompany') }}
            </watt-checkbox>
          </vater-stack>
        }
      }
    </form>
  `,
})
export class DhStartMoveInFormComponent {
  startMoveInForm = input.required<FormGroup<StartMoveInFormType>>();

  sevenDaysAgo = dayjs().subtract(7, 'day').toDate();
  sixtyDaysFromNow = dayjs().add(60, 'day').toDate();

  businessReasonDropdownOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    ChangeOfSupplierBusinessReason,
    ['CHANGE_OF_ENERGY_SUPPLIER']
  );
}
