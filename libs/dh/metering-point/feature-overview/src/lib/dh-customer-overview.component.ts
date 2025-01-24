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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

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
  ],
  styles: `
    :host {
      display: block;
    }

    .customer {
      width: 500px;
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

    .show-cpr-button {
      background-color: var(--watt-color-neutral-white);
      border: 1px solid var(--watt-color-neutral-grey-600);
      border-radius: 2px;
      color: var(--watt-on-light-medium-emphasis);
      padding: var(--watt-space-xs) var(--watt-space-s);

      &:hover {
        cursor: pointer;
      }
    }
  `,
  template: `
    <watt-card *transloco="let t; read: 'meteringPoint.overview.customer'" class="customer">
      <watt-card-title>
        <h3>{{ t('title') }}</h3>
      </watt-card-title>

      <div
        vater-stack
        direction="row"
        gap="s"
        class="protected-address watt-space-inset-s watt-space-stack-m"
      >
        <watt-icon name="warning" state="warning" />
        <span class="watt-text-s">{{ t('protectedAddress') }}</span>
      </div>

      <h4 class="watt-space-stack-s">Kunde 1</h4>
      <p class="info-text watt-text-s">{{ t('intoText') }}</p>

      <watt-description-list class="watt-space-stack-l" variant="stack" [itemSeparators]="false">
        <watt-description-list-item [label]="t('nameLabel')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('cprLabel')">
          <button type="button" class="show-cpr-button">
            {{ t('showCPRButton') }}
          </button>
        </watt-description-list-item>
      </watt-description-list>

      <h4 class="watt-space-stack-s">Kunde 2</h4>

      <watt-description-list variant="stack" [itemSeparators]="false">
        <watt-description-list-item [label]="t('nameLabel')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('cprLabel')">
          <button type="button" class="show-cpr-button">
            {{ t('showCPRButton') }}
          </button>
        </watt-description-list-item>
      </watt-description-list>
    </watt-card>
  `,
})
export class DhCustomerOverviewComponent {}
