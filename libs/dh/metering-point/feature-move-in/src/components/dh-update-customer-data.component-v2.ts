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
import { JsonPipe, Location } from '@angular/common';
import {
  Component,
  computed,
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
import { dhFormControlToSignal, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { createCustomerContactDetailsForm } from '../util/create-customer-contact-details-form';
import { createContactAddressDetailsForm } from '../util/create-contact-address-details-form';
import { dhAppEnvironmentToken } from 'libs/dh/shared/environments/src/lib/app-environment/dh-app-environment';
import { name } from '@azure/msal-angular/packageMetadata';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

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
    WattSpinnerComponent,
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
      margin-top: var(--watt-space-m);
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
      [formGroup]="this.form()"
      (ngSubmit)="updateCustomerData()"
      *transloco="let t; prefix: 'meteringPoint.moveIn'"
    >
      <watt-card class="sticky-header">
        <vater-stack class="margin-medium" direction="row" justify="space-between">
          <vater-stack direction="row" gap="m">
            <h3>{{ t('updateCustomerData') }}</h3>
            @if (loading()) {
              <watt-spinner [diameter]="22" />
            }
          </vater-stack>
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
              [businessCustomerFormGroup]="this.form().controls.businessCustomerDetails"
            />
          } @else {
            <dh-private-customer-details
              [privateCustomerFormGroup]="this.form().controls.privateCustomerDetails"
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
            [contactDetailsFormGroup]="this.form().controls.legalContactDetails"
          />
          <dh-customer-address-details
            [addressDetailsFormGroup]="this.form().controls.legalContactAddressDetails"
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
            [contactDetailsFormGroup]="this.form().controls.technicalContactDetails"
          />
          <dh-customer-address-details
            [addressDetailsFormGroup]="this.form().controls.technicalContactAddressDetails"
          />
        </watt-card>
      </vater-flex>
    </form>
  `,
})
export class DhUpdateCustomerDataComponent {
  private readonly actor = inject(DhActorStorage).getSelectedActor();
  private readonly appEnv = inject(dhAppEnvironmentToken).current;
  private readonly query = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      actorGln: this.actor.gln,
    },
  }));
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

  loading = this.query.loading;
  isBusinessCustomer = computed(() => this.legalCustomer()?.cvr !== null);
  meteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  form = computed(
    () =>
      new FormGroup({
        businessCustomerDetails: new FormGroup({
          companyName: dhMakeFormControl<string>(
            this.legalCustomer()?.name ?? '',
            Validators.required
          ),
          cvr: dhMakeFormControl<string>(this.legalCustomer()?.cvr ?? '', [
            Validators.required,
            dhMoveInCvrValidator(this.appEnv),
          ]),
          nameProtection: dhMakeFormControl<boolean>(
            this.legalCustomer()?.isProtectedName ?? false
          ),
        }),
        privateCustomerDetails: new FormGroup({
          customerName1: dhMakeFormControl<string>(
            this.legalCustomer()?.name ?? '',
            Validators.required
          ),
          cpr1: dhMakeFormControl<string>('', [Validators.required, dhCprValidator()]),
          customerName2: dhMakeFormControl<string>(this.secondaryCustomer()?.name ?? ''),
          cpr2: dhMakeFormControl<string>('', [Validators.required, dhCprValidator()]),
          nameProtection: dhMakeFormControl<boolean>(
            this.secondaryCustomer()?.isProtectedName ?? false
          ),
        }),
        legalContactDetails: createCustomerContactDetailsForm(
          this.legalCustomer(),
          this.legalCustomer()?.legalContact
        ),
        legalContactAddressDetails: createContactAddressDetailsForm(
          this.legalCustomer()?.legalContact,
          this.installationAddress()
        ),
        technicalContactDetails: createCustomerContactDetailsForm(
          this.technicalCustomer(),
          this.technicalCustomer()?.technicalContact
        ),
        technicalContactAddressDetails: createContactAddressDetailsForm(
          this.technicalCustomer()?.technicalContact,
          this.installationAddress()
        ),
      })
  );

  async updateCustomerData() {}

  cancel() {
    // this.locationService.back();
  }
}
