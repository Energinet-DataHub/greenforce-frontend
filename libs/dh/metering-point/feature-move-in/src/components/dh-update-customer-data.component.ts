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
  GetMeteringPointByIdDocument,
  GetTemporaryStorageDataDocument,
  RequestChangeCustomerCharacteristicsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';

import { getCustomerPrefillSource } from '../util/customer-prefill-source';
import { mapUsagePointLocation } from '../util/map-usage-point-location';
import { resolveCustomerIdentity, resolveNameProtection } from '../util/resolve-customer-identity';

import type { CustomerDataPrefillVm } from './customer-data-prefill.vm';
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
 *    reduces the raw data into a `CustomerDataPrefillVm`.
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

  /**
   * Whether the form should prefill from temporary storage (vs. the metering
   * point) for the current business process. See `customer-prefill-source.ts`
   * for the BRS → source registry.
   */
  private readonly useTemporaryStorage = computed(
    () => getCustomerPrefillSource(this.businessReason()) === 'temporary-storage'
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
    this.customers()?.find((c) => c.relationType === 'JURIDICAL')
  );
  private readonly technicalCustomer = computed(() =>
    this.customers()?.find((c) => c.relationType === 'TECHNICAL')
  );
  private readonly secondaryCustomer = computed(() =>
    this.customers()?.find((c) => c.relationType === 'SECONDARY')
  );

  /**
   * When sourcing from temporary storage, block the metering point's existing
   * contact / secondary-customer data from reaching the form while the
   * temporary storage query is in-flight. Once it resolves, those fields
   * remain empty (temporary storage does not currently carry them).
   */
  private readonly shouldClearMpDerivedData = computed(
    () =>
      this.useTemporaryStorage() &&
      !!this.processId() &&
      (this.temporaryStorageQuery.loading() || !!this.temporaryStorageCustomer())
  );

  isLoading = computed(
    () => this.meteringPointQuery.loading() || this.temporaryStorageQuery.loading()
  );

  /** Single reduction into the view-model consumed by the form component. */
  readonly prefill = computed<CustomerDataPrefillVm>(() => {
    const legalCustomer = this.legalCustomer();
    const secondary = this.shouldClearMpDerivedData() ? undefined : this.secondaryCustomer();
    const legalContact = this.shouldClearMpDerivedData() ? undefined : legalCustomer?.legalContact;
    const technicalContact = this.shouldClearMpDerivedData()
      ? undefined
      : this.technicalCustomer()?.technicalContact;

    const isBusinessCustomer = this.useTemporaryStorage()
      ? (this.temporaryStorageCustomer()?.isBusinessCustomer ?? legalCustomer?.cvr !== null)
      : legalCustomer?.cvr != null;

    return {
      isBusinessCustomer,
      primary: {
        name: this.resolvePrimaryName(),
        cvr: this.resolvePrimaryCvr(),
        isProtectedName: legalCustomer?.isProtectedName ?? false,
        customerId: this.useTemporaryStorage() ? null : (legalCustomer?.id ?? null),
      },
      secondary: {
        name: secondary?.name ?? '',
        isProtectedName: secondary?.isProtectedName ?? false,
        customerId: secondary?.name ? (secondary.id ?? null) : null,
      },
      legalCustomer,
      legalContact,
      technicalContact,
      installationAddress: this.meteringPoint()?.metadata?.installationAddress,
    };
  });

  /**
   * Primary customer name prefill. While the temporary storage query is
   * loading we return an empty string to avoid flashing the metering point
   * value when temporary storage is the chosen source.
   */
  private resolvePrimaryName(): string {
    const mpName = this.legalCustomer()?.name ?? '';
    if (!this.useTemporaryStorage()) return mpName;
    if (this.temporaryStorageQuery.loading()) return '';
    return this.temporaryStorageCustomer()?.firstCustomerName ?? mpName;
  }

  private resolvePrimaryCvr(): string {
    const mpCvr = this.legalCustomer()?.cvr ?? '';
    if (!this.useTemporaryStorage()) return mpCvr;
    if (this.temporaryStorageQuery.loading()) return '';
    return this.temporaryStorageCustomer()?.firstCustomerCvr ?? mpCvr;
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
