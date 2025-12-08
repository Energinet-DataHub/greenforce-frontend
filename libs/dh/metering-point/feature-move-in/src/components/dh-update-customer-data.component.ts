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
import { Component, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

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
  AddressDetailsFormType,
  ContactDetailsFormGroup,
  ContactDetailsFormType,
} from '../types';
import { WATT_CARD } from '@energinet/watt/card';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { DhContactDetailsFormComponent } from './dh-contact-details-form.component';
import { DhAddressDetailsFormComponent } from './dh-address-details-form.component';
import { WattButtonComponent } from '@energinet/watt/button';

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
  ],
  styles: `
    .sticky-header {
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .margin-medium {
      margin: 0 var(--watt-space-m) 0 var(--watt-space-m)
    }

    .form-container {
      margin: var(--watt-space-m);
      flex: 1 1 0;
      min-height: 0;
      overflow: auto;
    }
  `,
  template: `
    <form *transloco="let t; prefix: 'meteringPoint.moveIn'">
      <watt-card class="sticky-header">
        <vater-stack class="margin-medium" direction="row" justify="space-between">
          <h3>{{ t('updateCustomerData')}}</h3>
          <vater-stack direction="row" gap="m">
            <watt-button (click)="cancel()" variant="secondary">{{ t('cancel') }}</watt-button>
            <watt-button>{{ t('updateCustomerData')}}</watt-button>
          </vater-stack>
        </vater-stack>
      </watt-card>
      <vater-flex direction="row" gap="m" class="form-container">
        <watt-card>
          <!-- Legal -->
          <watt-card-title>
            <h3>
              {{ t('steps.contactDetails.legalContactSection') }}
            </h3>
          </watt-card-title>
          <dh-contact-details-form [contactDetailsForm]="legalContactDetailsForm" />
          <dh-address-details-form [addressDetailsForm]="legalAddressDetailsForm" />
        </watt-card>
        <watt-card>
          <!-- Technical -->
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
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly startMoveInMutation = mutation(StartMoveInDocument);
  private readonly toastService = inject(WattToastService);
  private location = inject(Location);

  addressData = input<AddressData>();

  public updateCustomerData() {
    const message = this.transloco.translate('meteringPoint.moveIn.customerDataSuccess');
    this.toastService.open({ type: 'success', message });
  }

  public cancel() {
    this.location.back();
  }

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

  legalContactDetailsForm = this.fb.group<ContactDetailsFormType>({
    contactSameAsCustomer: this.fb.control<boolean>(true),
    contactGroup: this.fb.group<ContactDetailsFormGroup>({
      name: this.fb.control<string>({ value: '', disabled: true }, Validators.required),
      title: this.fb.control<string>(''),
      phone: this.fb.control<string>(''),
      mobile: this.fb.control<string>(''),
      email: this.fb.control<string>('', Validators.email),
    }),
  });

  technicalContactDetailsForm = this.fb.group<ContactDetailsFormType>({
    contactSameAsCustomer: this.fb.control<boolean>(true),
    contactGroup: this.fb.group<ContactDetailsFormGroup>({
      name: this.fb.control<string>({ value: '', disabled: true }, Validators.required),
      title: this.fb.control<string>(''),
      phone: this.fb.control<string>(''),
      mobile: this.fb.control<string>(''),
      email: this.fb.control<string>('', Validators.email),
    }),
  });

  legalAddressDetailsForm = this.fb.group<AddressDetailsFormType>({
    addressSameAsMeteringPoint: this.fb.control<boolean>(true),
    addressGroup: this.fb.group({
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
    nameAddressProtection: this.fb.control<boolean>(false),
  });

  technicalAddressDetailsForm = this.fb.group<AddressDetailsFormType>({
    addressSameAsMeteringPoint: this.fb.control<boolean>(true),
    addressGroup: this.fb.group({
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
    nameAddressProtection: this.fb.control<boolean>(false),
  });
}
