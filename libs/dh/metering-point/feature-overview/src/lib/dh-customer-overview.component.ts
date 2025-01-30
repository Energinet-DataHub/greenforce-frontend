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
import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhCustomerCprComponent } from './dh-customer-cpr.component';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhCustomerContactDetailsComponent } from './dh-customer-contact-details.component';

@Component({
  selector: 'dh-customer-overview',
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WATT_CARD,
    WattIconComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhEmDashFallbackPipe,
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
      display: inline-flex;
    }

    .info-text {
      color: var(--watt-on-light-medium-emphasis);
      margin: 0;
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.customer'">
      <watt-card-title>
        <h3>{{ t('title') }}</h3>
      </watt-card-title>

      <div
        vater-stack
        direction="row"
        gap="s"
        class="protected-address watt-space-inset-squish-s watt-space-stack-m"
      >
        <watt-icon size="s" name="warning" />
        <span class="watt-text-s">{{ t('protectedAddress') }}</span>
      </div>

      <h4 class="watt-space-stack-s">Kunde 1</h4>

      <watt-description-list class="watt-space-stack-l" variant="stack" [itemSeparators]="false">
        <watt-description-list-item [label]="t('nameLabel')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('cprLabel')">
          <dh-customer-cpr />
        </watt-description-list-item>
      </watt-description-list>

      <h4 class="watt-space-stack-s">Kunde 2</h4>

      <watt-description-list variant="stack" [itemSeparators]="false">
        <watt-description-list-item [label]="t('nameLabel')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('cprLabel')">
          <dh-customer-cpr />
        </watt-description-list-item>
      </watt-description-list>

      <a (click)="$event.preventDefault(); showAddressDetails()" class="watt-link-s">{{
        t('showContactDetailsLink')
      }}</a>
    </watt-card>
  `,
})
export class DhCustomerOverviewComponent {
  modalService = inject(WattModalService);

  showAddressDetails(): void {
    this.modalService.open({
      component: DhCustomerContactDetailsComponent,
    });
  }
}
