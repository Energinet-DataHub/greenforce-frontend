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
import { Location } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

import { dhCprValidator, dhMunicipalityCodeValidator, } from '@energinet-datahub/dh/shared/ui-validators';
import { WattToastService } from '@energinet/watt/toast';

import {
  AddressData,
  AddressDetailsFormType,
  BusinessCustomerFormGroup,
  Contact,
  ContactDetailsFormGroup,
  ContactDetailsFormType,
  PrivateCustomerFormGroup,
} from '../types';
import { WATT_CARD } from '@energinet/watt/card';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { DhContactDetailsFormComponent } from './dh-contact-details-form.component';
import { DhAddressDetailsFormComponent } from './dh-address-details-form.component';
import { WattButtonComponent } from '@energinet/watt/button';
import { DhPrivateCustomerDetailsFormComponent } from './dh-private-customer-details-form.component';
import { DhBusinessCustomerDetailsFormComponent } from './dh-business-customer-details-form.component';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { CustomerRelationType, GetMeteringPointByIdDocument, } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-update-customer-data',
  imports: [
    TranslocoDirective,
    WATT_CARD,
    VaterFlexComponent,
    DhContactDetailsFormComponent,
    DhAddressDetailsFormComponent,
    WattButtonComponent,
    VaterStackComponent,
    DhBusinessCustomerDetailsFormComponent,
    DhPrivateCustomerDetailsFormComponent,
  ],
  styles: `
    .sticky-header {
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .margin-medium {
      margin: 0 var(--watt-space-m) 0 var(--watt-space-m);
    }

    .form-container {
      margin: var(--watt-space-m);
      flex: 1 1 0;
      min-height: 0;
      overflow: auto;
    }

    .customer-details-card {
      height: fit-content;
    }
  `,
  template: `
    <form *transloco="let t; prefix: 'meteringPoint.moveIn'">
      <watt-card class="sticky-header">
        <vater-stack class="margin-medium" direction="row" justify="space-between">
          <h3>{{ t('updateCustomerData') }}</h3>
          <vater-stack direction="row" gap="m">
            <watt-button (click)="cancel()" variant="secondary">{{ t('cancel') }}</watt-button>
            <watt-button (click)="updateCustomerData()">{{ t('updateCustomerData') }}</watt-button>
          </vater-stack>
        </vater-stack>
      </watt-card>
      <vater-flex direction="row" gap="m" class="form-container">
        <!-- Customer -->
        <watt-card class="customer-details-card">
          <watt-card-title>
            <h3>
              {{ t('steps.customerDetails.label') }}
            </h3>
          </watt-card-title>
          @if (isBusinessCustomer()) {
            <dh-business-customer-details-form
              [businessCustomerFormGroup]="businessCustomerDetailsForm"
            />
          } @else {
            <dh-private-customer-details-form
              [privateCustomerFormGroup]="privateCustomerDetailsForm"
            />
          }
        </watt-card>
        <!-- Legal -->
        <watt-card>
          <watt-card-title>
            <h3>
              {{ t('steps.contactDetails.legalContactSection') }}
            </h3>
          </watt-card-title>
          <dh-contact-details-form [contactDetailsForm]="legalContactDetailsForm" />
          <dh-address-details-form [addressDetailsForm]="legalAddressDetailsForm" />
        </watt-card>
        <!-- Technical -->
        <watt-card>
          <watt-card-title>
            <h3>
              {{ t('steps.contactDetails.technicalContactSection') }}
            </h3>
          </watt-card-title>
          <dh-contact-details-form [contactDetailsForm]="technicalContactDetailsForm" />
          <dh-address-details-form [addressDetailsForm]="technicalAddressDetailsForm" />
        </watt-card>
      </vater-flex>
    </form>
  `,
})
export class DhUpdateCustomerDataComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly translocoService = inject(TranslocoService);
  private readonly wattToastService = inject(WattToastService);
  private locationService = inject(Location);
  private actorStorage = inject(DhActorStorage).getSelectedActor();

  isBusinessCustomer = signal<boolean>(false);
  meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: { meteringPointId: this.meteringPointId(), actorGln: this.actorStorage.gln },
  }));

  meteringPointId = input.required<string>();
  meteringPoint = computed(() => this.meteringPointQuery.data()?.meteringPoint);

  addressDataFromMeteringPoint = computed((): AddressData => {
    const address = this.meteringPoint()?.metadata?.installationAddress;
    return {
      streetName: address?.streetName ?? '',
      buildingNumber: address?.buildingNumber ?? '',
      floor: address?.floor ?? '',
      room: address?.room ?? '',
      postCode: address?.postCode ?? '',
      cityName: address?.cityName ?? '',
      countryCode: address?.countryCode ?? '',
      streetCode: address?.streetCode ?? '',
      citySubDivisionName: address?.citySubDivisionName ?? '',
      postalDistrict: '',
      postBox: '',
      municipalityCode: address?.municipalityCode ?? '',
      darReference: address?.darReference ?? '',
    };
  });

  contacts = computed(
    () => this.meteringPoint()?.commercialRelation?.activeEnergySupplyPeriod?.customers ?? []
  );
  uniqueContacts = computed(() =>
    this.contacts()
      .reduce((foundContacts: Contact[], nextContact) => {
        if (!foundContacts.some((contact) => contact.id === nextContact.id)) {
          foundContacts.push(nextContact);
        }
        return foundContacts;
      }, [])
      .filter(
        (contact) => contact.legalContact || contact.relationType === CustomerRelationType.Secondary
      )
  );

  legalContactDetailsForm = this.formBuilder.group<ContactDetailsFormType>({
    contactSameAsCustomer: this.formBuilder.control<boolean>(true),
    contactGroup: this.formBuilder.group<ContactDetailsFormGroup>({
      name: this.formBuilder.control<string>({ value: '', disabled: true }, Validators.required),
      title: this.formBuilder.control<string>(''),
      phone: this.formBuilder.control<string>('', Validators.required),
      mobile: this.formBuilder.control<string>('', Validators.required),
      email: this.formBuilder.control<string>('', [Validators.email, Validators.required]),
    }),
  });

  technicalContactDetailsForm = this.formBuilder.group<ContactDetailsFormType>({
    contactSameAsCustomer: this.formBuilder.control<boolean>(true),
    contactGroup: this.formBuilder.group<ContactDetailsFormGroup>({
      name: this.formBuilder.control<string>({ value: '', disabled: true }, Validators.required),
      title: this.formBuilder.control<string>(''),
      phone: this.formBuilder.control<string>(''),
      mobile: this.formBuilder.control<string>(''),
      email: this.formBuilder.control<string>('', Validators.email),
    }),
  });

  legalAddressDetailsForm = this.formBuilder.group<AddressDetailsFormType>({
    addressSameAsMeteringPoint: this.formBuilder.control<boolean>(true),
    addressGroup: this.formBuilder.group({
      streetName: this.formBuilder.control<string>('', Validators.required),
      buildingNumber: this.formBuilder.control<string>('', Validators.required),
      floor: this.formBuilder.control<string>(''),
      room: this.formBuilder.control<string>(''),
      postCode: this.formBuilder.control<string>('', Validators.required),
      cityName: this.formBuilder.control<string>('', Validators.required),
      countryCode: this.formBuilder.control<string>('', Validators.required),
      streetCode: this.formBuilder.control<string>('', Validators.required),
      citySubDivisionName: this.formBuilder.control<string>(''),
      postalDistrict: this.formBuilder.control<string>(''),
      postBox: this.formBuilder.control<string>(''),
      municipalityCode: this.formBuilder.control<string>('', [
        dhMunicipalityCodeValidator(),
        Validators.required,
      ]),
      darReference: this.formBuilder.control<string>(''),
    }),
    nameAddressProtection: this.formBuilder.control<boolean>(false),
  });

  technicalAddressDetailsForm = this.formBuilder.group<AddressDetailsFormType>({
    addressSameAsMeteringPoint: this.formBuilder.control<boolean>(true),
    addressGroup: this.formBuilder.group({
      streetName: this.formBuilder.control<string>('', Validators.required),
      buildingNumber: this.formBuilder.control<string>(''),
      floor: this.formBuilder.control<string>(''),
      room: this.formBuilder.control<string>(''),
      postCode: this.formBuilder.control<string>('', Validators.required),
      cityName: this.formBuilder.control<string>('', Validators.required),
      countryCode: this.formBuilder.control<string>(''),
      streetCode: this.formBuilder.control<string>(''),
      citySubDivisionName: this.formBuilder.control<string>(''),
      postalDistrict: this.formBuilder.control<string>(''),
      postBox: this.formBuilder.control<string>(''),
      municipalityCode: this.formBuilder.control<string>('', dhMunicipalityCodeValidator()),
      darReference: this.formBuilder.control<string>(''),
    }),
    nameAddressProtection: this.formBuilder.control<boolean>(false),
  });

  businessCustomerDetailsForm = this.formBuilder.group<BusinessCustomerFormGroup>({
    companyName: this.formBuilder.control<string>('', Validators.required),
    cvr: this.formBuilder.control<string>('', Validators.required),
  });

  privateCustomerDetailsForm = this.formBuilder.group<PrivateCustomerFormGroup>({
    customerName1: this.formBuilder.control<string>('', Validators.required),
    cpr1: this.formBuilder.control<string>('', [Validators.required, dhCprValidator()]),
    customerName2: this.formBuilder.control<string>(''),
    cpr2: this.formBuilder.control<string>('', dhCprValidator()),
  });

  // Signals for customer name fields
  private customerName1 = signal(this.privateCustomerDetailsForm.controls.customerName1.value);
  private companyName = signal(this.businessCustomerDetailsForm.controls.companyName.value);

  // Signals for contactSameAsCustomer controls
  private legalContactSameAsCustomer = signal(
    this.legalContactDetailsForm.controls.contactSameAsCustomer.value
  );
  private technicalContactSameAsCustomer = signal(
    this.technicalContactDetailsForm.controls.contactSameAsCustomer.value
  );

  // Signals for addressSameAsMeteringPoint controls
  private legalAddressSameAsMeteringPoint = signal(
    this.legalAddressDetailsForm.controls.addressSameAsMeteringPoint.value
  );
  private technicalAddressSameAsMeteringPoint = signal(
    this.technicalAddressDetailsForm.controls.addressSameAsMeteringPoint.value
  );

  constructor() {
    // Effect for legal contact
    effect(() => {
      if (this.legalContactSameAsCustomer()) {
        const name = this.isBusinessCustomer() ? this.companyName() : this.customerName1();
        this.legalContactDetailsForm.controls.contactGroup.controls.name.setValue(name);
        this.legalContactDetailsForm.controls.contactGroup.controls.name.disable();
      } else {
        this.legalContactDetailsForm.controls.contactGroup.controls.name.setValue('');
        this.legalContactDetailsForm.controls.contactGroup.controls.name.enable();
      }
    });
    // Effect for technical contact
    effect(() => {
      if (this.technicalContactSameAsCustomer()) {
        const name = this.isBusinessCustomer() ? this.companyName() : this.customerName1();
        this.technicalContactDetailsForm.controls.contactGroup.controls.name.setValue(name);
        this.technicalContactDetailsForm.controls.contactGroup.controls.name.disable();
      } else {
        this.technicalContactDetailsForm.controls.contactGroup.controls.name.setValue('');
        this.technicalContactDetailsForm.controls.contactGroup.controls.name.enable();
      }
    });
    // Effect for legal address
    effect(() => {
      if (this.legalAddressSameAsMeteringPoint()) {
        const address = this.addressDataFromMeteringPoint();
        this.legalAddressDetailsForm.controls.addressGroup.patchValue(address);
        this.legalAddressDetailsForm.controls.addressGroup.disable();
      } else {
        this.legalAddressDetailsForm.controls.addressGroup.patchValue({
          streetName: '',
          buildingNumber: '',
          floor: '',
          room: '',
          postCode: '',
          cityName: '',
          countryCode: '',
          streetCode: '',
          citySubDivisionName: '',
          postalDistrict: '',
          postBox: '',
          municipalityCode: '',
          darReference: '',
        });
        this.legalAddressDetailsForm.controls.addressGroup.enable();
      }
    });
    // Effect for technical address
    effect(() => {
      if (this.technicalAddressSameAsMeteringPoint()) {
        const address = this.addressDataFromMeteringPoint();
        this.technicalAddressDetailsForm.controls.addressGroup.patchValue(address);
        this.technicalAddressDetailsForm.controls.addressGroup.disable();
      } else {
        this.technicalAddressDetailsForm.controls.addressGroup.patchValue({
          streetName: '',
          buildingNumber: '',
          floor: '',
          room: '',
          postCode: '',
          cityName: '',
          countryCode: '',
          streetCode: '',
          citySubDivisionName: '',
          postalDistrict: '',
          postBox: '',
          municipalityCode: '',
          darReference: '',
        });
        this.technicalAddressDetailsForm.controls.addressGroup.enable();
      }
    });
    // Effect to determine customer type and prefill customer fields
    effect(() => {
      const meteringPoint = this.meteringPoint();
      const uniqueContacts =
        meteringPoint?.commercialRelation?.activeEnergySupplyPeriod?.customers ?? [];
      const customer = uniqueContacts[0];
      if (customer) {
        if (customer.cvr) {
          this.isBusinessCustomer.set(true);
          this.businessCustomerDetailsForm.patchValue({
            companyName: customer.name ?? '',
            cvr: customer.cvr ?? '',
          });
        } else {
          this.isBusinessCustomer.set(false);
          this.privateCustomerDetailsForm.patchValue({
            customerName1: customer.name ?? '',
          });
        }
      }
    });
    // Listen for changes in customer name fields and update signals
    this.privateCustomerDetailsForm.controls.customerName1.valueChanges.subscribe((value) => {
      this.customerName1.set(value);
    });
    this.businessCustomerDetailsForm.controls.companyName.valueChanges.subscribe((value) => {
      this.companyName.set(value);
    });
    // Listen for changes in contactSameAsCustomer controls and update signals
    this.legalContactDetailsForm.controls.contactSameAsCustomer.valueChanges.subscribe((value) => {
      this.legalContactSameAsCustomer.set(value);
    });
    this.technicalContactDetailsForm.controls.contactSameAsCustomer.valueChanges.subscribe(
      (value) => {
        this.technicalContactSameAsCustomer.set(value);
      }
    );
    // Listen for changes in addressSameAsMeteringPoint controls and update signals
    this.legalAddressDetailsForm.controls.addressSameAsMeteringPoint.valueChanges.subscribe(
      (value) => {
        this.legalAddressSameAsMeteringPoint.set(value);
      }
    );
    this.technicalAddressDetailsForm.controls.addressSameAsMeteringPoint.valueChanges.subscribe(
      (value) => {
        this.technicalAddressSameAsMeteringPoint.set(value);
      }
    );
  }

  public updateCustomerData() {
    const message = this.translocoService.translate('meteringPoint.moveIn.customerDataSuccess');
    this.wattToastService.open({ type: 'success', message });
    this.locationService.back();
  }

  public cancel() {
    this.locationService.back();
  }
}
