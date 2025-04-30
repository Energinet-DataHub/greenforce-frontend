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
import { Component, input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { CustomerContactDto } from '@energinet-datahub/dh/shared/domain/graphql';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhCustomerProtectedComponent } from './dh-customer-protected.component';
import { DhAddressComponent } from '../address/dh-address.component';

@Component({
  imports: [
    TranslocoDirective,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhEmDashFallbackPipe,
    DhCustomerProtectedComponent,
    DhAddressComponent,
  ],
  selector: 'dh-customer-contact',
  template: `
    @if (contact().isProtectedAddress) {
      <dh-customer-protected />
    }
    <watt-description-list
      *transloco="let t; read: 'meteringPoint.overview.customerContactDetails'"
      variant="stack"
      [itemSeparators]="false"
    >
      <watt-description-list-item [label]="t('name')" [value]="contact().name | dhEmDashFallback" />
      @if (contact().phone) {
        <watt-description-list-item [label]="t('phone')" [value]="contact().phone" />
      }
      @if (contact().mobile) {
        <watt-description-list-item
          [label]="contact().phone ? t('mobile') : t('phone')"
          [value]="contact().mobile"
        />
      }
      @if (!contact().phone && !contact().mobile) {
        <watt-description-list-item [label]="t('phone')" [value]="null | dhEmDashFallback" />
      }

      <watt-description-list-item
        [label]="t('email')"
        [value]="contact().email | dhEmDashFallback"
      />

      <watt-description-list-item [label]="t('address')">
        @let address = contact();
        @if (address) {
          <dh-address [address]="address" />
        }
      </watt-description-list-item>

      <watt-description-list-item
        [label]="t('streetCode')"
        [value]="contact().streetCode | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('postDistrict')"
        [value]="contact().citySubDivisionName | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('postBox')"
        [value]="contact().postBox | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('municipalityCode')"
        [value]="contact().municipalityCode | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('darID')"
        [value]="contact().darReference | dhEmDashFallback"
      />
    </watt-description-list>
  `,
})
export class DhCustomerContactComponent {
  contact = input.required<CustomerContactDto>();
}
