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
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhCustomerCprComponent } from './dh-customer-cpr.component';
import { DhCustomerContactDetailsComponent } from './dh-customer-contact-details.component';
import { MeteringPointDetails } from './types';
import { CustomerRelation } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-customer-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    VaterFlexComponent,
    WATT_CARD,
    WattIconComponent,
    DhCustomerCprComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .protected-address {
      background: var(--watt-color-secondary-ultralight);
      color: var(--watt-color-neutral-grey-800);
      border-radius: 12px;
      align-self: start;
    }

    .customer {
      align-self: end;
    }

    .customer h5 {
      --grow: 0;
      margin: 0;
    }

    .customer:has(+ .customer) {
      border-right: 1px solid var(--watt-color-neutral-grey-300);
      padding-right: var(--watt-space-m);
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.customer'">
      <watt-card-title>
        <h3>{{ t('title') }}</h3>
      </watt-card-title>

      <div vater-flex gap="m" direction="row" class="watt-space-stack-m">
        @for (customer of customers(); track customer.id) {
          <div vater-flex gap="s" basis="0" class="customer">
            @if (customer.isProtectedName) {
              <div
                vater-stack
                direction="row"
                gap="s"
                class="watt-space-inset-squish-s watt-space-stack-m"
                [class.protected-address]="customer.isProtectedName"
              >
                <watt-icon size="s" name="warning" />
                <span class="watt-text-s">{{ t('protectedAddress') }}</span>
              </div>
            }
            <h5>{{ customer.name }}</h5>
            <dh-customer-cpr [customerId]="customer.id" />
          </div>
        }
      </div>

      @if (showContactDetails()) {
        <a (click)="$event.preventDefault(); openContactDetails()" class="watt-link-s">{{
          t('showContactDetailsLink')
        }}</a>
      }
    </watt-card>
  `,
})
export class DhCustomerOverviewComponent {
  private modalService = inject(WattModalService);

  meteringPointDetails = input.required<MeteringPointDetails | undefined>();

  customers = computed(
    () =>
      this.meteringPointDetails()?.currentCommercialRelation?.currentEnergySupplierPeriod?.contacts.filter(
        (x) =>
          x.relationType === CustomerRelation.Primary ||
          x.relationType === CustomerRelation.Secondary
      ) ?? []
  );

  showContactDetails = computed(() => this.contactDetails().length > 0);

  contactDetails = computed(
    () =>
      this.meteringPointDetails()?.currentCommercialRelation?.currentEnergySupplierPeriod?.contacts.filter(
        (x) =>
          x.relationType === CustomerRelation.Legal || x.relationType === CustomerRelation.Technical
      ) ?? []
  );

  openContactDetails(): void {
    this.modalService.open({
      component: DhCustomerContactDetailsComponent,
      data: this.contactDetails(),
    });
  }
}
