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
import { Component, computed, effect, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { dhCprValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import {
  injectToast,
  dhMakeFormControl,
  dhFormControlToSignal,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/shared/ui-util';

import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';

import {
  AddressTypeV1,
  GetMeteringPointByIdDocument,
  ChangeCustomerCharacteristicsBusinessReason,
  RequestChangeCustomerCharacteristicsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { sync } from '../util/sync-controls';
import { DhContactDetailsComponent } from './dh-contact-details.component';
import { dhMoveInCvrValidator } from '../validators/dh-move-in-cvr.validator';
import { mapUsagePointLocation } from '../util/map-usage-point-location';
import { DhPrivateCustomerDetailsComponent } from './dh-private-customer-details.component';
import { DhCustomerAddressDetailsComponent } from './dh-customer-address-details.component';
import { createContactAddressDetailsForm } from '../util/create-contact-address-details-form';
import { createCustomerContactDetailsForm } from '../util/create-customer-contact-details-form';
import { DhBusinessCustomerDetailsFormComponent } from './dh-business-customer-details-form.component';
import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { Router } from '@angular/router';

@Component({
  selector: 'dh-update-customer-data',
  imports: [
    TranslocoDirective,
    WATT_CARD,
    VaterFlexComponent,
    WattButtonComponent,
    ReactiveFormsModule,
    WattSpinnerComponent,
    VaterStackComponent,
    DhContactDetailsComponent,
    DhCustomerAddressDetailsComponent,
    DhPrivateCustomerDetailsComponent,
    DhBusinessCustomerDetailsFormComponent,
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
            @if (query.loading()) {
              <watt-spinner [diameter]="22" />
            }
          </vater-stack>
          <vater-stack direction="row" gap="m">
            <watt-button (click)="navigate('..')" variant="secondary">{{
              t('cancel')
            }}</watt-button>
            <watt-button type="submit" [loading]="requestChangeCustomerCharacteristics.loading()">{{
              t('updateCustomerData')
            }}</watt-button>
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
  private readonly router = inject(Router);
  private readonly actor = inject(DhActorStorage).getSelectedActor();
  private readonly appEnv = inject(dhAppEnvironmentToken).current;
  private readonly toast = injectToast('meteringPoint.moveIn.updateCustomer.toast');
  private readonly effectToast = effect(() =>
    this.toast(this.requestChangeCustomerCharacteristics.status())
  );
  requestChangeCustomerCharacteristics = mutation(RequestChangeCustomerCharacteristicsDocument);
  query = query(GetMeteringPointByIdDocument, () => ({
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
  private readonly technicalContact = computed(() => this.technicalCustomer()?.technicalContact);
  private readonly legalContact = computed(() => this.legalCustomer()?.legalContact);

  navigate = injectRelativeNavigate();
  isBusinessCustomer = computed(() => this.legalCustomer()?.cvr !== null);
  meteringPointId = input.required<string>();
  internalMeteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  form = computed(
    () =>
      new FormGroup({
        businessCustomerDetails: new FormGroup({
          companyName: dhMakeFormControl<string>(
            this.legalCustomer()?.name ?? '',
            this.isBusinessCustomer() ? [Validators.required] : []
          ),
          cvr: dhMakeFormControl<string>(
            this.legalCustomer()?.cvr ?? '',
            this.isBusinessCustomer()
              ? [Validators.required, dhMoveInCvrValidator(this.appEnv)]
              : []
          ),
          nameProtection: dhMakeFormControl<boolean>(
            this.legalCustomer()?.isProtectedName ?? false
          ),
        }),
        privateCustomerDetails: new FormGroup({
          customerName1: dhMakeFormControl<string>(
            this.legalCustomer()?.name ?? '',
            !this.isBusinessCustomer() ? [Validators.required] : []
          ),
          cpr1: dhMakeFormControl<string>(
            '',
            !this.isBusinessCustomer() ? [Validators.required, dhCprValidator()] : []
          ),
          customerName2: dhMakeFormControl<string>(this.secondaryCustomer()?.name ?? ''),
          cpr2: dhMakeFormControl<string>(
            '',
            !this.isBusinessCustomer() ? [Validators.required, dhCprValidator()] : []
          ),
          nameProtection: dhMakeFormControl<boolean>(
            this.secondaryCustomer()?.isProtectedName ?? false
          ),
        }),
        legalContactDetails: createCustomerContactDetailsForm(
          this.legalCustomer(),
          this.legalContact()
        ),
        legalContactAddressDetails: createContactAddressDetailsForm(
          this.legalContact(),
          this.installationAddress()
        ),
        technicalContactDetails: createCustomerContactDetailsForm(
          this.legalCustomer(),
          this.technicalContact()
        ),
        technicalContactAddressDetails: createContactAddressDetailsForm(
          this.technicalContact(),
          this.installationAddress()
        ),
      })
  );

  private readonly legalCustomerNameChanged = dhFormControlToSignal(
    () => this.form().controls.privateCustomerDetails.controls.customerName1
  );

  /** Sync technical */
  private readonly technicalNameSameAsContactNameToggle = dhFormControlToSignal(
    () => this.form().controls.technicalContactDetails.controls.contactSameAsCustomer
  );

  private readonly syncTechnicalContactName = effect(() => {
    const technicalNameSameAsContactName = this.technicalNameSameAsContactNameToggle();
    const legalCustomerName = this.legalCustomerNameChanged();
    const control =
      this.form().controls.technicalContactDetails.controls.contactGroup.controls.name;
    sync(
      control,
      technicalNameSameAsContactName ? legalCustomerName : this.technicalContact()?.name,
      technicalNameSameAsContactName
    );
  });

  private readonly technicalAddressSameAsInstallationToggle = dhFormControlToSignal(
    () => this.form().controls.technicalContactAddressDetails.controls.addressSameAsInstallation
  );

  private readonly syncTechnicalContactAddress = effect(() => {
    const technicalAddressSameAsInstallation = this.technicalAddressSameAsInstallationToggle();
    const addressGroup = this.form().controls.technicalContactAddressDetails.controls.addressGroup;
    const contact = this.technicalContact();
    const installationAddress = this.installationAddress();

    sync(
      addressGroup,
      technicalAddressSameAsInstallation ? installationAddress : contact,
      technicalAddressSameAsInstallation
    );
  });

  /** Sync legal */
  private readonly legalNameSameAsContactNameToggle = dhFormControlToSignal(
    () => this.form().controls.legalContactDetails.controls.contactSameAsCustomer
  );

  private readonly syncLegalContactName = effect(() => {
    const legalNameSameAsContactName = this.legalNameSameAsContactNameToggle();
    const legalCustomerName = this.legalCustomerNameChanged();
    const control = this.form().controls.legalContactDetails.controls.contactGroup.controls.name;
    sync(
      control,
      legalNameSameAsContactName ? legalCustomerName : this.legalContact()?.name,
      legalNameSameAsContactName
    );
  });

  private readonly legalAddressSameAsInstallationToggle = dhFormControlToSignal(
    () => this.form().controls.legalContactAddressDetails.controls.addressSameAsInstallation
  );

  private readonly syncLegalContactAddress = effect(() => {
    const legalAddressSameAsInstallation = this.legalAddressSameAsInstallationToggle();
    const addressGroup = this.form().controls.legalContactAddressDetails.controls.addressGroup;
    const contact = this.legalContact();
    const installationAddress = this.installationAddress();

    sync(
      addressGroup,
      legalAddressSameAsInstallation ? installationAddress : contact,
      legalAddressSameAsInstallation
    );
  });

  async updateCustomerData() {
    if (this.form().invalid) return;

    const values = this.form().getRawValue();

    const { cpr1, cpr2, customerName1, customerName2, nameProtection } =
      values.privateCustomerDetails;
    const { companyName, cvr } = values.businessCustomerDetails;
    const legalContactDetails = values.legalContactDetails;
    const legalContactAddressDetails = values.legalContactAddressDetails;
    const technicalContactDetails = values.technicalContactDetails;
    const technicalContactAddressDetails = values.technicalContactAddressDetails;

    await this.requestChangeCustomerCharacteristics.mutate({
      variables: {
        input: {
          meteringPointId: this.meteringPointId(),
          businessReason: ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer,
          electricalHeating: this.query.data()?.meteringPoint.haveElectricalHeating ?? false,
          firstCustomerCpr: !this.isBusinessCustomer() ? cpr1 : undefined,
          secondCustomerCpr: !this.isBusinessCustomer() ? cpr2 : undefined,
          firstCustomerName: !this.isBusinessCustomer() ? customerName1 : companyName,
          secondCustomerName: !this.isBusinessCustomer() ? customerName2 : companyName,
          firstCustomerCvr: this.isBusinessCustomer() ? cvr : undefined,
          protectedName: nameProtection,
          usagePointLocations: [
            mapUsagePointLocation(
              legalContactDetails,
              legalContactAddressDetails,
              AddressTypeV1.Legal
            ),
            mapUsagePointLocation(
              technicalContactDetails,
              technicalContactAddressDetails,
              AddressTypeV1.Technical
            ),
          ],
        },
      },
    });

    this.router.navigate([
      getPath<BasePaths>('metering-point'),
      this.internalMeteringPointId(),
      getPath<MeteringPointSubPaths>('process-overview'),
    ]);
  }
}
