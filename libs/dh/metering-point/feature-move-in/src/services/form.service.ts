import { computed, inject, Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  AddressDetailsFormType,
  Contact,
  ContactDetailsFormType,
  Customer,
  InstallationAddress,
} from '../types';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { dhMunicipalityCodeValidator } from '@energinet-datahub/dh/shared/ui-validators';

@Injectable()
export class DhMeteringPointMoveInFormService {
  private readonly actor = inject(DhActorStorage).getSelectedActor();
  private readonly environment = inject(dhAppEnvironmentToken);
  private readonly query = lazyQuery(GetMeteringPointByIdDocument);
  private readonly customers = computed(
    () => this.query.data()?.meteringPoint.commercialRelation?.activeEnergySupplyPeriod?.customers
  );
  private readonly legalCustomer = computed(() =>
    this.customers()?.find((customer) => customer.relationType === 'JURIDICAL')
  );
  private readonly technicalCustomer = computed(() =>
    this.customers()?.find((customer) => customer.relationType === 'TECHNICAL')
  );
  private readonly secondaryCustomer = computed(() =>
    this.customers()?.find((customer) => customer.relationType === 'SECONDARY')
  );
  private readonly installationAddress = computed(
    () => this.query.data()?.meteringPoint.metadata?.installationAddress
  );

  async initialForm(meteringPointId: string, searchMigratedMeteringPoints: boolean) {
    this.query.refetch({
      meteringPointId,
      searchMigratedMeteringPoints,
      actorGln: this.actor.gln,
    });
  }

  form = computed(
    () =>
      new FormGroup({
        legalContactDetails: this.createCustomerContactDetailsForm(
          this.legalCustomer(),
          this.legalCustomer()?.legalContact
        ),
        legalContactAddressDetails: this.createContactAddressDetailsForm(
          this.legalCustomer()?.legalContact,
          this.installationAddress()
        ),
        technicalContactAddressDetails: this.createContactAddressDetailsForm(
          this.technicalCustomer()?.technicalContact,
          this.installationAddress()
        ),
      })
  );

  private createCustomerContactDetailsForm(legalCustomer: Customer | undefined, contact: Contact) {
    const nameSameAsCustomer = legalCustomer?.name === contact?.name;

    assertIsDefined(legalCustomer?.name);

    return new FormGroup<ContactDetailsFormType>({
      contactSameAsCustomer: dhMakeFormControl<boolean>(nameSameAsCustomer),
      contactGroup: new FormGroup({
        name: dhMakeFormControl<string>(
          {
            value: nameSameAsCustomer ? legalCustomer.name : (contact?.name ?? ''),
            disabled: true,
          },
          Validators.required
        ),
        phone: dhMakeFormControl<string>(contact?.phone ?? ''),
        mobile: dhMakeFormControl<string>(contact?.mobile ?? ''),
        attention: dhMakeFormControl<string>(contact?.attention ?? ''),
        email: dhMakeFormControl<string>(contact?.email ?? '', Validators.email),
      }),
    });
  }

  private createContactAddressDetailsForm(
    contact: Contact,
    installationAddress: InstallationAddress
  ) {
    assertIsDefined(installationAddress);

    const addressSameAsInstallation = this.IsContactAddressEquealToInstallation(
      installationAddress,
      contact
    );

    const contactOrInstallationAddress = addressSameAsInstallation
      ? this.mapInstallationAdressToContact(installationAddress)
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

  private IsContactAddressEquealToInstallation(
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

  private mapInstallationAdressToContact(
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
}
