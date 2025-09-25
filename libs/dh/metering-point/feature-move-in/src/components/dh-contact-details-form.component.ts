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

import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { MoveInContactDetailsFormType } from '../types';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-contact-details-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDropdownComponent,
    WattCheckboxComponent,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    DhDropdownTranslatorDirective,
    VaterFlexComponent,
  ],
  template: `
    @let form = contactDetailsForm();
    @let legalAddressGroup = form.controls.legalAddressGroup;
    @let technicalAddressGroup = form.controls.technicalAddressGroup;

    <form
      [formGroup]="form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.contactDetails'"
    >
      <!-- Legal Contact Section -->
      <vater-flex gap="xl" direction="row" style="height: 1000px;">
        <vater-flex align="stretch">
          <h3>
            {{ t('legalContactSection') }}
          </h3>
          <watt-checkbox [formControl]="form.controls.legalContactSameAsCustomer">
            {{ t('contactSameAsCustomer') }}
          </watt-checkbox>

          <watt-text-field
            [formControl]="form.controls.legalContactName"
            [label]="t('contactName')"
          />

          <watt-text-field
            [formControl]="form.controls.legalContactTitle"
            [label]="t('attention')"
          />

          <watt-phone-field
            [formControl]="form.controls.legalContactPhone"
            [label]="t('phoneNumber')"
          />

          <watt-phone-field
            [formControl]="form.controls.legalContactMobile"
            [label]="t('mobile')"
          />

          <watt-text-field [formControl]="form.controls.legalContactEmail" [label]="t('email')" />

          <h4>
            {{ t('addressDetails') }}
          </h4>
          <watt-checkbox [formControl]="form.controls.legalAddressSameAsMeteringPoint">
            {{ t('addressSameAsMeteringPoint') }}
          </watt-checkbox>

          <watt-text-field [formControl]="legalAddressGroup.controls.streetName" [label]="t('street')" />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="legalAddressGroup.controls.buildingNumber"
              [label]="t('houseNumber')"
            />
            <watt-text-field [formControl]="legalAddressGroup.controls.floor" [label]="t('floor')" />
            <watt-text-field [formControl]="legalAddressGroup.controls.room" [label]="t('door')" />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="form.controls.legalAddressGroup.controls.postCode"
              [label]="t('postalCode')"
            />
            <watt-text-field [formControl]="legalAddressGroup.controls.cityName" [label]="t('city')" />
          </vater-flex>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="legalAddressGroup.controls.countryCode"
            [options]="countryOptions"
            [label]="t('country')"
          />

          <watt-text-field
            [formControl]="legalAddressGroup.controls.streetCode"
            [label]="t('roadCode')"
          />

          <watt-text-field
            [formControl]="legalAddressGroup.controls.citySubdivisionName"
            [label]="t('postalDistrict')"
          />

          <watt-text-field
            [formControl]="legalAddressGroup.controls.postBox"
            [label]="t('postBox')"
          />

          <watt-text-field
            [formControl]="legalAddressGroup.controls.municipalityCode"
            [label]="t('municipalityCode')"
          />

          <watt-text-field
            [formControl]="legalAddressGroup.controls.darReference"
            [label]="t('darReference')"
          />

          <watt-checkbox [formControl]="form.controls.legalNameAddressProtection">
            {{ t('nameAddressProtection') }}
          </watt-checkbox>
        </vater-flex>

        <!-- Technical Contact Section -->
        <vater-flex align="stretch">
          <h3>
            {{ t('technicalContactSection') }}
          </h3>
          <watt-checkbox [formControl]="form.controls.technicalContactSameAsCustomer">
            {{ t('contactSameAsCustomer') }}
          </watt-checkbox>

          <watt-text-field
            [formControl]="form.controls.technicalContactName"
            [label]="t('contactName')"
          />
          <watt-text-field
            [formControl]="form.controls.technicalContactTitle"
            [label]="t('attention')"
          />
          <watt-phone-field
            [formControl]="form.controls.technicalContactPhone"
            [label]="t('phoneNumber')"
          />
          <watt-phone-field
            [formControl]="form.controls.technicalContactMobile"
            [label]="t('mobile')"
          />

          <watt-text-field
            [formControl]="form.controls.technicalContactEmail"
            [label]="t('email')"
          />
          <h4>
            {{ t('addressDetails') }}
          </h4>

          <watt-checkbox [formControl]="form.controls.technicalAddressSameAsMeteringPoint">
            {{ t('addressSameAsMeteringPoint') }}
          </watt-checkbox>

          <watt-text-field
            [formControl]="technicalAddressGroup.controls.streetName"
            [label]="t('street')"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="technicalAddressGroup.controls.buildingNumber"
              [label]="t('houseNumber')"
            />
            <watt-text-field
              [formControl]="technicalAddressGroup.controls.floor"
              [label]="t('floor')"
            />
            <watt-text-field
              [formControl]="technicalAddressGroup.controls.room"
              [label]="t('door')"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="technicalAddressGroup.controls.postCode"
              [label]="t('postalCode')"
            />
            <watt-text-field
              [formControl]="technicalAddressGroup.controls.cityName"
              [label]="t('city')"
            />
          </vater-flex>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="technicalAddressGroup.controls.countryCode"
            [options]="countryOptions"
            [label]="t('country')"
          />
          <watt-text-field
            [formControl]="technicalAddressGroup.controls.streetCode"
            [label]="t('roadCode')"
          />
          <watt-text-field
            [formControl]="technicalAddressGroup.controls.citySubdivisionName"
            [label]="t('postalDistrict')"
          />
          <watt-text-field
            [formControl]="technicalAddressGroup.controls.postBox"
            [label]="t('postBox')"
          />
          <watt-text-field
            [formControl]="technicalAddressGroup.controls.municipalityCode"
            [label]="t('municipalityCode')"
          />
          <watt-text-field
            [formControl]="technicalAddressGroup.controls.darReference"
            [label]="t('darReference')"
          />

          <watt-checkbox [formControl]="form.controls.technicalNameAddressProtection">
            {{ t('nameAddressProtection') }}
          </watt-checkbox>
        </vater-flex>
      </vater-flex>
    </form>
  `,
  styles: `
    .form-flex {
      display: flex;
      height: 1000px;
      gap: var(--watt-space-xl);
      margin-right: var(--watt-space-xl);
    }

    .same-line-inputs {
      display: flex;
      align-content: space-between;
      gap: var(--watt-space-m);
    }
  `,
})
export class DhContactDetailsFormComponent {
  contactDetailsForm = input.required<FormGroup<MoveInContactDetailsFormType>>();
  countryOptions: WattDropdownOptions = [
    { value: 'DK', displayValue: 'DK' },
    { value: 'SE', displayValue: 'SE' },
    { value: 'NO', displayValue: 'NO' },
    { value: 'DE', displayValue: 'DE' },
    { value: 'FI', displayValue: 'FI' },
    { value: 'PL', displayValue: 'PL' },
    { value: 'NL', displayValue: 'NL' },
    { value: 'CH', displayValue: 'CH' },
  ];
}
