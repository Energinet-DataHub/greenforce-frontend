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
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

import { CustomerDto, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { MeteringPointDetails } from '../../types';
import { DhCustomerCprComponent } from './dh-customer-cpr.component';
import { DhCanSeeDirective } from '../can-see/dh-can-see.directive';
import { DhCustomerProtectedComponent } from './dh-customer-protected.component';
import { DhCustomerContactDetailsComponent } from './dh-customer-contact-details.component';

@Component({
  selector: 'dh-customer-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,

    WATT_CARD,

    VaterFlexComponent,

    DhCanSeeDirective,
    DhEmDashFallbackPipe,
    DhCustomerCprComponent,
    DhCustomerProtectedComponent,
    DhPermissionRequiredDirective,
  ],
  styles: `
    :host {
      display: block;
    }

    .contact {
      align-self: end;
    }

    .contact h5 {
      margin: 0;
    }

    .contact:has(+ .contact) {
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
        @for (contact of uniqueContacts(); track contact.id) {
          @if (contact.cvr) {
            <div vater-flex gap="s" class="contact">
              <h5>{{ contact.name }}</h5>

              {{ t('cvr', { cvrValue: contact.cvr }) }}
            </div>
          } @else {
            <ng-container
              *dhCanSee="'private-customer-overview'; meteringPointDetails: meteringPointDetails()"
            >
              <div vater-flex gap="s" class="contact">
                @if (contact.isProtectedName) {
                  <dh-customer-protected />
                }

                <h5>{{ contact.name }}</h5>

                <ng-container *dhPermissionRequired="['cpr:view']">
                  <dh-customer-cpr
                    *dhCanSee="'cpr'; meteringPointDetails: meteringPointDetails()"
                    [contactId]="contact.id"
                  />
                </ng-container>
              </div>
            </ng-container>
          }
        } @empty {
          {{ null | dhEmDashFallback }}
        }
      </div>

      <ng-container *dhCanSee="'contact-details'; meteringPointDetails: meteringPointDetails()">
        @if (showContactDetails()) {
          <a (click)="$event.preventDefault(); openContactDetails()" class="watt-link-s">{{
            t('showContactDetailsLink')
          }}</a>
        }
      </ng-container>
    </watt-card>
  `,
})
export class DhCustomerOverviewComponent {
  private modalService = inject(WattModalService);

  EicFunction = EicFunction;

  meteringPointDetails = input.required<MeteringPointDetails | undefined>();

  contacts = computed(
    () => this.meteringPointDetails()?.commercialRelation?.activeEnergySupplyPeriod?.customers ?? []
  );
  uniqueContacts = computed(() =>
    this.contacts().reduce((foundValues: CustomerDto[], nextContact) => {
      if (!foundValues.some((contact) => contact.name === nextContact.name)) {
        foundValues.push(nextContact);
      }
      return foundValues;
    }, [])
  );
  isEnergySupplierResponsible = computed(() => this.meteringPointDetails()?.isEnergySupplier);

  showContactDetails = computed(() => this.contacts().length > 0);

  openContactDetails(): void {
    this.modalService.open({
      component: DhCustomerContactDetailsComponent,
      data: this.contacts(),
    });
  }
}
