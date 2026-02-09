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
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  signal,
  untracked,
} from '@angular/core';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  dhCprValidator,
  dhMunicipalityCodeValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { WattToastService } from '@energinet/watt/toast';
import { dhMoveInCvrValidator } from '../validators/dh-move-in-cvr.validator';

import {
  AddressData,
  AddressDetailsFormType,
  BusinessCustomerFormGroup,
  Contact,
  ContactDetailsFormGroup,
  ContactDetailsFormType,
  CustomerCharacteristicsFormType,
  PrivateCustomerFormGroup,
} from '../types';
import { WATT_CARD } from '@energinet/watt/card';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { DhContactDetailsComponent } from './dh-contact-details.component';
import { DhCustomerAddressDetailsComponent } from './dh-customer-address-details.component';
import { WattButtonComponent } from '@energinet/watt/button';
import { DhPrivateCustomerDetailsComponent } from './dh-private-customer-details.component';
import { DhBusinessCustomerDetailsFormComponent } from './dh-business-customer-details-form.component';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  ElectricityMarketViewCustomerRelationType,
  GetMeteringPointByIdDocument,
  RequestChangeCustomerCharacteristicsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mapChangeCustomerCharacteristicsFormToRequest } from '../util/change-customer-characteristics-mapper';
import { dayjs } from '@energinet/watt/date';

