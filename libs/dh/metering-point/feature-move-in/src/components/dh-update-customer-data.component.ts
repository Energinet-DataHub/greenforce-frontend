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
  dhCprValidator,
  dhMunicipalityCodeValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { WattToastService } from '@energinet/watt/toast';

import {
  AddressDetailsFormType,
  BusinessCustomerFormGroup,
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
    DhPrivateCustomerDetailsFormComponent
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
            <dh-business-customer-details-form [businessCustomerFormGroup]="businessCustomerDetailsForm" />
          } @else {
            <dh-private-customer-details-form [privateCustomerFormGroup]="privateCustomerDetailsForm" />
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
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);
  private location = inject(Location);

  isBusinessCustomer = input<boolean>(false);

  public updateCustomerData() {
    const message = this.transloco.translate('meteringPoint.moveIn.customerDataSuccess');
    this.toastService.open({ type: 'success', message });
    this.location.back();
  }

  public cancel() {
    this.location.back();
  }

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
      streetName: this.fb.control<string>('', Validators.required),
      buildingNumber: this.fb.control<string>(''),
      floor: this.fb.control<string>(''),
      room: this.fb.control<string>(''),
      postCode: this.fb.control<string>('', Validators.required),
      cityName: this.fb.control<string>('', Validators.required),
      countryCode: this.fb.control<string>(''),
      streetCode: this.fb.control<string>(''),
      citySubDivisionName: this.fb.control<string>(''),
      postalDistrict: this.fb.control<string>(''),
      postBox: this.fb.control<string>(''), // TODO: MASEP Find out if needed?
      municipalityCode: this.fb.control<string>('', dhMunicipalityCodeValidator()),
      darReference: this.fb.control<string>(''),
    }),
    nameAddressProtection: this.fb.control<boolean>(false),
  });

  technicalAddressDetailsForm = this.fb.group<AddressDetailsFormType>({
    addressSameAsMeteringPoint: this.fb.control<boolean>(true),
    addressGroup: this.fb.group({
      streetName: this.fb.control<string>('', Validators.required),
      buildingNumber: this.fb.control<string>(''),
      floor: this.fb.control<string>(''),
      room: this.fb.control<string>(''),
      postCode: this.fb.control<string>('', Validators.required),
      cityName: this.fb.control<string>('', Validators.required),
      countryCode: this.fb.control<string>(''),
      streetCode: this.fb.control<string>(''),
      citySubDivisionName: this.fb.control<string>(''),
      postalDistrict: this.fb.control<string>(''),
      postBox: this.fb.control<string>(''),
      municipalityCode: this.fb.control<string>('', dhMunicipalityCodeValidator()),
      darReference: this.fb.control<string>(''),
    }),
    nameAddressProtection: this.fb.control<boolean>(false),
  });

  businessCustomerDetailsForm = this.fb.group<BusinessCustomerFormGroup>({
    companyName: this.fb.control<string>('', Validators.required),
    cvr: this.fb.control<string>('', Validators.required),
  });

  privateCustomerDetailsForm = this.fb.group<PrivateCustomerFormGroup>({
    customerName1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', [Validators.required, dhCprValidator]),
    customerName2: this.fb.control<string>(''),
    cpr2: this.fb.control<string>('', dhCprValidator),
  });
}
