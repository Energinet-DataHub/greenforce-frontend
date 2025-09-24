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
import { Component, input, } from '@angular/core';
import { FormGroup, ReactiveFormsModule, } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { MoveInContactDetailsFormType } from '../types';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';

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
  ],
  template: `
    @let form = contactDetailsForm();

    <form
      [formGroup]="form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.contactDetails'"
    >
      <!-- Legal Contact Section -->
      <div class="form-flex">
        <div>
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

          <watt-text-field [formControl]="form.controls.legalAddressStreet" [label]="t('street')" />

          <div class="same-line-inputs">
            <watt-text-field
              [formControl]="form.controls.legalAddressNumber"
              [label]="t('houseNumber')"
            />
            <watt-text-field [formControl]="form.controls.legalAddressFloor" [label]="t('floor')" />
            <watt-text-field [formControl]="form.controls.legalAddressDoor" [label]="t('door')" />
          </div>

          <div class="same-line-inputs">
            <watt-text-field
              [formControl]="form.controls.legalAddressPostalCode"
              [label]="t('postalCode')"
            />
            <watt-text-field [formControl]="form.controls.legalAddressCity" [label]="t('city')" />
          </div>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="form.controls.legalAddressCountry"
            [options]="countryOptions"
            [label]="t('country')"
          />

          <watt-text-field
            [formControl]="form.controls.legalAddressRoadCode"
            [label]="t('roadCode')"
          />

          <watt-text-field
            [formControl]="form.controls.legalAddressPostalDistrict"
            [label]="t('postalDistrict')"
          />

          <watt-text-field
            [formControl]="form.controls.legalAddressPostBox"
            [label]="t('postBox')"
          />

          <watt-text-field
            [formControl]="form.controls.legalAddressMunicipalityCode"
            [label]="t('municipalityCode')"
          />

          <watt-text-field
            [formControl]="form.controls.legalAddressDarReference"
            [label]="t('darReference')"
          />

          <watt-checkbox [formControl]="form.controls.legalNameAddressProtection">
            {{ t('nameAddressProtection') }}
          </watt-checkbox>
        </div>

        <!-- Technical Contact Section -->
        <div>
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
            [formControl]="form.controls.technicalAddressStreet"
            [label]="t('street')"
          />

          <div class="same-line-inputs">
            <watt-text-field
              [formControl]="form.controls.technicalAddressNumber"
              [label]="t('houseNumber')"
            />
            <watt-text-field
              [formControl]="form.controls.technicalAddressFloor"
              [label]="t('floor')"
            />
            <watt-text-field
              [formControl]="form.controls.technicalAddressDoor"
              [label]="t('door')"
            />
          </div>

          <div class="same-line-inputs">
            <watt-text-field
              [formControl]="form.controls.technicalAddressPostalCode"
              [label]="t('postalCode')"
            />
            <watt-text-field
              [formControl]="form.controls.technicalAddressCity"
              [label]="t('city')"
            />
          </div>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="form.controls.technicalAddressCountry"
            [options]="countryOptions"
            [label]="t('country')"
          />
          <watt-text-field
            [formControl]="form.controls.technicalAddressRoadCode"
            [label]="t('roadCode')"
          />
          <watt-text-field
            [formControl]="form.controls.technicalAddressPostalDistrict"
            [label]="t('postalDistrict')"
          />
          <watt-text-field
            [formControl]="form.controls.technicalAddressPostBox"
            [label]="t('postBox')"
          />
          <watt-text-field
            [formControl]="form.controls.technicalAddressMunicipalityCode"
            [label]="t('municipalityCode')"
          />
          <watt-text-field
            [formControl]="form.controls.technicalAddressDarReference"
            [label]="t('darReference')"
          />

          <watt-checkbox [formControl]="form.controls.technicalNameAddressProtection">
            {{ t('nameAddressProtection') }}
          </watt-checkbox>
        </div>
      </div>
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
