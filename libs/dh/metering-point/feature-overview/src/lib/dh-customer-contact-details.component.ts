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

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { CustomerRelation } from '@energinet-datahub/dh/shared/domain/graphql';

import { Contact } from './types';

@Component({
  selector: 'dh-customer-contact-details',
  imports: [
    TranslocoDirective,

    WATT_CARD,
    WATT_MODAL,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    VaterStackComponent,

    DhEmDashFallbackPipe,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; read: 'meteringPoint.overview.customerContactDetails'"
      [title]="t('title')"
      size="large"
      #modal
    >
      <vater-stack direction="column" align="flex-start">
        @for (contact of modalData; track contact.id) {
          <div>
            <h3>
              @if (contact.relationType === CustomerRelation.Technical) {
                {{ t('technicalContact') }}
              }

              @if (contact.relationType === CustomerRelation.Legal) {
                {{ t('legalContact') }}
              }
            </h3>
            <watt-description-list variant="stack" [itemSeparators]="false">
              <watt-description-list-item
                [label]="t('name')"
                [value]="contact.name | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('phone')"
                [value]="contact.phone | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('email')"
                [value]="contact.email | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('address')"
                [value]="contact.address.streetName | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('country')"
                [value]="contact.address.countryCode | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('streetCode')"
                [value]="contact.address.streetCode | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('postDistrict')"
                [value]="contact.address.postCode | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('postBox')"
                [value]="contact.address.postBox | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('municipalityCode')"
                [value]="contact.address.municipalityCode | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('darID')"
                [value]="contact.address.darReference | dhEmDashFallback"
              />
            </watt-description-list>
          </div>
        }
      </vater-stack>

      <watt-modal-actions>
        <watt-button (click)="modal.close(false)" variant="secondary">
          {{ t('closeButton') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhCustomerContactDetailsComponent extends WattTypedModal<Contact[]> {
  CustomerRelation = CustomerRelation;
}
