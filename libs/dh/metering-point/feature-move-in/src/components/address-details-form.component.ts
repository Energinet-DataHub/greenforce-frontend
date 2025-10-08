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
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { MoveInAddressDetailsFormType } from '../types';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

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
    @let legalGroupControls = addressDetailsForm().controls.legalAddressGroup.controls;
    @let technicalGroupControls = addressDetailsForm().controls.technicalAddressGroup.controls;

    <form
      [formGroup]="form"
      *transloco="let t; prefix: 'meteringPoint.moveIn.steps.addressDetails'"
    >
      <vater-flex direction="row" align="center" justify="space-between" gap="xl">
        <!-- Legal -->
        <vater-flex align="stretch">
          <h3>
            {{ t('legalAddressSection') }}
          </h3>

          <vater-stack align="start" gap="xs" class="checkbox-margin-bottom">
            <watt-checkbox [formControl]="form.controls.legalAddressSameAsMeteringPoint">
              {{ t('addressSameAsMeteringPoint') }}
            </watt-checkbox>
            <watt-checkbox [formControl]="form.controls.legalNameAddressProtection">
              {{ t('nameAddressProtection') }}
            </watt-checkbox>
          </vater-stack>

          <watt-text-field [formControl]="legalGroupControls.streetName" [label]="t('street')" />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="legalGroupControls.buildingNumber"
              [label]="t('houseNumber')"
            />
            <watt-text-field [formControl]="legalGroupControls.floor" [label]="t('floor')" />
            <watt-text-field [formControl]="legalGroupControls.room" [label]="t('door')" />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="legalGroupControls.postCode"
              [label]="t('postalCode')"
            />
            <watt-text-field [formControl]="legalGroupControls.cityName" [label]="t('city')" />
          </vater-flex>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="legalGroupControls.countryCode"
            [options]="countryOptions"
            [label]="t('country')"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="legalGroupControls.municipalityCode"
              [label]="t('municipalityCode')"
              type="text"
              maxLength="3"
            >
              <watt-field-error>
                @if (legalGroupControls.municipalityCode.hasError('containsLetters')) {
                  {{ t('municipalityCodeError.containsLetters') }}
                } @else if (legalGroupControls.municipalityCode.hasError('startsWithZero')) {
                  {{ t('municipalityCodeError.startsWithZero') }}
                } @else if (legalGroupControls.municipalityCode.hasError('invalidMunicipalityCodeLength')) {
                  {{ t('municipalityCodeError.invalidMunicipalityCodeLength') }}
                }
              </watt-field-error>
            </watt-text-field>
            <watt-text-field
              [formControl]="legalGroupControls.streetCode"
              [label]="t('streetCode')"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="legalGroupControls.citySubdivisionName"
              [label]="t('supplementaryCityName')"
            />
            <watt-text-field [formControl]="legalGroupControls.postBox" [label]="t('postBox')" />
          </vater-flex>

          <watt-text-field
            [formControl]="legalGroupControls.darReference"
            [label]="t('darReference')"
          />
        </vater-flex>
        <!-- Technical -->
        <vater-flex align="stretch">
          <h3>
            {{ t('technicalAddressSection') }}
          </h3>
          <vater-stack align="start" gap="xs" class="checkbox-margin-bottom">
              <watt-checkbox [formControl]="form.controls.technicalAddressSameAsMeteringPoint">
                {{ t('addressSameAsMeteringPoint') }}
              </watt-checkbox>
              <watt-checkbox [formControl]="form.controls.technicalNameAddressProtection">
                {{ t('nameAddressProtection') }}
              </watt-checkbox>
          </vater-stack>

          <watt-text-field
            [formControl]="technicalGroupControls.streetName"
            [label]="t('street')"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="technicalGroupControls.buildingNumber"
              [label]="t('houseNumber')"
            />
            <watt-text-field [formControl]="technicalGroupControls.floor" [label]="t('floor')" />
            <watt-text-field [formControl]="technicalGroupControls.room" [label]="t('door')" />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="technicalGroupControls.postCode"
              [label]="t('postalCode')"
            />
            <watt-text-field [formControl]="technicalGroupControls.cityName" [label]="t('city')" />
          </vater-flex>

          <watt-dropdown
            translateKey="shared.countries"
            dhDropdownTranslator
            [formControl]="technicalGroupControls.countryCode"
            [options]="countryOptions"
            [label]="t('country')"
          />

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="technicalGroupControls.municipalityCode"
              [label]="t('municipalityCode')"
              type="text"
              maxLength="3"
            >
              <watt-field-error>
                @if (legalGroupControls.municipalityCode.hasError('containsLetters')) {
                  {{ t('municipalityCodeError.containsLetters') }}
                } @else if (legalGroupControls.municipalityCode.hasError('startsWithZero')) {
                  {{ t('municipalityCodeError.startsWithZero') }}
                } @else if (legalGroupControls.municipalityCode.hasError('invalidMunicipalityCodeLength')) {
                  {{ t('municipalityCodeError.invalidMunicipalityCodeLength') }}
                }
              </watt-field-error>
            </watt-text-field>
            <watt-text-field
              [formControl]="technicalGroupControls.streetCode"
              [label]="t('streetCode')"
            />
          </vater-flex>

          <vater-flex direction="row" gap="m" justify="space-between">
            <watt-text-field
              [formControl]="technicalGroupControls.citySubdivisionName"
              [label]="t('supplementaryCityName')"
            />
            <watt-text-field
              [formControl]="technicalGroupControls.postBox"
              [label]="t('postBox')"
            />
          </vater-flex>

          <watt-text-field
            [formControl]="technicalGroupControls.darReference"
            [label]="t('darReference')"
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
  addressDetailsForm = input.required<FormGroup<MoveInAddressDetailsFormType>>();
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
