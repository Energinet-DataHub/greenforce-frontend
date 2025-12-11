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
import { VaterFlexComponent } from '@energinet/watt/vater';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattSlideToggleComponent } from '@energinet/watt/slide-toggle';

@Component({
  selector: 'dh-address-details',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattDropdownComponent,
    WattCheckboxComponent,
    WattTextFieldComponent,
    DhDropdownTranslatorDirective,
    VaterFlexComponent,
    WattFieldErrorComponent,
    WattSlideToggleComponent,
  ],
  styles: `
    .flex-grow-1 {
      flex-grow: 1;
    }

    .flex-grow-2 {
      flex-grow: 2;
    }
  `,
  template: `
    @let formGroup = addressDetailsFormGroup();
    @let groupControls = addressDetailsFormGroup().controls.addressGroup.controls;

    <form
      [formGroup]="formGroup"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.addressDetails'"
    >
      <vater-flex direction="row" align="center" justify="space-between" gap="xl">
        <vater-flex>
          <h4>{{ t('label') }}</h4>

          <watt-slide-toggle
            [formControl]="formGroup.controls.addressSameAsMeteringPoint"
            class="watt-space-stack-m"
            data-testid="address-same-as-metering-point">
            {{ t('addressSameAsMeteringPoint') }}

          </watt-slide-toggle>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="groupControls.countryCode"
            [options]="countryOptions"
            [label]="t('country')"
            data-testid="country-code"
          />

          <watt-text-field
            [formControl]="groupControls.streetName"
            [label]="t('street')"
            data-testid="street-name"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.buildingNumber"
              [label]="t('houseNumber')"
              data-testid="building-number"
            />
            <watt-text-field
              [formControl]="groupControls.floor"
              [label]="t('floor')"
              data-testid="floor"
            />
            <watt-text-field
              [formControl]="groupControls.room"
              [label]="t('door')"
              data-testid="room"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.postCode"
              [label]="t('postalCode')"
              class="flex-grow-1"
              data-testid="post-code"
            />
            <watt-text-field
              [formControl]="groupControls.cityName"
              [label]="t('city')"
              class="flex-grow-2"
              data-testid="city-name"
            />

            <watt-text-field
              [formControl]="groupControls.citySubDivisionName"
              [label]="t('citySubdivisionName')"
              class="flex-grow-2"
              data-testid="city-subdivision-name"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.streetCode"
              [label]="t('streetCode')"
              data-testid="street-code"
            />
            <watt-text-field
              [formControl]="groupControls.municipalityCode"
              [label]="t('municipalityCode')"
              maxLength="3"
              data-testid="municipality-code"
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
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="groupControls.postalDistrict"
              [label]="t('postalDistrict')"
              data-testid="postal-district"
            />
            <watt-text-field
              [formControl]="groupControls.postBox"
              [label]="t('postBox')"
              data-testid="post-box"
            />
          </vater-flex>

          <watt-text-field
            [formControl]="groupControls.darReference"
            [label]="t('darReference')"
            data-testid="dar-reference"
          />

          <watt-checkbox
            [formControl]="formGroup.controls.nameAddressProtection"
            class="watt-space-stack-l"
            data-testid="name-address-protection"
          >
            {{ t('nameAddressProtection') }}
          </watt-checkbox>
        </vater-flex>
      </vater-flex>
    </form>
  `,
})
export class DhAddressDetailsComponent {
  addressDetailsFormGroup = input.required<FormGroup<AddressDetailsFormType>>();
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
