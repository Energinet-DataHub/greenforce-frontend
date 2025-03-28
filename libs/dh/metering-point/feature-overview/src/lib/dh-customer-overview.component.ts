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
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhCustomerCprComponent } from './dh-customer-cpr.component';
import { DhCustomerContactDetailsComponent } from './dh-customer-contact-details.component';
import { MeteringPointDetails } from './types';
import { DhCanSeeValueDirective } from './dh-can-see-value.directive';

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
    DhCanSeeValueDirective,
    DhPermissionRequiredDirective,
    DhEmDashFallbackPipe,
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

    .contact {
      align-self: end;
    }

    .contact h5 {
      --grow: 0;
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
        @for (contact of contacts(); track contact.id) {
          @if (contact.cvr) {
            <div vater-flex gap="s" basis="0" class="contact">
              <h5>{{ contact.name }}</h5>

              {{ t('cvr', { cvrValue: contact.cvr }) }}
            </div>
          } @else {
            <ng-container
              *dhCanSeeValue="
                [EicFunction.DataHubAdministrator, EicFunction.GridAccessProvider];
                isResponsible: isEnergySupplierResponsible()
              "
            >
              <div vater-flex gap="s" basis="0" class="contact">
                @if (contact.isProtectedName) {
                  <div
                    vater-stack
                    direction="row"
                    gap="s"
                    class="watt-space-inset-squish-s watt-space-stack-m"
                    [class.protected-address]="contact.isProtectedName"
                  >
                    <watt-icon size="s" name="warning" />
                    <span class="watt-text-s">{{ t('protectedAddress') }}</span>
                  </div>
                }

                <h5>{{ contact.name }}</h5>

                <ng-container *dhPermissionRequired="['cpr:view']">
                  <dh-customer-cpr
                    *dhCanSeeValue="
                      [EicFunction.DataHubAdministrator];
                      isResponsible: isEnergySupplierResponsible()
                    "
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

      <ng-container
        *dhCanSeeValue="
          [EicFunction.DataHubAdministrator, EicFunction.GridAccessProvider];
          isResponsible: isEnergySupplierResponsible()
        "
      >
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
  isEnergySupplierResponsible = computed(() => this.meteringPointDetails()?.isEnergySupplier);

  showContactDetails = computed(() => this.contacts().length > 0);

  openContactDetails(): void {
    this.modalService.open({
      component: DhCustomerContactDetailsComponent,
      data: this.contacts(),
    });
  }
}
