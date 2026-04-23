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
import { clearAddressFields } from '../src/util/clear-address-fields';
import { createContactAddressDetailsForm } from '../src/util/create-contact-address-details-form';

const installationAddress = {
  streetName: 'Main Street',
  buildingNumber: '1',
  floor: '2',
  room: '3',
  postCode: '1234',
  cityName: 'Copenhagen',
  countryCode: 'DK',
  streetCode: '001',
  municipalityCode: '101',
};

const contact = {
  streetName: 'Other Street',
  buildingNumber: '5',
  floor: '1',
  room: null,
  postCode: '5678',
  cityName: 'Aarhus',
  countryCode: 'DK',
  streetCode: '002',
  citySubDivisionName: null,
  postBox: null,
  municipalityCode: '751',
  darReference: null,
  isProtectedAddress: false,
  name: 'John Doe',
  phone: null,
  mobilePhone: null,
  email: null,
};

describe('clearAddressFields', () => {
  it('sets addressSameAsInstallation to false', () => {
    const formGroup = createContactAddressDetailsForm(contact, installationAddress);
    clearAddressFields(formGroup);

    expect(formGroup.controls.addressSameAsInstallation.value).toBe(false);
  });

  it('enables the addressGroup', () => {
    const formGroup = createContactAddressDetailsForm(contact, installationAddress);
    formGroup.controls.addressGroup.disable();

    clearAddressFields(formGroup);

    expect(formGroup.controls.addressGroup.enabled).toBe(true);
  });

  it('resets all addressGroup controls to null', () => {
    const formGroup = createContactAddressDetailsForm(contact, installationAddress);
    clearAddressFields(formGroup);

    const values = formGroup.controls.addressGroup.value;
    for (const value of Object.values(values)) {
      expect(value).toBeNull();
    }
  });

  it('resets controls to null even when they were initialised with truthy values (nonNullable)', () => {
    const formGroup = createContactAddressDetailsForm(contact, installationAddress);

    // Verify controls have values before clearing
    expect(formGroup.controls.addressGroup.controls.streetName.value).toBe('Other Street');

    clearAddressFields(formGroup);

    expect(formGroup.controls.addressGroup.controls.streetName.value).toBeNull();
    expect(formGroup.controls.addressGroup.controls.postCode.value).toBeNull();
    expect(formGroup.controls.addressGroup.controls.cityName.value).toBeNull();
  });
});
