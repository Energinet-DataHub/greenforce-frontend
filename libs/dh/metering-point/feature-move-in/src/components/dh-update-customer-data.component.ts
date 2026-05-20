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
import { Router } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { dhCprValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  dhFormControlToSignal,
  dhMakeFormControl,
  dhSyncControlValidators,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';

import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';

import {
  AddressTypeV2,
  ChangeCustomerCharacteristicsBusinessReason,
  GetMeteringPointByIdDocument,
  GetTemporaryStorageDataDocument,
  RequestChangeCustomerCharacteristicsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { sync } from '../util/sync-controls';
import { FormValues } from '../types';
import { clearAddressFields } from '../util/clear-address-fields';
import { DhContactDetailsComponent } from './dh-contact-details.component';
import { dhMoveInCvrValidator } from '../validators/dh-move-in-cvr.validator';
import { mapUsagePointLocation } from '../util/map-usage-point-location';
import { DhPrivateCustomerDetailsComponent } from './dh-private-customer-details.component';
import { DhCustomerAddressDetailsComponent } from './dh-customer-address-details.component';
import { createContactAddressDetailsForm } from '../util/create-contact-address-details-form';
import { createCustomerContactDetailsForm } from '../util/create-customer-contact-details-form';
import { DhBusinessCustomerDetailsFormComponent } from './dh-business-customer-details-form.component';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';
import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';

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
    WattSkeletonComponent,
  ],
  styles: `
    .form-container {
      margin-top: var(--watt-space-m);
      flex: 1 1 0;
      min-height: 0;
      overflow: auto;
    }

    .customer-details-card {
      height: fit-content;
    }

    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <form
      [formGroup]="this.form()"
      (ngSubmit)="updateCustomerData()"
      *transloco="let t; prefix: 'meteringPoint.moveIn'"
    >
      <vater-stack direction="row" justify="space-between">
        <vater-stack direction="row" gap="m">
          <h3 class="no-margin">{{ t('updateCustomerData') }}</h3>
          @if (isLoading()) {
            <watt-spinner [diameter]="22" />
          }
        </vater-stack>
        <vater-stack direction="row" gap="m">
          <watt-button (click)="cancel()" variant="secondary">{{ t('cancel') }} </watt-button>
          <watt-button type="submit" [loading]="requestChangeCustomerCharacteristics.loading()"
            >{{ t('updateCustomerData') }}
          </watt-button>
        </vater-stack>
      </vater-stack>
      <vater-flex direction="row" gap="l" class="form-container">
        <!-- Customer -->
        <watt-card class="customer-details-card" data-testid="customer-details-card">
          <watt-card-title>
            <h3>
              {{ t('customerDetails.label') }}
            </h3>
          </watt-card-title>
          @if (isLoading()) {
            <vater-stack gap="l" align="start">
              <watt-skeleton width="25%" height="24px" />
              <vater-stack fill="horizontal" gap="xs" align="start">
                <watt-skeleton width="25%" />
                <watt-skeleton height="46px" />
              </vater-stack>
              <vater-stack fill="horizontal" gap="xs" align="start">
                <watt-skeleton width="25%" />
                <watt-skeleton height="46px" />
              </vater-stack>
            </vater-stack>
          }
          @if (!isLoading()) {
            @if (isBusinessCustomer()) {
              <dh-business-customer-details
                [businessCustomerFormGroup]="this.form().controls.businessCustomerDetails"
              />
            } @else {
              <dh-private-customer-details
                [privateCustomerFormGroup]="this.form().controls.privateCustomerDetails"
                [meteringPointId]="meteringPointId()"
                [contactId1]="legalCustomerId()"
                [contactId2]="secondaryCustomerId()"
                [searchMigratedMeteringPoints]="searchMigratedMeteringPoints()"
              />
            }
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
            contactType="legalContact"
          />
          <dh-customer-address-details
            [addressDetailsFormGroup]="this.form().controls.legalContactAddressDetails"
            [disableClearButton]="legalAddressSameAsInstallation()"
            (clearFields)="clearAddressFields('legal')"
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
            contactType="technicalContact"
          />
          <dh-customer-address-details
            [addressDetailsFormGroup]="this.form().controls.technicalContactAddressDetails"
            [disableClearButton]="technicalAddressSameAsInstallation()"
            (clearFields)="clearAddressFields('technical')"
          />
        </watt-card>
      </vater-flex>
    </form>
  `,
})
export class DhUpdateCustomerDataComponent {
  private readonly router = inject(Router);
  private readonly actor = inject(DhActorStorage).getSelectedActor();
  private readonly toast = injectToast('meteringPoint.moveIn.updateCustomer.toast');
  private readonly effectToast = effect(() =>
    this.toast(this.requestChangeCustomerCharacteristics.status())
  );
  requestChangeCustomerCharacteristics = mutation(RequestChangeCustomerCharacteristicsDocument);
  getMeteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      actorGln: this.actor.gln,
    },
  }));
  temporaryStorageCustomerQuery = query(GetTemporaryStorageDataDocument, () => ({
    skip: !this.processId(),
    variables: {
      meteringPointId: this.meteringPointId(),
      processId: this.processId() ?? '',
    },
  }));
  private readonly temporaryStorageCustomer = computed(
    () => this.temporaryStorageCustomerQuery.data()?.temporaryStorageData
  );
  private readonly customers = computed(
    () =>
      this.getMeteringPointQuery.data()?.meteringPoint.commercialRelation?.activeEnergySupplyPeriod
        ?.customers
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
    () => this.getMeteringPointQuery.data()?.meteringPoint.metadata?.installationAddress
  );
  private readonly technicalContact = computed(() => this.technicalCustomer()?.technicalContact);
  private readonly legalContact = computed(() => this.legalCustomer()?.legalContact);

  private readonly shouldClearContacts = computed(
    () =>
      !!this.processId() &&
      (this.temporaryStorageCustomerQuery.loading() || !!this.temporaryStorageCustomer())
  );

  private readonly effectiveLegalContact = computed(() =>
    this.shouldClearContacts() ? undefined : this.legalContact()
  );

  private readonly effectiveTechnicalContact = computed(() =>
    this.shouldClearContacts() ? undefined : this.technicalContact()
  );

  private readonly effectiveSecondaryCustomer = computed(() =>
    this.shouldClearContacts() ? undefined : this.secondaryCustomer()
  );

  isBusinessCustomer = computed(
    () => this.temporaryStorageCustomer()?.isBusinessCustomer ?? this.legalCustomer()?.cvr !== null
  );
  legalCustomerId = computed(() => (this.processId() ? null : (this.legalCustomer()?.id ?? null)));
  secondaryCustomerId = computed(() => {
    if (this.processId()) return null;
    const customer = this.effectiveSecondaryCustomer();
    return customer?.name ? customer.id : null;
  });
  isLoading = computed(
    () => this.getMeteringPointQuery.loading() || this.temporaryStorageCustomerQuery.loading()
  );
  meteringPointId = input.required<string>();
  processId = input<string>();
  businessReason = input<ChangeCustomerCharacteristicsBusinessReason>();
  internalMeteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  /**
   * When in a move-in flow (processId is set), block the metering point's
   * existing customer data from reaching the form while the temporary storage
   * query is still in-flight. Once it completes — whether it returns data or
   * null — the gate opens and we either use temporary storage or fall back
   * to the metering point customer.
   */
  private readonly effectiveCustomerName = computed(() => {
    if (this.processId() && this.temporaryStorageCustomerQuery.loading()) return '';
    return this.temporaryStorageCustomer()?.firstCustomerName ?? this.legalCustomer()?.name ?? '';
  });

  private readonly effectiveCustomerCvr = computed(() => {
    if (this.processId() && this.temporaryStorageCustomerQuery.loading()) return '';
    return this.temporaryStorageCustomer()?.firstCustomerCvr ?? this.legalCustomer()?.cvr ?? '';
  });

  form = computed(
    () =>
      new FormGroup({
        businessCustomerDetails: new FormGroup({
          companyName: dhMakeFormControl<string>(
            this.effectiveCustomerName(),
            this.isBusinessCustomer() ? [Validators.required] : []
          ),
          cvr: dhMakeFormControl<string>(
            this.effectiveCustomerCvr(),
            this.isBusinessCustomer() ? [Validators.required, dhMoveInCvrValidator()] : []
          ),
          nameProtection: dhMakeFormControl<boolean>(
            this.legalCustomer()?.isProtectedName ?? false
          ),
        }),
        privateCustomerDetails: new FormGroup({
          customerName1: dhMakeFormControl<string>(
            this.effectiveCustomerName(),
            !this.isBusinessCustomer() ? [Validators.required] : []
          ),
          cpr1: dhMakeFormControl<string | null>(
            null,
            !this.isBusinessCustomer()
              ? this.legalCustomerId() === null
                ? [Validators.required, dhCprValidator()]
                : [dhCprValidator()]
              : []
          ),
          customerName2: dhMakeFormControl<string>(this.effectiveSecondaryCustomer()?.name ?? ''),
          cpr2: dhMakeFormControl<string | null>(
            null,
            !this.isBusinessCustomer() ? [dhCprValidator()] : []
          ),
          nameProtection: dhMakeFormControl<boolean>(
            this.effectiveSecondaryCustomer()?.isProtectedName ?? false
          ),
        }),
        legalContactDetails: createCustomerContactDetailsForm(
          this.legalCustomer(),
          this.effectiveLegalContact()
        ),
        legalContactAddressDetails: createContactAddressDetailsForm(
          this.effectiveLegalContact(),
          this.installationAddress()
        ),
        technicalContactDetails: createCustomerContactDetailsForm(
          this.legalCustomer(),
          this.effectiveTechnicalContact()
        ),
        technicalContactAddressDetails: createContactAddressDetailsForm(
          this.effectiveTechnicalContact(),
          this.installationAddress()
        ),
      })
  );

  private readonly legalCustomerNameChanged = dhFormControlToSignal(
    () => this.form().controls.privateCustomerDetails.controls.customerName1
  );

  private readonly businessCustomerNameChanged = dhFormControlToSignal(
    () => this.form().controls.businessCustomerDetails.controls.companyName
  );

  private readonly primaryCustomerName = computed(() =>
    this.isBusinessCustomer() ? this.businessCustomerNameChanged() : this.legalCustomerNameChanged()
  );

  /** Sync technical */
  private readonly technicalNameSameAsContactNameToggle = dhFormControlToSignal(
    () => this.form().controls.technicalContactDetails.controls.contactSameAsCustomer
  );

  private readonly syncTechnicalContactName = effect(() => {
    const technicalNameSameAsContactName = this.technicalNameSameAsContactNameToggle();
    const primaryCustomerName = this.primaryCustomerName();
    const control =
      this.form().controls.technicalContactDetails.controls.contactGroup.controls.name;
    sync(
      control,
      technicalNameSameAsContactName ? primaryCustomerName : this.effectiveTechnicalContact()?.name,
      technicalNameSameAsContactName
    );
  });

  readonly technicalAddressSameAsInstallation = dhFormControlToSignal(
    () => this.form().controls.technicalContactAddressDetails.controls.addressSameAsInstallation
  );

  private readonly syncTechnicalContactAddress = effect(() => {
    const technicalAddressSameAsInstallation = this.technicalAddressSameAsInstallation();
    const addressGroup = this.form().controls.technicalContactAddressDetails.controls.addressGroup;
    const installationAddress = this.installationAddress();

    sync(
      addressGroup,
      technicalAddressSameAsInstallation
        ? installationAddress
          ? { ...installationAddress, postBox: null }
          : null
        : this.effectiveTechnicalContact(),
      technicalAddressSameAsInstallation
    );
  });

  /** Sync legal */
  private readonly legalNameSameAsContactNameToggle = dhFormControlToSignal(
    () => this.form().controls.legalContactDetails.controls.contactSameAsCustomer
  );

  private readonly syncLegalContactName = effect(() => {
    const legalNameSameAsContactName = this.legalNameSameAsContactNameToggle();
    const primaryCustomerName = this.primaryCustomerName();
    const control = this.form().controls.legalContactDetails.controls.contactGroup.controls.name;
    sync(
      control,
      legalNameSameAsContactName ? primaryCustomerName : this.effectiveLegalContact()?.name,
      legalNameSameAsContactName
    );
  });

  /** Sync secondary customer cross-field validators */
  private readonly customerName2Changed = dhFormControlToSignal(
    () => this.form().controls.privateCustomerDetails.controls.customerName2
  );

  private readonly cpr2Changed = dhFormControlToSignal(
    () => this.form().controls.privateCustomerDetails.controls.cpr2
  );

  private readonly secondaryCustomerRequired = computed(() => {
    if (this.isBusinessCustomer()) return false;
    const name2 = this.customerName2Changed();
    const cpr2 = this.cpr2Changed();
    const isCprMasked = cpr2 === null && !!this.secondaryCustomerId();
    return !isCprMasked && (!!name2 || !!cpr2);
  });

  private readonly syncName2Validators = dhSyncControlValidators(
    () => this.form().controls.privateCustomerDetails.controls.customerName2,
    Validators.required,
    () => this.secondaryCustomerRequired()
  );

  private readonly syncCpr2Validators = dhSyncControlValidators(
    () => this.form().controls.privateCustomerDetails.controls.cpr2,
    Validators.required,
    () => this.secondaryCustomerRequired()
  );

  readonly legalAddressSameAsInstallation = dhFormControlToSignal(
    () => this.form().controls.legalContactAddressDetails.controls.addressSameAsInstallation
  );

  private readonly syncLegalContactAddress = effect(() => {
    const legalAddressSameAsInstallation = this.legalAddressSameAsInstallation();
    const addressGroup = this.form().controls.legalContactAddressDetails.controls.addressGroup;
    const installationAddress = this.installationAddress();

    sync(
      addressGroup,
      legalAddressSameAsInstallation
        ? installationAddress
          ? { ...installationAddress, postBox: null }
          : null
        : this.effectiveLegalContact(),
      legalAddressSameAsInstallation
    );
  });

  async updateCustomerData() {
    if (this.form().invalid || this.requestChangeCustomerCharacteristics.loading()) return;

    const values: FormValues = this.form().getRawValue();

    await this.requestChangeCustomerCharacteristics.mutate({
      variables: {
        input: {
          meteringPointId: this.meteringPointId(),
          businessReason: this.resolveBusinessReason(),
          electricalHeating:
            this.getMeteringPointQuery.data()?.meteringPoint.haveElectricalHeating ?? false,
          processId: this.processId(),
          protectedName: this.resolveNameProtection(values),
          ...this.resolveCustomerIdentity(values),
          usagePointLocations: [
            mapUsagePointLocation(
              values.legalContactDetails,
              values.legalContactAddressDetails,
              AddressTypeV2.Legal
            ),
            mapUsagePointLocation(
              values.technicalContactDetails,
              values.technicalContactAddressDetails,
              AddressTypeV2.Technical
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

  private resolveBusinessReason(): ChangeCustomerCharacteristicsBusinessReason {
    return (
      this.businessReason() ??
      (this.processId()
        ? ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn
        : ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer)
    );
  }

  private resolveNameProtection(values: FormValues) {
    return this.isBusinessCustomer()
      ? values.businessCustomerDetails.nameProtection
      : values.privateCustomerDetails.nameProtection;
  }

  private resolveCustomerIdentity(values: FormValues) {
    if (this.isBusinessCustomer()) {
      return {
        firstCustomerName: values.businessCustomerDetails.companyName || undefined,
        firstCustomerCvr: values.businessCustomerDetails.cvr || undefined,
        firstCustomerCpr: undefined,
        secondCustomerCpr: undefined,
        secondCustomerName: undefined,
      };
    }

    const { cpr1, cpr2, customerName1, customerName2 } = values.privateCustomerDetails;

    return {
      firstCustomerName: customerName1 || undefined,
      firstCustomerCpr: cpr1 || undefined,
      secondCustomerName: customerName2 || undefined,
      secondCustomerCpr: cpr2 || undefined,
      firstCustomerCvr: undefined,
    };
  }

  clearAddressFields(addressType: 'legal' | 'technical') {
    const formGroup =
      addressType === 'legal'
        ? this.form().controls.legalContactAddressDetails
        : this.form().controls.technicalContactAddressDetails;

    clearAddressFields(formGroup);
  }

  cancel() {
    const previousUrl = this.router.lastSuccessfulNavigation()?.previousNavigation?.finalUrl;

    if (previousUrl) {
      this.router.navigateByUrl(previousUrl.toString(), { replaceUrl: true });
      return;
    }

    this.router.navigate([getPath<BasePaths>('metering-point'), this.internalMeteringPointId()]);
  }
}
