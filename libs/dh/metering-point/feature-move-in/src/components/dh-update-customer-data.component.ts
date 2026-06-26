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
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { injectToast } from '@energinet-datahub/dh/shared/ui-util';

import {
  AddressTypeV2,
  ChangeCustomerCharacteristicsBusinessReason,
  ElectricityMarketViewCustomerRelationType,
  GetMeteringPointByIdDocument,
  GetTemporaryStorageDataDocument,
  RequestChangeCustomerCharacteristicsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';

import {
  getCustomerPrefillSource,
  resolveCustomerPrefillValue,
  shouldMaskCustomerCprFields,
} from '../util/customer-prefill-source';
import { mapUsagePointLocation } from '../util/map-usage-point-location';
import { resolveCustomerIdentity, resolveNameProtection } from '../util/resolve-customer-identity';

import type { CustomerDataPrefill } from './types';
import {
  CustomerDataFormSubmitEvent,
  DhUpdateCustomerDataFormComponent,
} from './dh-update-customer-data-form.component';

/**
 * Smart container for the "Update customer data" form.
 *
 * Responsibilities:
 *  - Fetches the metering point and (when applicable) the temporary storage
 *    payload for the current process.
 *  - Resolves the prefill source per BRS via `getCustomerPrefillSource` and
 *    reduces the raw data into a `CustomerDataPrefill`.
 *  - Submits the mutation, surfaces toast feedback and navigates on
 *    completion.
 *
 * Rendering and form behaviour are delegated to
 * `DhUpdateCustomerDataFormComponent`.
 */
@Component({
  selector: 'dh-update-customer-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DhUpdateCustomerDataFormComponent],
  template: `
    <dh-update-customer-data-form
      [prefill]="prefill()"
      [isLoading]="isLoading()"
      [isSubmitting]="requestChangeCustomerCharacteristics.loading()"
      (formSubmit)="updateCustomerData($event)"
      (formCancel)="cancel()"
    />
  `,
})
export class DhUpdateCustomerDataComponent {
  private readonly router = inject(Router);
  private readonly actor = inject(DhActorStorage).getSelectedActor();
  private readonly toast = injectToast('meteringPoint.moveIn.updateCustomer.toast');

  meteringPointId = input.required<string>();
  processId = input<string>();
  businessReason = input<ChangeCustomerCharacteristicsBusinessReason>();
  internalMeteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  requestChangeCustomerCharacteristics = mutation(RequestChangeCustomerCharacteristicsDocument);

  private readonly effectToast = effect(() =>
    this.toast(this.requestChangeCustomerCharacteristics.status())
  );

  private readonly prefillSource = computed(() =>
    getCustomerPrefillSource(this.resolveBusinessReason())
  );

  /**
   * Whether the form should prefill from temporary storage (vs. the metering
   * point) for the current business process. See `customer-prefill-source.ts`
   * for the BRS → source registry.
   */
  private readonly useTemporaryStorage = computed(
    () => this.prefillSource() === 'temporary-storage'
  );

  /**
   * CPR fields are only allowed to start masked/locked when this form is used
   * for its own process: BRS-015 Update customer master data. When embedded in
   * any other process context, CPR must always be editable.
   */
  private readonly shouldMaskCprFields = computed(() =>
    shouldMaskCustomerCprFields(this.resolveBusinessReason())
  );

  private readonly prefillCustomerIdentificationOnly = computed(
    () => this.prefillSource() === 'metering-point-customer-identification'
  );

  private readonly meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      actorGln: this.actor.gln,
    },
  }));

  private readonly temporaryStorageQuery = query(GetTemporaryStorageDataDocument, () => ({
    skip: !this.processId() || !this.useTemporaryStorage(),
    variables: {
      meteringPointId: this.meteringPointId(),
      processId: this.processId() ?? '',
    },
  }));

  private readonly temporaryStorageCustomer = computed(
    () => this.temporaryStorageQuery.data()?.temporaryStorageData
  );
  private readonly meteringPoint = computed(() => this.meteringPointQuery.data()?.meteringPoint);

  private readonly customers = computed(
    () => this.meteringPoint()?.commercialRelation?.activeEnergySupplyPeriod?.customers
  );
  private readonly legalCustomer = computed(() =>
    this.customers()?.find(
      (c) => c.relationType === ElectricityMarketViewCustomerRelationType.Juridical
    )
  );
  private readonly technicalCustomer = computed(() =>
    this.customers()?.find(
      (c) => c.relationType === ElectricityMarketViewCustomerRelationType.Technical
    )
  );
  private readonly secondaryCustomer = computed(() =>
    this.customers()?.find(
      (c) => c.relationType === ElectricityMarketViewCustomerRelationType.Secondary
    )
  );

  /**
   * When sourcing from temporary storage, block all metering-point-derived
   * customer data. The process temporary storage is the only prefill source.
   */
  private readonly shouldClearMpDerivedData = computed(() => this.useTemporaryStorage());

  isLoading = computed(
    () => this.meteringPointQuery.loading() || this.temporaryStorageQuery.loading()
  );

  /** Single reduction into the view-model consumed by the form component. */
  readonly prefill = computed<CustomerDataPrefill>(() => {
    const legalCustomer = this.legalCustomer();
    const prefillCustomerIdentificationOnly = this.prefillCustomerIdentificationOnly();
    const secondary = this.shouldClearMpDerivedData() ? undefined : this.secondaryCustomer();
    const shouldClearCustomerDetails =
      prefillCustomerIdentificationOnly || this.shouldClearMpDerivedData();
    const legalContact = shouldClearCustomerDetails ? null : (legalCustomer?.legalContact ?? null);
    const technicalContact = shouldClearCustomerDetails
      ? null
      : (this.technicalCustomer()?.technicalContact ?? null);

    const isBusinessCustomer = this.useTemporaryStorage()
      ? (this.temporaryStorageCustomer()?.isBusinessCustomer ?? false)
      : legalCustomer?.cvr != null;

    return {
      isBusinessCustomer,
      maskCprFields: this.shouldMaskCprFields(),
      primary: {
        name: this.resolvePrimaryName(),
        cvr: this.resolvePrimaryCvr(),
        isProtectedName:
          prefillCustomerIdentificationOnly || this.useTemporaryStorage()
            ? false
            : (legalCustomer?.isProtectedName ?? false),
        customerId:
          prefillCustomerIdentificationOnly || this.useTemporaryStorage()
            ? null
            : (legalCustomer?.id ?? null),
      },
      secondary: {
        name: secondary?.name ?? '',
        isProtectedName: prefillCustomerIdentificationOnly
          ? false
          : (secondary?.isProtectedName ?? false),
        customerId:
          prefillCustomerIdentificationOnly || !secondary?.name ? null : (secondary.id ?? null),
      },
      legalCustomer:
        prefillCustomerIdentificationOnly || this.useTemporaryStorage() ? undefined : legalCustomer,
      legalContact,
      technicalContact,
      installationAddress: this.meteringPoint()?.metadata?.installationAddress,
    };
  });

  /**
   * Primary customer name prefill. When temporary storage is the chosen source,
   * metering point values must never be used as a fallback.
   */
  private resolvePrimaryName(): string {
    return resolveCustomerPrefillValue({
      source: this.prefillSource(),
      temporaryStorageValue: this.temporaryStorageCustomer()?.firstCustomerName,
      meteringPointValue: this.legalCustomer()?.name,
      temporaryStorageLoading: this.temporaryStorageQuery.loading(),
    });
  }

  private resolvePrimaryCvr(): string {
    return resolveCustomerPrefillValue({
      source: this.prefillSource(),
      temporaryStorageValue: this.temporaryStorageCustomer()?.firstCustomerCvr,
      meteringPointValue: this.legalCustomer()?.cvr,
      temporaryStorageLoading: this.temporaryStorageQuery.loading(),
    });
  }

  async updateCustomerData({ values, isBusinessCustomer }: CustomerDataFormSubmitEvent) {
    await this.requestChangeCustomerCharacteristics.mutate({
      variables: {
        input: {
          meteringPointId: this.meteringPointId(),
          businessReason: this.resolveBusinessReason(),
          electricalHeating: this.meteringPoint()?.haveElectricalHeating ?? false,
          processId: this.processId(),
          protectedName: resolveNameProtection(values, isBusinessCustomer),
          ...resolveCustomerIdentity(values, isBusinessCustomer),
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

  cancel() {
    const previousUrl = this.router.lastSuccessfulNavigation()?.previousNavigation?.finalUrl;

    if (previousUrl) {
      this.router.navigateByUrl(previousUrl.toString(), { replaceUrl: true });
      return;
    }

    this.router.navigate([getPath<BasePaths>('metering-point'), this.internalMeteringPointId()]);
  }
}
