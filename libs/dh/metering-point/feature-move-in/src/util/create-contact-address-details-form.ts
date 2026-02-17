import { AddressDetailsFormType, Contact, InstallationAddress } from '../types';
import { FormGroup, Validators } from '@angular/forms';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { dhMunicipalityCodeValidator } from '@energinet-datahub/dh/shared/ui-validators';

export function createContactAddressDetailsForm(
  contact: Contact,
  installationAddress: InstallationAddress
) {
  const addressSameAsInstallation = IsContactAddressEquealToInstallation(
    installationAddress,
    contact
  );

  const contactOrInstallationAddress = addressSameAsInstallation
    ? mapInstallationAdressToContact(installationAddress)
    : contact;

  return new FormGroup<AddressDetailsFormType>({
    addressSameAsInstallation: dhMakeFormControl<boolean>(addressSameAsInstallation),
    addressProtection: dhMakeFormControl<boolean>(
      contactOrInstallationAddress?.isProtectedAddress ?? false
    ),
    addressGroup: new FormGroup({
      streetName: dhMakeFormControl<string>(
        contactOrInstallationAddress?.streetName ?? '',
        Validators.required
      ),
      buildingNumber: dhMakeFormControl<string>(
        contactOrInstallationAddress?.buildingNumber ?? '',
        Validators.required
      ),
      floor: dhMakeFormControl<string>(contactOrInstallationAddress?.floor ?? ''),
      room: dhMakeFormControl<string>(contactOrInstallationAddress?.room ?? ''),
      postCode: dhMakeFormControl<string>(
        contactOrInstallationAddress?.postCode ?? '',
        Validators.required
      ),
      cityName: dhMakeFormControl<string>(
        contactOrInstallationAddress?.cityName ?? '',
        Validators.required
      ),
      countryCode: dhMakeFormControl<string>(contactOrInstallationAddress?.countryCode ?? ''),
      streetCode: dhMakeFormControl<string>(
        contactOrInstallationAddress?.streetCode ?? '',
        Validators.required
      ),
      citySubDivisionName: dhMakeFormControl<string>(
        contactOrInstallationAddress?.citySubDivisionName ?? ''
      ),
      postBox: dhMakeFormControl<string>(contactOrInstallationAddress?.postBox ?? ''),
      municipalityCode: dhMakeFormControl<string>(
        contactOrInstallationAddress?.municipalityCode ?? '',
        [dhMunicipalityCodeValidator(), Validators.required]
      ),
      darReference: dhMakeFormControl<string>(contactOrInstallationAddress?.darReference ?? ''),
    }),
  });
}

function IsContactAddressEquealToInstallation(
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

function mapInstallationAdressToContact(
  installationAddress: InstallationAddress
): Partial<Contact> {
  return {
    streetName: installationAddress?.streetName,
    buildingNumber: installationAddress?.buildingNumber,
    floor: installationAddress?.floor,
    room: installationAddress?.room,
    postCode: installationAddress?.postCode,
    cityName: installationAddress?.cityName,
    countryCode: installationAddress?.countryCode,
    streetCode: installationAddress?.streetCode,
    citySubDivisionName: installationAddress?.citySubDivisionName,
    municipalityCode: installationAddress?.municipalityCode,
    darReference: installationAddress?.darReference,
  };
}
