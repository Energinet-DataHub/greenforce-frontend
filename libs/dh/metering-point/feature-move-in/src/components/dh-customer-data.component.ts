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
import { Component, effect, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  dhMunicipalityCodeValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  StartMoveInDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattToastService } from '@energinet/watt/toast';

import {
  AddressData,
  ContactDetailsFormGroup,
  MoveInAddressDetailsFormType,
  MoveInContactDetailsFormType,
} from '../types';
import { DhContactDetailsFormComponent } from './dh-contact-details-form.component';
import { DhAddressDetailsFormComponent } from './dh-address-details-form.component';
import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VaterStackComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-customer-data',
  imports: [
    TranslocoDirective,
    DhContactDetailsFormComponent,
    WattButtonComponent,
    DhAddressDetailsFormComponent,
    WATT_CARD,
    VaterStackComponent,
  ],
  template: `
    <form *transloco="let t; prefix: 'meteringPoint.moveIn'">
      <watt-card>
        <dh-contact-details-form [contactDetailsForm]="contactDetailsForm" />
        <dh-address-details-form [addressDetailsForm]="addressDetailsForm" />
        <vater-stack direction="row" justify="end">
        <watt-button variant="secondary" (click)="cancel()">{{ t('cancel') }}</watt-button>
        <watt-button type="submit" variant="secondary" (click)="updateCustomerData()"
        >{{ t('send') }}
        </watt-button>
      </vater-stack>
      </watt-card>
    </form>
  `,
})
export class DhCustomerDataComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly startMoveInMutation = mutation(StartMoveInDocument);
  private readonly toastService = inject(WattToastService);
  private location = inject(Location);

  addressData = input<AddressData>();

  private readonly addressDataInitialValue: AddressData = {
    streetName: this.addressData()?.streetName ?? '',
    buildingNumber: this.addressData()?.buildingNumber ?? '',
    floor: this.addressData()?.floor ?? '',
    room: this.addressData()?.room ?? '',
    postCode: this.addressData()?.postCode ?? '',
    cityName: this.addressData()?.cityName ?? '',
    countryCode: this.addressData()?.countryCode ?? '',
    streetCode: this.addressData()?.streetCode ?? '',
    citySubDivisionName: this.addressData()?.citySubDivisionName ?? '',
    postBox: '',
    municipalityCode: this.addressData()?.municipalityCode ?? '',
    darReference: this.addressData()?.darReference ?? '',
  };

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
      citySubDivisionName: this.fb.control<string>(
        this.addressDataInitialValue.citySubDivisionName
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
      citySubDivisionName: this.fb.control<string>(
        this.addressDataInitialValue.citySubDivisionName
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

  private technicalContactSameAsCustomerEffect = effect(() => {
    const technicalContactSameAsLegal = this.technicalContactSameAsLegalChanged() ?? true;
    if (technicalContactSameAsLegal) {
      this.contactDetailsForm.controls.technicalContactGroup.disable();
      this.contactDetailsForm.controls.technicalContactGroup.reset({
        name: this.contactDetailsForm.controls.legalContactGroup.controls.name.value,
        title: this.contactDetailsForm.controls.legalContactGroup.controls.title.value,
        phone: this.contactDetailsForm.controls.legalContactGroup.controls.phone.value,
        mobile: this.contactDetailsForm.controls.legalContactGroup.controls.mobile.value,
        email: this.contactDetailsForm.controls.legalContactGroup.controls.email.value,
      });
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
      this.contactDetailsForm.controls.technicalContactGroup.reset({
        name: this.contactDetailsForm.controls.legalContactGroup.controls.name.value,
        title: this.contactDetailsForm.controls.legalContactGroup.controls.title.value,
        phone: this.contactDetailsForm.controls.legalContactGroup.controls.phone.value,
        mobile: this.contactDetailsForm.controls.legalContactGroup.controls.mobile.value,
        email: this.contactDetailsForm.controls.legalContactGroup.controls.email.value,
      });
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

  updateCustomerData() {
    const message = this.transloco.translate('meteringPoint.moveIn.customerDataSuccess');
    this.toastService.open({ type: 'success', message });
  }

  cancel() {
    this.location.back();
  }
}