@Component({
  selector: 'dh-update-customer-data',
  imports: [
    TranslocoDirective,
    WATT_CARD,
    VaterFlexComponent,
    DhContactDetailsComponent,
    DhCustomerAddressDetailsComponent,
    WattButtonComponent,
    VaterStackComponent,
    DhBusinessCustomerDetailsFormComponent,
    DhPrivateCustomerDetailsComponent,
    ReactiveFormsModule,
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
    <form
      [formGroup]="updateCustomerDataForm"
      (ngSubmit)="updateCustomerData()"
      *transloco="let t; prefix: 'meteringPoint.moveIn'"
    >
      <watt-card class="sticky-header">
        <vater-stack class="margin-medium" direction="row" justify="space-between">
          <h3>{{ t('updateCustomerData') }}</h3>
          <vater-stack direction="row" gap="m">
            <watt-button (click)="cancel()" variant="secondary">{{ t('cancel') }}</watt-button>
            <watt-button type="submit">{{ t('updateCustomerData') }}</watt-button>
          </vater-stack>
        </vater-stack>
      </watt-card>
      <vater-flex direction="row" gap="m" class="form-container">
        <!-- Customer -->
        <watt-card class="customer-details-card" data-testid="customer-details-card">
          <watt-card-title>
            <h3>
              {{ t('customerDetails.label') }}
            </h3>
          </watt-card-title>
          @if (isBusinessCustomer()) {
            <dh-business-customer-details
              [businessCustomerFormGroup]="updateCustomerDataForm.controls.businessCustomerDetails"
            />
          } @else {
            <dh-private-customer-details
              [privateCustomerFormGroup]="updateCustomerDataForm.controls.privateCustomerDetails"
            />
          }
        </watt-card>
        <!-- Legal -->
        <watt-card data-testid="legal-details-card">
          <watt-card-title>
            <h3>
              {{ t('contactDetails.legalContactSection') }}
            </h3>
          </watt-card-title>
          <dh-contact-details
            [contactDetailsFormGroup]="updateCustomerDataForm.controls.legalContactDetails"
          />
          <dh-customer-address-details
            [addressDetailsFormGroup]="updateCustomerDataForm.controls.legalAddressDetails"
          />
        </watt-card>
        <!-- Technical -->
        <watt-card data-testid="technical-details-card">
          <watt-card-title>
            <h3>
              {{ t('contactDetails.technicalContactSection') }}
            </h3>
          </watt-card-title>
          <dh-contact-details
            [contactDetailsFormGroup]="updateCustomerDataForm.controls.technicalContactDetails"
          />
          <dh-customer-address-details
            [addressDetailsFormGroup]="updateCustomerDataForm.controls.technicalAddressDetails"
          />
        </watt-card>
      </vater-flex>
    </form>
  `,
})
export class DhUpdateCustomerDataComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly injector = inject(Injector);
  private readonly translocoService = inject(TranslocoService);
  private readonly wattToastService = inject(WattToastService);
  private readonly locationService = inject(Location);
  private readonly actorStorage = inject(DhActorStorage).getSelectedActor();
  private readonly destroyRef = inject(DestroyRef);

  private readonly requestChangeCustomerCharacteristics = mutation(
    RequestChangeCustomerCharacteristicsDocument
  );

  meteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  isBusinessCustomer = signal<boolean>(false);
  meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      actorGln: this.actorStorage.gln,
      searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
    },
  }));

  meteringPoint = computed(() => this.meteringPointQuery.data()?.meteringPoint);
  installationAddress = computed(() => this.meteringPoint()?.metadata?.installationAddress);

  hasValidInstallationAddress = computed(() => {
    const address = this.installationAddress();
    return !!(address && (address.streetName || address.cityName || address.postCode));
  });

  addressDataFromMeteringPoint = computed((): AddressData => {
    const address = this.installationAddress();
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
        (contact) =>
          contact.legalContact ||
          contact.relationType === ElectricityMarketViewCustomerRelationType.Secondary
      )
  );

  businessCustomerDetailsForm: FormGroup<BusinessCustomerFormGroup> =
    this.formBuilder.group<BusinessCustomerFormGroup>({
      companyName: this.formBuilder.control<string>('', Validators.required),
      cvr: this.formBuilder.control<string>('', [
        Validators.required,
        dhMoveInCvrValidator(this.injector),
      ]),
      nameProtection: this.formBuilder.control<boolean>(false),
    });

  privateCustomerDetailsForm: FormGroup<PrivateCustomerFormGroup> =
    this.formBuilder.group<PrivateCustomerFormGroup>({
      customerName1: this.formBuilder.control<string>('', Validators.required),
      cpr1: this.formBuilder.control<string>('', [Validators.required, dhCprValidator()]),
      customerName2: this.formBuilder.control<string>(''),
      cpr2: this.formBuilder.control<string>('', dhCprValidator()),
      nameProtection: this.formBuilder.control<boolean>(false),
    });

  legalContactDetailsForm: FormGroup<ContactDetailsFormType> =
    this.formBuilder.group<ContactDetailsFormType>({
      contactSameAsCustomer: this.formBuilder.control<boolean>(true),
      contactGroup: this.formBuilder.group<ContactDetailsFormGroup>({
        name: this.formBuilder.control<string>({ value: '', disabled: true }, Validators.required),
        title: this.formBuilder.control<string>(''),
        phone: this.formBuilder.control<string>(''),
        mobile: this.formBuilder.control<string>(''),
        email: this.formBuilder.control<string>('', Validators.email),
      }),
    });

  legalAddressDetailsForm: FormGroup<AddressDetailsFormType> =
    this.formBuilder.group<AddressDetailsFormType>({
      addressSameAsMeteringPoint: this.formBuilder.control<boolean>(true),
      addressGroup: this.formBuilder.group({
        countryCode: this.formBuilder.control<string>('', Validators.required),
        streetName: this.formBuilder.control<string>('', Validators.required),
        buildingNumber: this.formBuilder.control<string>('', Validators.required),
        floor: this.formBuilder.control<string>(''),
        room: this.formBuilder.control<string>(''),
        postCode: this.formBuilder.control<string>('', Validators.required),
        cityName: this.formBuilder.control<string>('', Validators.required),
        citySubDivisionName: this.formBuilder.control<string>(''),
        streetCode: this.formBuilder.control<string>('', Validators.required),
        municipalityCode: this.formBuilder.control<string>('', [
          dhMunicipalityCodeValidator(),
          Validators.required,
        ]),
        postalDistrict: this.formBuilder.control<string>(''),
        postBox: this.formBuilder.control<string>(''),
        darReference: this.formBuilder.control<string>(''),
      }),
      addressProtection: this.formBuilder.control<boolean>(false),
    });

  technicalContactDetailsForm: FormGroup<ContactDetailsFormType> =
    this.formBuilder.group<ContactDetailsFormType>({
      contactSameAsCustomer: this.formBuilder.control<boolean>(true),
      contactGroup: this.formBuilder.group<ContactDetailsFormGroup>({
        name: this.formBuilder.control<string>({ value: '', disabled: true }, Validators.required),
        title: this.formBuilder.control<string>(''),
        phone: this.formBuilder.control<string>(''),
        mobile: this.formBuilder.control<string>(''),
        email: this.formBuilder.control<string>('', Validators.email),
      }),
    });

  technicalAddressDetailsForm: FormGroup<AddressDetailsFormType> =
    this.formBuilder.group<AddressDetailsFormType>({
      addressSameAsMeteringPoint: this.formBuilder.control<boolean>(true),
      addressGroup: this.formBuilder.group({
        countryCode: this.formBuilder.control<string>('', Validators.required),
        streetName: this.formBuilder.control<string>('', Validators.required),
        buildingNumber: this.formBuilder.control<string>('', Validators.required),
        floor: this.formBuilder.control<string>(''),
        room: this.formBuilder.control<string>(''),
        postCode: this.formBuilder.control<string>('', Validators.required),
        cityName: this.formBuilder.control<string>('', Validators.required),
        citySubDivisionName: this.formBuilder.control<string>(''),
        streetCode: this.formBuilder.control<string>('', Validators.required),
        municipalityCode: this.formBuilder.control<string>('', [
          dhMunicipalityCodeValidator(),
          Validators.required,
        ]),
        postalDistrict: this.formBuilder.control<string>(''),
        postBox: this.formBuilder.control<string>(''),
        darReference: this.formBuilder.control<string>(''),
      }),
      addressProtection: this.formBuilder.control<boolean>(false),
    });

  private customerName1 = signal(this.privateCustomerDetailsForm.controls.customerName1.value);
  private companyName = signal(this.businessCustomerDetailsForm.controls.companyName.value);

  private legalContactSameAsCustomer = signal(
    this.legalContactDetailsForm.controls.contactSameAsCustomer.value
  );
  private technicalContactSameAsCustomer = signal(
    this.technicalContactDetailsForm.controls.contactSameAsCustomer.value
  );

  private legalAddressSameAsMeteringPoint = signal(
    this.legalAddressDetailsForm.controls.addressSameAsMeteringPoint.value
  );
  private technicalAddressSameAsMeteringPoint = signal(
    this.technicalAddressDetailsForm.controls.addressSameAsMeteringPoint.value
  );

  updateCustomerDataForm: FormGroup<CustomerCharacteristicsFormType> = this.formBuilder.group({
    businessCustomerDetails: this.businessCustomerDetailsForm,
    privateCustomerDetails: this.privateCustomerDetailsForm,
    legalContactDetails: this.legalContactDetailsForm,
    legalAddressDetails: this.legalAddressDetailsForm,
    technicalContactDetails: this.technicalContactDetailsForm,
    technicalAddressDetails: this.technicalAddressDetailsForm,
  });

  constructor() {
    this.setupContactNameEffects();
    this.setupAddressEffects();
    this.setupCustomerTypeEffect();
    this.setupFormValueChangeListeners();
  }

  private setupContactNameEffects(): void {
    effect(() => {
      const sameAsCustomer = this.legalContactSameAsCustomer();
      const isBusinessCustomer = this.isBusinessCustomer();
      const customerName = this.customerName1();
      const businessName = this.companyName();

      untracked(() => {
        if (sameAsCustomer) {
          const name = isBusinessCustomer ? businessName : customerName;
          this.legalContactDetailsForm.controls.contactGroup.controls.name.setValue(name);
          this.legalContactDetailsForm.controls.contactGroup.controls.name.disable();
        } else {
          this.legalContactDetailsForm.controls.contactGroup.controls.name.setValue('');
          this.legalContactDetailsForm.controls.contactGroup.controls.name.enable();
        }
      });
    });

    effect(() => {
      const sameAsCustomer = this.technicalContactSameAsCustomer();
      const isBusinessCustomer = this.isBusinessCustomer();
      const customerName = this.customerName1();
      const businessName = this.companyName();

      untracked(() => {
        if (sameAsCustomer) {
          const name = isBusinessCustomer ? businessName : customerName;
          this.technicalContactDetailsForm.controls.contactGroup.controls.name.setValue(name);
          this.technicalContactDetailsForm.controls.contactGroup.controls.name.disable();
        } else {
          this.technicalContactDetailsForm.controls.contactGroup.controls.name.setValue('');
          this.technicalContactDetailsForm.controls.contactGroup.controls.name.enable();
        }
      });
    });
  }

  private setupAddressEffects(): void {
    effect(() => {
      const sameAsMeteringPoint = this.legalAddressSameAsMeteringPoint();
      const hasValidAddress = this.hasValidInstallationAddress();
      const addressData = this.addressDataFromMeteringPoint();

      untracked(() => {
        if (sameAsMeteringPoint) {
          if (hasValidAddress) {
            this.legalAddressDetailsForm.controls.addressGroup.patchValue(addressData);
          }
          this.legalAddressDetailsForm.controls.addressGroup.disable();
        } else {
          this.legalAddressDetailsForm.controls.addressGroup.patchValue(this.getEmptyAddressData());
          this.legalAddressDetailsForm.controls.addressGroup.enable();
        }
      });
    });

    effect(() => {
      const sameAsMeteringPoint = this.technicalAddressSameAsMeteringPoint();
      const hasValidAddress = this.hasValidInstallationAddress();
      const addressData = this.addressDataFromMeteringPoint();

      untracked(() => {
        if (sameAsMeteringPoint) {
          if (hasValidAddress) {
            this.technicalAddressDetailsForm.controls.addressGroup.patchValue(addressData);
          }
          this.technicalAddressDetailsForm.controls.addressGroup.disable();
        } else {
          this.technicalAddressDetailsForm.controls.addressGroup.patchValue(
            this.getEmptyAddressData()
          );
          this.technicalAddressDetailsForm.controls.addressGroup.enable();
        }
      });
    });
  }

  private setupCustomerTypeEffect(): void {
    effect(() => {
      const meteringPoint = this.meteringPoint();

      if (!meteringPoint) {
        return;
      }

      const customers = meteringPoint.commercialRelation?.activeEnergySupplyPeriod?.customers ?? [];
      const customer = customers[0];

      untracked(() => {
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
    });
  }

  private setupFormValueChangeListeners(): void {
    this.privateCustomerDetailsForm.controls.customerName1.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.customerName1.set(value);
      });

    this.businessCustomerDetailsForm.controls.companyName.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.companyName.set(value);
      });

    this.legalContactDetailsForm.controls.contactSameAsCustomer.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.legalContactSameAsCustomer.set(value);
      });

    this.technicalContactDetailsForm.controls.contactSameAsCustomer.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.technicalContactSameAsCustomer.set(value);
      });

    this.legalAddressDetailsForm.controls.addressSameAsMeteringPoint.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.legalAddressSameAsMeteringPoint.set(value);
      });

    this.technicalAddressDetailsForm.controls.addressSameAsMeteringPoint.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.technicalAddressSameAsMeteringPoint.set(value);
      });
  }

  private getEmptyAddressData(): AddressData {
    return {
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
    };
  }

  async updateCustomerData() {
    const form = this.updateCustomerDataForm;
    const isCustomerInvalid = this.isBusinessCustomer()
      ? form.controls.businessCustomerDetails.invalid
      : form.controls.privateCustomerDetails.invalid;
    const isRestOfFormInvalid =
      form.controls.legalContactDetails.invalid ||
      form.controls.legalAddressDetails.invalid ||
      form.controls.technicalContactDetails.invalid ||
      form.controls.technicalAddressDetails.invalid;
    if (isCustomerInvalid || isRestOfFormInvalid) {
      return;
    }
    const input = mapChangeCustomerCharacteristicsFormToRequest(
      form,
      this.meteringPointId(),
      'UPDATE_MASTER_DATA_CONSUMER',
      false,
      this.isBusinessCustomer()
    );
    const result = await this.requestChangeCustomerCharacteristics.mutate({ variables: { input } });

    if (result.data?.changeCustomerCharacteristics.success) {
      this.success();
    } else {
      this.error();
    }
  }

  success() {
    const message = this.translocoService.translate('meteringPoint.moveIn.customerDataSuccess');
    this.wattToastService.open({ type: 'success', message });
    this.locationService.back();
  }

  error() {
    const message = this.translocoService.translate('meteringPoint.moveIn.customerDataFail');
    this.wattToastService.open({ type: 'warning', message });
    this.locationService.back();
  }

  public cancel() {
    this.locationService.back();
  }
}
