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

import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { AddressDetailsFormType } from '../types';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattFieldErrorComponent } from '@energinet/watt/field';

@Component({
  selector: 'dh-address-details-form',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDropdownComponent,
    WattCheckboxComponent,
    WattTextFieldComponent,
    DhDropdownTranslatorDirective,
    VaterFlexComponent,
    VaterStackComponent,
    WattFieldErrorComponent,
  ],
  template: `
    @let form = addressDetailsForm();
    @let groupControls = addressDetailsForm().controls.addressGroup.controls;

    <form
      [formGroup]="form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.addressDetails'"
    >
      <vater-flex direction="row" align="center" justify="space-between" gap="xl">
        <vater-flex>
          <vater-stack align="start" gap="xs" class="checkbox-margin-bottom">
            <watt-checkbox
              [formControl]="form.controls.addressSameAsMeteringPoint"
              data-testid="technical-address-same-as-legal"
            >
              {{ t('addressSameAsLegal') }}
            </watt-checkbox>
            <watt-checkbox
              [formControl]="form.controls.nameAddressProtection"
              data-testid="technical-name-address-protection"
            >
              {{ t('nameAddressProtection') }}
            </watt-checkbox>
          </vater-stack>

          <watt-text-field
            [formControl]="groupControls.streetName"
            [label]="t('street')"
            data-testid="technical-street-name"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.buildingNumber"
              [label]="t('houseNumber')"
              data-testid="technical-building-number"
            />
            <watt-text-field
              [formControl]="groupControls.floor"
              [label]="t('floor')"
              data-testid="technical-floor"
            />
            <watt-text-field
              [formControl]="groupControls.room"
              [label]="t('door')"
              data-testid="technical-room"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.postCode"
              [label]="t('postalCode')"
              data-testid="technical-post-code"
            />
            <watt-text-field
              [formControl]="groupControls.cityName"
              [label]="t('city')"
              data-testid="technical-city-name"
            />
          </vater-flex>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="groupControls.countryCode"
            [options]="countryOptions"
            [label]="t('country')"
            data-testid="technical-country-code"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.municipalityCode"
              [label]="t('municipalityCode')"
              maxLength="3"
              data-testid="technical-municipality-code"
            >
              <watt-field-error>
                @if (groupControls.municipalityCode.hasError('containsLetters')) {
                  {{ t('municipalityCodeError.containsLetters') }}
                } @else if (groupControls.municipalityCode.hasError('startsWithZero')) {
                  {{ t('municipalityCodeError.startsWithZero') }}
                } @else if (groupControls.municipalityCode.hasError('invalidMunicipalityCodeLength')) {
                  {{ t('municipalityCodeError.invalidMunicipalityCodeLength') }}
                }
              </watt-field-error>
            </watt-text-field>
            <watt-text-field
              [formControl]="groupControls.streetCode"
              [label]="t('streetCode')"
              data-testid="technical-street-code"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.citySubDivisionName"
              [label]="t('citySubdivisionName')"
              data-testid="technical-city-subdivision-name"
            />
            <watt-text-field
              [formControl]="groupControls.postBox"
              [label]="t('postBox')"
              data-testid="technical-post-box"
            />
          </vater-flex>

          <watt-text-field
            [formControl]="groupControls.darReference"
            [label]="t('darReference')"
            data-testid="technical-dar-reference"
          />
        </vater-flex>
      </vater-flex>
    </form>
  `,
  styles: `
    .checkbox-margin-bottom {
      margin-bottom: var(--watt-space-m);
    }
  `,
})
export class DhAddressDetailsFormComponent {
  addressDetailsForm = input.required<FormGroup<AddressDetailsFormType>>();
  countryOptions: WattDropdownOptions = [
    { value: 'DK', displayValue: 'DK' },
    { value: 'SE', displayValue: 'SE' },
    { value: 'NO', displayValue: 'NO' },
    { value: 'DE', displayValue: 'DE' },
    { value: 'FI', displayValue: 'FI' },
    { value: 'GB', displayValue: 'GB' },
    { value: 'PL', displayValue: 'PL' },
    { value: 'NL', displayValue: 'NL' },
    { value: 'CH', displayValue: 'CH' },
  ];
}
