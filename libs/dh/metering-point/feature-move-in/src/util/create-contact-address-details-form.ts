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
import { AddressDetailsFormType, Contact, InstallationAddress } from '../types';
import { FormGroup, Validators } from '@angular/forms';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { dhMunicipalityCodeValidator } from '@energinet-datahub/dh/shared/ui-validators';

export function createContactAddressDetailsForm(
  contact: Contact,
  installationAddress: InstallationAddress
) {
  const addressSameAsInstallation = isContactAddressEquealToInstallation(
    installationAddress,
    contact
  );

  const addressGroup = new FormGroup({
    streetName: dhMakeFormControl<string | null>(contact?.streetName, Validators.required),
    buildingNumber: dhMakeFormControl<string | null>(contact?.buildingNumber, Validators.required),
    floor: dhMakeFormControl<string | null>(contact?.floor),
    room: dhMakeFormControl<string | null>(contact?.room),
    postCode: dhMakeFormControl<string | null>(contact?.postCode, Validators.required),
    cityName: dhMakeFormControl<string | null>(contact?.cityName, Validators.required),
    countryCode: dhMakeFormControl<string | null>(contact?.countryCode),
    streetCode: dhMakeFormControl<string | null>(contact?.streetCode, Validators.required),
    citySubDivisionName: dhMakeFormControl<string | null>(contact?.citySubDivisionName),
    postBox: dhMakeFormControl<string | null>(contact?.postBox),
    municipalityCode: dhMakeFormControl<string | null>(contact?.municipalityCode, [
      dhMunicipalityCodeValidator(),
      Validators.required,
    ]),
    darReference: dhMakeFormControl<string | null>(contact?.darReference),
  });

  if (addressSameAsInstallation) addressGroup.disable();

  return new FormGroup<AddressDetailsFormType>({
    addressSameAsInstallation: dhMakeFormControl<boolean>(addressSameAsInstallation),
    addressProtection: dhMakeFormControl<boolean>(contact?.isProtectedAddress ?? false),
    addressGroup,
  });
}

function isContactAddressEquealToInstallation(
  installationAddress: InstallationAddress,
  contactAddress: Contact
): boolean {
  if (!contactAddress) return false;
  if (!installationAddress) return false;

  return (
    installationAddress.streetName === contactAddress.streetName &&
    installationAddress.buildingNumber === contactAddress.buildingNumber &&
    installationAddress.floor === contactAddress.floor &&
    installationAddress.room === contactAddress.room &&
    installationAddress.postCode === contactAddress.postCode &&
    installationAddress.cityName === contactAddress.cityName &&
    installationAddress.countryCode === contactAddress.countryCode &&
    installationAddress.streetCode === contactAddress.streetCode &&
    installationAddress.municipalityCode === contactAddress.municipalityCode
  );
}
