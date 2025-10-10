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
import { Component, effect, inject, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import {
  dhCprValidator,
  dhCvrValidator,
  dhMunicipalityCodeValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  MoveInType,
  StartMoveInDocument,
  WashInstructions,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattToastService } from '@energinet-datahub/watt/toast';

import {
  AddressData,
  ContactDetailsFormGroup,
  InstallationAddress,
  MoveInAddressDetailsFormType,
  MoveInContactDetailsFormType,
  MoveInCustomerDetailsFormType,
} from '../types';
import { DhCustomerDetailsComponent } from './customer-details.component';
import { DhContactDetailsFormComponent } from './contact-details-form.component';
import { DhAddressDetailsFormComponent } from './address-details-form.component';

@Component({
  selector: 'dh-move-in',
  imports: [
    TranslocoDirective,
    WATT_MODAL,
    WATT_STEPPER,
    DhCustomerDetailsComponent,
    DhContactDetailsFormComponent,
    DhAddressDetailsFormComponent,
  ],
  templateUrl: './move-in.component.html',
})
export class DhMoveInComponent extends WattTypedModal<{
  installationAddress: InstallationAddress;
}> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly startMoveInMutation = mutation(StartMoveInDocument);
  private readonly toastService = inject(WattToastService);

  private readonly modal = viewChild.required(WattModalComponent);

  private readonly customerTypeInitialValue = 'private';

  private readonly addressDataInitialValue: AddressData = {
    streetName: this.modalData.installationAddress?.streetName ?? '',
    buildingNumber: this.modalData.installationAddress?.buildingNumber ?? '',
    floor: this.modalData.installationAddress?.floor ?? '',
    room: this.modalData.installationAddress?.room ?? '',
    postCode: this.modalData.installationAddress?.postCode ?? '',
    cityName: this.modalData.installationAddress?.cityName ?? '',
    countryCode: this.modalData.installationAddress?.countryCode ?? '',
    streetCode: this.modalData.installationAddress?.streetCode ?? '',
    citySubdivisionName: this.modalData.installationAddress?.citySubDivisionName ?? '',
    postBox: '',
    municipalityCode: this.modalData.installationAddress?.municipalityCode ?? '',
    darReference: this.modalData.installationAddress?.darReference ?? '',
  };

  private privateCustomerForm = this.fb.group({
    name1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', [Validators.required, dhCprValidator()]),
    name2: this.fb.control<string>(''),
    cpr2: this.fb.control<string>({ value: '', disabled: true }, [
      Validators.required,
      dhCprValidator(),
    ]),
  });

  moveInLoading = this.startMoveInMutation.loading;

  customerDetailsForm = this.fb.group<MoveInCustomerDetailsFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    moveInType: this.fb.control<MoveInType | null>(null, Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
    isProtectedAddress: this.fb.control<boolean>(false),
  });

  contactDetailsForm = this.fb.group<MoveInContactDetailsFormType>({
    legalContactSameAsCustomer: this.fb.control<boolean>(true),
    legalContactGroup: this.fb.group<ContactDetailsFormGroup>({
      name: this.fb.control<string>({ value: '', disabled: true }, Validators.required),
      title: this.fb.control<string>(''),
      phone: this.fb.control<string>(''),
      mobile: this.fb.control<string>(''),
      email: this.fb.control<string>('', Validators.email),
    }),
    technicalContactSameAsLegal: this.fb.control<boolean>(true),
    technicalContactGroup: this.fb.group<ContactDetailsFormGroup>({
      name: this.fb.control<string>({ value: '', disabled: true }, [Validators.required]),
      title: this.fb.control<string>(''),
      phone: this.fb.control<string>(''),
      mobile: this.fb.control<string>(''),
      email: this.fb.control<string>('', Validators.email),
    }),
  });

  readonly isForeignCompanyFormControl = this.fb.control<boolean>(false);

  addressDetailsForm = this.fb.group<MoveInAddressDetailsFormType>({
    legalAddressSameAsMeteringPoint: this.fb.control<boolean>(true),
    legalAddressGroup: this.fb.group({
      streetName: this.fb.control<string>(
        this.addressDataInitialValue.streetName,
        Validators.required
      ),
      buildingNumber: this.fb.control<string>(this.addressDataInitialValue.buildingNumber),
      floor: this.fb.control<string>(this.addressDataInitialValue.floor),
      room: this.fb.control<string>(this.addressDataInitialValue.room),
      postCode: this.fb.control<string>(this.addressDataInitialValue.postCode, Validators.required),
      cityName: this.fb.control<string>(this.addressDataInitialValue.cityName, Validators.required),
      countryCode: this.fb.control<string>(this.addressDataInitialValue.countryCode),
      streetCode: this.fb.control<string>(this.addressDataInitialValue.streetCode),
      citySubdivisionName: this.fb.control<string>(
        this.addressDataInitialValue.citySubdivisionName
      ),
      postBox: this.fb.control<string>(this.addressDataInitialValue.postBox), // TODO: MASEP Find out if needed?
      municipalityCode: this.fb.control<string>(
        this.addressDataInitialValue.municipalityCode,
        dhMunicipalityCodeValidator()
      ),
      darReference: this.fb.control<string>(this.addressDataInitialValue.darReference),
    }),
    legalNameAddressProtection: this.fb.control<boolean>(false),
    technicalAddressSameAsLegal: this.fb.control<boolean>(true),
    technicalAddressGroup: this.fb.group({
      streetName: this.fb.control<string>(
        this.addressDataInitialValue.streetName,
        Validators.required
      ),
      buildingNumber: this.fb.control<string>(this.addressDataInitialValue.buildingNumber),
      floor: this.fb.control<string>(this.addressDataInitialValue.floor),
      room: this.fb.control<string>(this.addressDataInitialValue.room),
      postCode: this.fb.control<string>(this.addressDataInitialValue.postCode, Validators.required),
      cityName: this.fb.control<string>(this.addressDataInitialValue.cityName, Validators.required),
      countryCode: this.fb.control<string>(this.addressDataInitialValue.countryCode),
      streetCode: this.fb.control<string>(this.addressDataInitialValue.streetCode),
      citySubdivisionName: this.fb.control<string>(
        this.addressDataInitialValue.citySubdivisionName
      ),
      postBox: this.fb.control<string>(this.addressDataInitialValue.postBox), // TODO: MASEP Find out if needed?
      municipalityCode: this.fb.control<string>(
        this.addressDataInitialValue.municipalityCode,
        dhMunicipalityCodeValidator()
      ),
      darReference: this.fb.control<string>(this.addressDataInitialValue.darReference),
    }),
    technicalNameAddressProtection: this.fb.control<boolean>(false),
  });

  private customerTypeChanged = toSignal(
    this.customerDetailsForm.controls.customerType.valueChanges,
    { initialValue: this.customerTypeInitialValue }
  );

  private isForeignCompanyChanged = toSignal<boolean>(
    this.isForeignCompanyFormControl.valueChanges
  );

  private name1Changed = toSignal(this.privateCustomerForm.controls.name1.valueChanges);
  private name2Changed = toSignal(this.privateCustomerForm.controls.name2.valueChanges);

  private legalContactSameAsCustomerChanged = toSignal(
    this.contactDetailsForm.controls.legalContactSameAsCustomer.valueChanges
  );
  private technicalContactSameAsLegalChanged = toSignal(
    this.contactDetailsForm.controls.technicalContactSameAsLegal.valueChanges
  );
  private legalContactDetailsFormChanged = toSignal(
    this.contactDetailsForm.controls.legalContactGroup.valueChanges
  );
  private legalAddressSameAsMeteringPointAddressChanged = toSignal(
    this.addressDetailsForm.controls.legalAddressSameAsMeteringPoint.valueChanges
  );
  private technicalAddressSameAsLegalChanged = toSignal(
    this.addressDetailsForm.controls.technicalAddressSameAsLegal.valueChanges
  );
  private legalAddressGroupChanged = toSignal(
    this.addressDetailsForm.controls.legalAddressGroup.valueChanges
  );

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.customerDetailsForm.addControl('privateCustomer', this.privateCustomerForm);
      this.customerDetailsForm.removeControl('businessCustomer');
    } else {
      this.customerDetailsForm.addControl(
        'businessCustomer',
        this.fb.group({
          companyName: this.fb.control<string>('', Validators.required),
          cvr: this.fb.control<string>('', [Validators.required, dhCvrValidator()]),
          isForeignCompany: this.isForeignCompanyFormControl,
        })
      );

      this.customerDetailsForm.removeControl('privateCustomer');
      this.privateCustomerForm.reset();
    }
  });

  private isForeignCompanyEffect = effect(() => {
    const isForeignCompany = this.isForeignCompanyChanged();
    if (isForeignCompany) {
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.disable();
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.setValue('11111111');
    } else {
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.enable();
      this.customerDetailsForm.controls.businessCustomer?.controls.cvr.reset();
    }
  });

  private name2Effect = effect(() => {
    const name2 = this.name2Changed();
    const cpr2Control = this.privateCustomerForm.controls.cpr2;

    if (name2) {
      cpr2Control.enable();
    } else {
      cpr2Control.disable();
      cpr2Control.reset();
    }
  });

  private syncContactNameEffect = effect(() => {
    // Only proceed if the checkbox is checked
    if (this.contactDetailsForm.controls.legalContactSameAsCustomer.value) {
      const name1 = this.name1Changed();

      if (name1 !== undefined) {
        this.contactDetailsForm.controls.legalContactGroup.controls.name.setValue(name1);
      }
    }
  });

  private legalContactSameAsCustomerEffect = effect(() => {
    const legalContactSameAsCustomer = this.legalContactSameAsCustomerChanged() ?? true;
    if (legalContactSameAsCustomer) {
      this.contactDetailsForm.controls.legalContactGroup.controls.name.disable();
      this.contactDetailsForm.controls.legalContactGroup.controls.name.reset(
        this.privateCustomerForm.controls.name1.value
      );
    } else {
      this.contactDetailsForm.controls.legalContactGroup.controls.name.enable();
    }
  });

  private technicalContactSameAsCustomerEffect = effect(() => {
    const technicalContactSameAsLegal = this.technicalContactSameAsLegalChanged() ?? true;
    if (technicalContactSameAsLegal) {
      this.contactDetailsForm.controls.technicalContactGroup.disable();
      this.contactDetailsForm.controls.technicalContactGroup.reset(
        {
          name: this.contactDetailsForm.controls.legalContactGroup.controls.name.value,
          title: this.contactDetailsForm.controls.legalContactGroup.controls.title.value,
          phone: this.contactDetailsForm.controls.legalContactGroup.controls.phone.value,
          mobile: this.contactDetailsForm.controls.legalContactGroup.controls.mobile.value,
          email: this.contactDetailsForm.controls.legalContactGroup.controls.email.value,
        }
      );
    } else {
      this.contactDetailsForm.controls.technicalContactGroup.enable();
    }
  });

  private legalContactDetailsFormChangedEffect = effect(() => {
    const legalContactDetailsFormValueChange = this.legalContactDetailsFormChanged();
    if (
      legalContactDetailsFormValueChange &&
      this.contactDetailsForm.controls.technicalContactSameAsLegal.value
    ) {
      this.contactDetailsForm.controls.technicalContactGroup.reset(
        {
          name: this.contactDetailsForm.controls.legalContactGroup.controls.name.value,
          title: this.contactDetailsForm.controls.legalContactGroup.controls.title.value,
          phone: this.contactDetailsForm.controls.legalContactGroup.controls.phone.value,
          mobile: this.contactDetailsForm.controls.legalContactGroup.controls.mobile.value,
          email: this.contactDetailsForm.controls.legalContactGroup.controls.email.value,
        }
      );
    }
  });

  private legalAddressSameAsMeteringPointAddressChangedEffect = effect(() => {
    const legalAddressSameAsMeteringPointAddress =
      this.legalAddressSameAsMeteringPointAddressChanged() ?? true;

    if (legalAddressSameAsMeteringPointAddress) {
      this.resetLegalAddressFormGroup(this.addressDataInitialValue);
      this.addressDetailsForm.controls.legalAddressGroup.disable();
    } else {
      this.addressDetailsForm.controls.legalAddressGroup.enable();
    }
  });

  private technicalAddressSameAsLegalChangedEffect = effect(() => {
    const technicalAddressSameAsLegal = this.technicalAddressSameAsLegalChanged() ?? true;

    if (technicalAddressSameAsLegal) {
      this.addressDetailsForm.controls.technicalAddressGroup.reset(
        this.addressDetailsForm.controls.legalAddressGroup.value
      );
      this.addressDetailsForm.controls.technicalAddressGroup.disable();
    } else {
      this.addressDetailsForm.controls.technicalAddressGroup.enable();
    }
  });

  private legalAddressGroupChangedEffect = effect(() => {
    const legalAddressGroupValue = this.legalAddressGroupChanged();
    if (
      legalAddressGroupValue &&
      this.addressDetailsForm.controls.technicalAddressSameAsLegal.value
    ) {
      this.addressDetailsForm.controls.technicalAddressGroup.reset(
        this.addressDetailsForm.controls.legalAddressGroup.value
      );
    }
  });

  private resetLegalAddressFormGroup(data: AddressData) {
    this.addressDetailsForm.controls.legalAddressGroup.reset(data);
  }

  async startMoveIn() {
    if (
      this.customerDetailsForm.invalid ||
      this.contactDetailsForm.invalid ||
      this.addressDetailsForm.invalid
    ) {
      return;
    }

    const { cutOffDate, moveInType } = this.customerDetailsForm.getRawValue();

    if (!moveInType) return;

    const result = await this.startMoveInMutation.mutate({
      variables: {
        input: {
          cutOffDate: cutOffDate.toISOString(),
          moveInType,
          customerType: '',
          privateCustomerName1: '',
          privateCustomerCpr1: '',
          privateCustomerName2: '',
          privateCustomerCpr2: '',
          businessCustomerCompanyName: '',
          businessCustomerCvr: '',
          customerIsProtectedAddress: false,
          legalContactDetails: {
            name: '',
            attention: '',
            phone: '',
            mobile: '',
            email: '',
          },
          legalAddress: {
            streetName: '',
            buildingNumber: '',
            floor: '',
            room: '',
            postCode: '',
            cityName: '',
            countryCode: '',
            streetCode: '',
            postBox: '',
            municipalityCode: '',
            darReference: '',
            citySubDivisionName: '',
            washInstructions: WashInstructions.Washable,
          },
          technicalContactDetails: {
            name: '',
            attention: '',
            phone: '',
            mobile: '',
            email: '',
          },
          technicalAddress: {
            streetName: '',
            buildingNumber: '',
            floor: '',
            room: '',
            postCode: '',
            cityName: '',
            countryCode: '',
            streetCode: '',
            postBox: '',
            municipalityCode: '',
            darReference: '',
            citySubDivisionName: '',
            washInstructions: WashInstructions.Washable,
          },
        },
      },
    });

    if (result.data?.startMoveIn.success) {
      this.success();
    }
  }

  private success() {
    const message = this.transloco.translate('meteringPoint.moveIn.success');

    this.toastService.open({ type: 'success', message });
    this.modal().close(true);
  }
}
