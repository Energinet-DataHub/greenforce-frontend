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
import { Component, effect, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { dhCprValidator } from '@energinet-datahub/dh/shared/ui-validators';

import {
  AddressData,
  InstallationAddress,
  MoveInContactDetailsFormType,
  MoveInCustomerDetailsFormType,
} from '../types';
import { DhCustomerDetailsComponent } from './customer-details.component';
import { DhContactDetailsFormComponent } from './dh-contact-details-form.component';

@Component({
  selector: 'dh-move-in',
  imports: [
    TranslocoDirective,
    WATT_MODAL,
    WATT_STEPPER,
    DhCustomerDetailsComponent,
    DhContactDetailsFormComponent,
  ],
  templateUrl: './move-in.component.html',
})
export class DhMoveInComponent extends WattTypedModal<{ installationAddress: InstallationAddress } > {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly customerTypeInitialValue = 'private';

  private privateCustomerForm = this.fb.group({
    name1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', [Validators.required, dhCprValidator()]),
    name2: this.fb.control<string>(''),
    cpr2: this.fb.control<string>({ value: '', disabled: true }, [
      Validators.required,
      dhCprValidator(),
    ]),
  });

  customerDetailsForm = this.fb.group<MoveInCustomerDetailsFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    moveInType: this.fb.control<string>('', Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
    isProtectedAddress: this.fb.control<boolean>(false),
  });

  contactDetailsForm = this.fb.group<MoveInContactDetailsFormType>({
    legalContactSameAsCustomer: this.fb.control<boolean>(true),
    legalContactName: this.fb.control<string>({value: '', disabled: true}, [Validators.required]),
    legalContactTitle: this.fb.control<string>(''),
    legalContactPhone: this.fb.control<string>(''),
    legalContactMobile: this.fb.control<string>(''),
    legalContactEmail: this.fb.control<string>(''),
    legalAddressSameAsMeteringPoint: this.fb.control<boolean>(true),
    legalAddressGroup: this.fb.group({
      streetName: this.fb.control<string>({ value: this.modalData.installationAddress?.streetName ?? '', disabled: true}, [Validators.required]),
      buildingNumber: this.fb.control<string>({ value: this.modalData.installationAddress?.buildingNumber ?? '', disabled: true}),
      floor: this.fb.control<string>({ value: this.modalData.installationAddress?.floor ?? '', disabled: true}),
      room: this.fb.control<string>({ value: this.modalData.installationAddress?.room ?? '', disabled: true}),
      postCode: this.fb.control<string>({ value: this.modalData.installationAddress?.postCode ?? '', disabled: true}, [Validators.required]),
      cityName: this.fb.control<string>({ value: this.modalData.installationAddress?.cityName ?? '', disabled: true}, [Validators.required]),
      countryCode: this.fb.control<string>({ value: this.modalData.installationAddress?.countryCode ?? '', disabled: true}),
      streetCode: this.fb.control<string>({ value: this.modalData.installationAddress?.streetCode ?? '', disabled: true}),
      citySubdivisionName: this.fb.control<string>({ value: this.modalData.installationAddress?.citySubDivisionName ?? '', disabled: true}),
      postBox: this.fb.control<string>({ value: '', disabled: true }), // TODO: MASEP Find out if needed?
      municipalityCode: this.fb.control<string>({ value: this.modalData.installationAddress?.municipalityCode ?? '', disabled: true}),
      darReference: this.fb.control<string>({ value: this.modalData.installationAddress?.darReference ?? '', disabled: true}),
    }),
    legalNameAddressProtection: this.fb.control<boolean>(false),

    technicalContactSameAsCustomer: this.fb.control<boolean>(true),
    technicalContactName: this.fb.control<string>({value: '', disabled: true}, [Validators.required]),
    technicalContactTitle: this.fb.control<string>(''),
    technicalContactPhone: this.fb.control<string>(''),
    technicalContactMobile: this.fb.control<string>(''),
    technicalContactEmail: this.fb.control<string>(''),
    technicalAddressSameAsMeteringPoint: this.fb.control<boolean>(true),
    technicalAddressGroup: this.fb.group({
      streetName: this.fb.control<string>({ value: this.modalData.installationAddress?.streetName ?? '', disabled: true}, [Validators.required]),
      buildingNumber: this.fb.control<string>({ value: this.modalData.installationAddress?.buildingNumber ?? '', disabled: true}),
      floor: this.fb.control<string>({ value: this.modalData.installationAddress?.floor ?? '', disabled: true}),
      room: this.fb.control<string>({ value: this.modalData.installationAddress?.room ?? '', disabled: true}),
      postCode: this.fb.control<string>({ value: this.modalData.installationAddress?.postCode ?? '', disabled: true}, [Validators.required]),
      cityName: this.fb.control<string>({ value: this.modalData.installationAddress?.cityName ?? '', disabled: true}, [Validators.required]),
      countryCode: this.fb.control<string>({ value: this.modalData.installationAddress?.countryCode ?? '', disabled: true}),
      streetCode: this.fb.control<string>({ value: this.modalData.installationAddress?.streetCode ?? '', disabled: true}),
      citySubdivisionName: this.fb.control<string>({ value: this.modalData.installationAddress?.citySubDivisionName ?? '', disabled: true}),
      postBox: this.fb.control<string>({ value: '', disabled: true }), // TODO: MASEP Find out if needed?
      municipalityCode: this.fb.control<string>({ value: this.modalData.installationAddress?.municipalityCode ?? '', disabled: true}),
      darReference: this.fb.control<string>({ value: this.modalData.installationAddress?.darReference ?? '', disabled: true}),
    }),
    technicalNameAddressProtection: this.fb.control<boolean>(false),
  });

  private customerTypeChanged = toSignal(
    this.customerDetailsForm.controls.customerType.valueChanges,
    { initialValue: this.customerTypeInitialValue }
  );

  private name1Changed = toSignal(this.privateCustomerForm.controls.name1.valueChanges);
  private name2Changed = toSignal(this.privateCustomerForm.controls.name2.valueChanges);
  private legalContactSameAsCustomerChanged = toSignal(this.contactDetailsForm.controls.legalContactSameAsCustomer.valueChanges);
  private technicalContactSameAsCustomerChanged = toSignal(this.contactDetailsForm.controls.technicalContactSameAsCustomer.valueChanges);
  private legalAddressSameAsMeteringPointAddressChanged = toSignal(this.contactDetailsForm.controls.legalAddressSameAsMeteringPoint.valueChanges);
  private technicalAddressSameAsMeteringPointAddressChanged = toSignal(this.contactDetailsForm.controls.technicalAddressSameAsMeteringPoint.valueChanges);

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.customerDetailsForm.addControl('privateCustomer', this.privateCustomerForm);
      this.customerDetailsForm.removeControl('businessCustomer');
    } else {
      this.customerDetailsForm.addControl(
        'businessCustomer',
        this.fb.group({
          companyName: this.fb.control<string>(''),
          cvr: this.fb.control<string>('', Validators.required),
        })
      );

      this.customerDetailsForm.removeControl('privateCustomer');
      this.privateCustomerForm.reset();
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
        this.contactDetailsForm.controls.legalContactName.setValue(name1);
        this.contactDetailsForm.controls.technicalContactName.setValue(name1);
      }
    }
  });

  private disableNameInputFromLegalContactSameAsCustomerEffect = effect(() => {
    const legalContactSameAsCustomer = this.legalContactSameAsCustomerChanged() ?? true;
    if (legalContactSameAsCustomer) {
      this.contactDetailsForm.controls.legalContactName.disable()
      this.contactDetailsForm.controls.legalContactName.setValue(this.privateCustomerForm.controls.name1.value);
    } else {
      this.contactDetailsForm.controls.legalContactName.enable();
    }
  });

  private disableNameInputFromTechnicalContactSameAsCustomerEffect = effect(() => {
    const technicalContactSameAsCustomer = this.technicalContactSameAsCustomerChanged() ?? true;
    if (technicalContactSameAsCustomer) {
      this.contactDetailsForm.controls.technicalContactName.disable();
      this.contactDetailsForm.controls.technicalContactName.setValue(this.privateCustomerForm.controls.name1.value);
    } else {
      this.contactDetailsForm.controls.technicalContactName.enable();
    }
  });

  private disableAddressInputsFromLegalAddressSameAsMeteringPointAddressChangedEffect = effect(() => {
    const legalAddressSameAsMeteringPointAddress = this.legalAddressSameAsMeteringPointAddressChanged() ?? true;
    if (legalAddressSameAsMeteringPointAddress) {
      const addressFormData: AddressData = {
        streetCode: this.modalData.installationAddress?.streetCode ?? '',
        buildingNumber: this.modalData.installationAddress?.buildingNumber ?? '',
        floor: this.modalData.installationAddress?.floor ?? '',
        room: this.modalData.installationAddress?.room ?? '',
        postCode: this.modalData.installationAddress?.postCode ?? '',
        cityName: this.modalData.installationAddress?.cityName ?? '',
        countryCode: this.modalData.installationAddress?.countryCode ?? '',
        streetName: this.modalData.installationAddress?.streetName ?? '',
        citySubdivisionName: this.modalData.installationAddress?.citySubDivisionName ?? '',
        postBox: '',
        municipalityCode: this.modalData.installationAddress?.municipalityCode ?? '',
        darReference: this.modalData.installationAddress?.darReference ?? '',
      };
      this.setLegalAddressForm(addressFormData)
      this.contactDetailsForm.controls.legalAddressGroup.disable();
    } else {
      this.contactDetailsForm.controls.legalAddressGroup.enable();
    }
  });

  private disableAddressInputsFromTechnicalAddressSameAsMeteringPointAddressChangedEffect = effect(() => {
    const technicalAddressSameAsMeteringPointAddress = this.technicalAddressSameAsMeteringPointAddressChanged() ?? true;
    if (technicalAddressSameAsMeteringPointAddress) {
      const addressFormData: AddressData = {
        streetCode: this.modalData.installationAddress?.streetCode ?? '',
        buildingNumber: this.modalData.installationAddress?.buildingNumber ?? '',
        floor: this.modalData.installationAddress?.floor ?? '',
        room: this.modalData.installationAddress?.room ?? '',
        postCode: this.modalData.installationAddress?.postCode ?? '',
        cityName: this.modalData.installationAddress?.cityName ?? '',
        countryCode: this.modalData.installationAddress?.countryCode ?? '',
        streetName: this.modalData.installationAddress?.streetName ?? '',
        citySubdivisionName: this.modalData.installationAddress?.citySubDivisionName ?? '',
        postBox: '',
        municipalityCode: this.modalData.installationAddress?.municipalityCode ?? '',
        darReference: this.modalData.installationAddress?.darReference ?? '',
      };
      this.setTechnicalAddressForm(addressFormData);
      this.contactDetailsForm.controls.technicalAddressGroup.disable();
    } else {
      this.contactDetailsForm.controls.technicalAddressGroup.enable();
    }
  });

  private setLegalAddressForm(data: AddressData) {
    const controls = this.contactDetailsForm.controls.legalAddressGroup.controls;
    controls.streetCode.setValue(data.streetCode);
    controls.buildingNumber.setValue(data.buildingNumber);
    controls.floor.setValue(data.floor);
    controls.room.setValue(data.room);
    controls.postCode.setValue(data.postCode);
    controls.cityName.setValue(data.cityName);
    controls.countryCode.setValue(data.countryCode);
    controls.streetName.setValue(data.streetName);
    controls.citySubdivisionName.setValue(data.citySubdivisionName);
    controls.municipalityCode.setValue(data.municipalityCode);
    controls.darReference.setValue(data.darReference);
  }

  private setTechnicalAddressForm(data: AddressData) {
    const controls = this.contactDetailsForm.controls.technicalAddressGroup.controls;
    controls.streetCode.setValue(data.streetCode);
    controls.buildingNumber.setValue(data.buildingNumber);
    controls.floor.setValue(data.floor);
    controls.room.setValue(data.room);
    controls.postCode.setValue(data.postCode);
    controls.cityName.setValue(data.cityName);
    controls.countryCode.setValue(data.countryCode);
    controls.streetName.setValue(data.streetName);
    controls.citySubdivisionName.setValue(data.citySubdivisionName);
    controls.municipalityCode.setValue(data.municipalityCode);
    controls.darReference.setValue(data.darReference);
  }

  startMoveIn() {
    console.log('Starting move-in process...');
  }
}
