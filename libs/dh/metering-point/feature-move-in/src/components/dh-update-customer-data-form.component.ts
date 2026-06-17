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
import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  dhFormControlToSignal,
  dhMakeFormControl,
  dhSyncControlValidators,
} from '@energinet-datahub/dh/shared/ui-util';

import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';

import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { inject } from '@angular/core';

import { FormValues } from '../types';
import { sync } from '../util/sync-controls';
import { clearAddressFields } from '../util/clear-address-fields';
import { createContactAddressDetailsForm } from '../util/create-contact-address-details-form';
import { createCustomerContactDetailsForm } from '../util/create-customer-contact-details-form';
import {
  customerCprValidators,
  isCustomerCprMasked,
  shouldRequireCustomerCpr,
} from '../util/customer-cpr-field';
import { dhMoveInCvrValidator } from '../validators/dh-move-in-cvr.validator';

import { DhContactDetailsComponent } from './dh-contact-details.component';
import { DhPrivateCustomerDetailsComponent } from './dh-private-customer-details.component';
import { DhCustomerAddressDetailsComponent } from './dh-customer-address-details.component';
import { DhBusinessCustomerDetailsFormComponent } from './dh-business-customer-details-form.component';

import type { CustomerDataPrefill } from './types';

export interface CustomerDataFormSubmitEvent {
  values: FormValues;
  isBusinessCustomer: boolean;
}

/**
 * Presentational form for the "Update customer data" workflow. Owns the
 * `FormGroup`, control synchronisation effects, validators and template,
 * but is completely unaware of data sources, GraphQL or navigation.
 */
