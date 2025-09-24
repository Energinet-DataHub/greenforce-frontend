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

import { MoveInContactDetailsFormType, MoveInCustomerDetailsFormType } from '../types';
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
export class DhMoveInComponent extends WattTypedModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly customerTypeInitialValue = 'private';

  private privateCustomerForm = this.fb.group({
    name1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', Validators.required),
    name2: this.fb.control<string>(''),
    cpr2: this.fb.control<string>({ value: '', disabled: true }, Validators.required),
  });

  customerDetailsForm = this.fb.group<MoveInCustomerDetailsFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    moveInType: this.fb.control<string>('', Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
    isProtectedAddress: this.fb.control<boolean>(false),
  });

  contactDetailsForm = this.fb.group<MoveInContactDetailsFormType>({
    legalContactSameAsCustomer: this.fb.control<boolean>(true),
    legalContactName: this.fb.control<string>('', [Validators.required]),
    legalContactTitle: this.fb.control<string>(''),
    legalContactPhone: this.fb.control<string>(''),
    legalContactMobile: this.fb.control<string>(''),
    legalContactEmail: this.fb.control<string>(''),
    legalAddressSameAsMeteringPoint: this.fb.control<boolean>(true),
    legalAddressStreet: this.fb.control<string>('', [Validators.required]),
    legalAddressNumber: this.fb.control<string>(''),
    legalAddressFloor: this.fb.control<string>(''),
    legalAddressDoor: this.fb.control<string>(''),
    legalAddressPostalCode: this.fb.control<string>('', [Validators.required]),
    legalAddressCity: this.fb.control<string>('', [Validators.required]),
    legalAddressCountry: this.fb.control<string>(''),
    legalAddressRoadCode: this.fb.control<string>(''),
    legalAddressPostalDistrict: this.fb.control<string>(''),
    legalAddressPostBox: this.fb.control<string>(''),
    legalAddressMunicipalityCode: this.fb.control<string>(''),
    legalAddressDarReference: this.fb.control<string>(''),
    legalNameAddressProtection: this.fb.control<boolean>(false),
    technicalContactSameAsCustomer: this.fb.control<boolean>(true),
    technicalContactName: this.fb.control<string>(''),
    technicalContactTitle: this.fb.control<string>(''),
    technicalContactPhone: this.fb.control<string>(''),
    technicalContactMobile: this.fb.control<string>(''),
    technicalContactEmail: this.fb.control<string>(''),
    technicalAddressSameAsMeteringPoint: this.fb.control<boolean>(true),
    technicalAddressStreet: this.fb.control<string>('', [Validators.required]),
    technicalAddressNumber: this.fb.control<string>(''),
    technicalAddressFloor: this.fb.control<string>(''),
    technicalAddressDoor: this.fb.control<string>(''),
    technicalAddressPostalCode: this.fb.control<string>('', [Validators.required]),
    technicalAddressCity: this.fb.control<string>('', [Validators.required]),
    technicalAddressCountry: this.fb.control<string>(''),
    technicalAddressRoadCode: this.fb.control<string>(''),
    technicalAddressPostalDistrict: this.fb.control<string>(''),
    technicalAddressPostBox: this.fb.control<string>(''),
    technicalAddressMunicipalityCode: this.fb.control<string>(''),
    technicalAddressDarReference: this.fb.control<string>(''),
    technicalNameAddressProtection: this.fb.control<boolean>(false),
  });

  private customerTypeChanged = toSignal(
    this.customerDetailsForm.controls.customerType.valueChanges,
    { initialValue: this.customerTypeInitialValue }
  );

  private name2Changed = toSignal(this.privateCustomerForm.controls.name2.valueChanges);

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

  startMoveIn() {
    console.log('Starting move-in process...');
  }
}