@Component({
  selector: 'dh-update-customer-data-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_CARD,
    WattButtonComponent,
    WattSpinnerComponent,
    WattSkeletonComponent,
    VaterFlexComponent,
    VaterStackComponent,
    DhContactDetailsComponent,
    DhCustomerAddressDetailsComponent,
    DhPrivateCustomerDetailsComponent,
    DhBusinessCustomerDetailsFormComponent,
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
      (ngSubmit)="onSubmit()"
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
          <watt-button (click)="formCancel.emit()" variant="secondary">
            {{ t('cancel') }}
          </watt-button>
          <watt-button type="submit" [loading]="isSubmitting()">
            {{ t('updateCustomerData') }}
          </watt-button>
        </vater-stack>
      </vater-stack>
      <vater-flex direction="row" gap="l" class="form-container">
        <!-- Customer -->
        <watt-card class="customer-details-card" data-testid="customer-details-card">
          <watt-card-title>
            <h3>{{ t('customerDetails.label') }}</h3>
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
          } @else if (prefill().isBusinessCustomer) {
            <dh-business-customer-details
              [businessCustomerFormGroup]="this.form().controls.businessCustomerDetails"
            />
          } @else {
            <dh-private-customer-details
              [privateCustomerFormGroup]="this.form().controls.privateCustomerDetails"
              [contactId1]="prefill().primary.customerId"
              [contactId2]="prefill().secondary.customerId"
              [maskCprFields]="prefill().maskCprFields"
            />
          }
        </watt-card>
        <!-- Legal -->
        <watt-card data-testid="legal-details-card">
          <watt-card-title>
            <h3>{{ t('contactDetails.legalContactSection') }}</h3>
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
            <h3>{{ t('contactDetails.technicalContactSection') }}</h3>
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
export class DhUpdateCustomerDataFormComponent {
  private readonly currentEnv = inject(dhAppEnvironmentToken).current;

  /** Prefill data resolved by the container. */
  prefill = input.required<CustomerDataPrefill>();
  /** Disables interactivity while the container loads its data. */
  isLoading = input.required<boolean>();
  /** Disables the submit button while the mutation is in flight. */
  isSubmitting = input.required<boolean>();

  formSubmit = output<CustomerDataFormSubmitEvent>();
  formCancel = output<void>();

  form = computed(() => {
    const prefill = this.prefill();
    const isBusiness = prefill.isBusinessCustomer;
    const isPrimaryCprMasked = isCustomerCprMasked(
      prefill.maskCprFields,
      prefill.primary.customerId
    );

    return new FormGroup({
      businessCustomerDetails: new FormGroup({
        companyName: dhMakeFormControl<string>(
          prefill.primary.name,
          isBusiness ? [Validators.required] : []
        ),
        cvr: dhMakeFormControl<string>(
          prefill.primary.cvr,
          isBusiness ? [Validators.required, dhMoveInCvrValidator(this.currentEnv)] : []
        ),
        nameProtection: dhMakeFormControl<boolean>(prefill.primary.isProtectedName),
      }),
      privateCustomerDetails: new FormGroup({
        customerName1: dhMakeFormControl<string>(
          prefill.primary.name,
          !isBusiness ? [Validators.required] : []
        ),
        cpr1: dhMakeFormControl<string | null>(
          null,
          !isBusiness
            ? customerCprValidators({
                requiredWhenUnmasked: true,
                isMasked: isPrimaryCprMasked,
              })
            : []
        ),
        customerName2: dhMakeFormControl<string>(prefill.secondary.name),
        cpr2: dhMakeFormControl<string | null>(
          null,
          !isBusiness ? customerCprValidators({ requiredWhenUnmasked: false, isMasked: false }) : []
        ),
        nameProtection: dhMakeFormControl<boolean>(prefill.secondary.isProtectedName),
      }),
      legalContactDetails: createCustomerContactDetailsForm(
        prefill.legalCustomer,
        prefill.legalContact
      ),
      legalContactAddressDetails: createContactAddressDetailsForm(
        prefill.legalContact,
        prefill.installationAddress
      ),
      technicalContactDetails: createCustomerContactDetailsForm(
        prefill.legalCustomer,
        prefill.technicalContact
      ),
      technicalContactAddressDetails: createContactAddressDetailsForm(
        prefill.technicalContact,
        prefill.installationAddress
      ),
    });
  });

  private readonly legalCustomerNameChanged = dhFormControlToSignal(
    () => this.form().controls.privateCustomerDetails.controls.customerName1
  );

  private readonly businessCustomerNameChanged = dhFormControlToSignal(
    () => this.form().controls.businessCustomerDetails.controls.companyName
  );

  private readonly primaryCustomerName = computed(() =>
    this.prefill().isBusinessCustomer
      ? this.businessCustomerNameChanged()
      : this.legalCustomerNameChanged()
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
      technicalNameSameAsContactName ? primaryCustomerName : this.prefill().technicalContact?.name,
      technicalNameSameAsContactName
    );
  });

  readonly technicalAddressSameAsInstallation = dhFormControlToSignal(
    () => this.form().controls.technicalContactAddressDetails.controls.addressSameAsInstallation
  );

  private readonly syncTechnicalContactAddress = effect(() => {
    const technicalAddressSameAsInstallation = this.technicalAddressSameAsInstallation();
    const addressGroup = this.form().controls.technicalContactAddressDetails.controls.addressGroup;
    const installationAddress = this.prefill().installationAddress;

    sync(
      addressGroup,
      technicalAddressSameAsInstallation
        ? installationAddress
          ? { ...installationAddress, postBox: null }
          : null
        : this.prefill().technicalContact,
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
      legalNameSameAsContactName ? primaryCustomerName : this.prefill().legalContact?.name,
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
    if (this.prefill().isBusinessCustomer) return false;
    const name2 = (this.customerName2Changed() ?? '').trim();
    const cpr2 = this.cpr2Changed();
    const isCprMasked =
      cpr2 === null &&
      isCustomerCprMasked(this.prefill().maskCprFields, this.prefill().secondary.customerId);
    return shouldRequireCustomerCpr({
      requiredWhenUnmasked: !!name2 || !!cpr2,
      isMasked: isCprMasked,
    });
  });

  // noinspection JSUnusedLocalSymbols - keeps the validator sync effect alive.
  private readonly syncName2Validators = dhSyncControlValidators(
    () => this.form().controls.privateCustomerDetails.controls.customerName2,
    Validators.required,
    () => this.secondaryCustomerRequired()
  );

  // noinspection JSUnusedLocalSymbols - keeps the validator sync effect alive.
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
    const installationAddress = this.prefill().installationAddress;

    sync(
      addressGroup,
      legalAddressSameAsInstallation
        ? installationAddress
          ? { ...installationAddress, postBox: null }
          : null
        : this.prefill().legalContact,
      legalAddressSameAsInstallation
    );
  });

  onSubmit() {
    if (this.form().invalid || this.isSubmitting()) return;
    this.formSubmit.emit({
      values: this.form().getRawValue() as FormValues,
      isBusinessCustomer: this.prefill().isBusinessCustomer,
    });
  }

  clearAddressFields(addressType: 'legal' | 'technical') {
    const formGroup =
      addressType === 'legal'
        ? this.form().controls.legalContactAddressDetails
        : this.form().controls.technicalContactAddressDetails;

    clearAddressFields(formGroup);
  }
}
