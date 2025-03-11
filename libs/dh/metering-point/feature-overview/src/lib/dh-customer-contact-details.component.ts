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
          @if (contact.technicalContact) {
            <div>
              <h3>{{ t('technicalContact') }}</h3>

              <watt-description-list variant="stack" [itemSeparators]="false">
                <watt-description-list-item
                  [label]="t('name')"
                  [value]="contact.name | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('phone')"
                  [value]="contact.technicalContact.phone | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('email')"
                  [value]="contact.technicalContact.email | dhEmDashFallback"
                />
                <watt-description-list-item [label]="t('address')">
                  {{ contact.technicalContact.streetName | dhEmDashFallback }}
                  {{ contact.technicalContact.buildingNumber | dhEmDashFallback }}
                </watt-description-list-item>
                <watt-description-list-item
                  [label]="t('country')"
                  [value]="contact.technicalContact.countryCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('streetCode')"
                  [value]="contact.technicalContact.streetCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('postDistrict')"
                  [value]="contact.technicalContact.postCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('postBox')"
                  [value]="contact.technicalContact.postBox | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('municipalityCode')"
                  [value]="contact.technicalContact.municipalityCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('darID')"
                  [value]="contact.technicalContact.darReference | dhEmDashFallback"
                />
              </watt-description-list>
            </div>
          }

          @if (contact.legalContact) {
            <div>
              <h3>{{ t('legalContact') }}</h3>

              <watt-description-list variant="stack" [itemSeparators]="false">
                <watt-description-list-item
                  [label]="t('name')"
                  [value]="contact.name | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('phone')"
                  [value]="contact.legalContact.phone | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('email')"
                  [value]="contact.legalContact.email | dhEmDashFallback"
                />
                <watt-description-list-item [label]="t('address')">
                  {{ contact.legalContact.streetName | dhEmDashFallback }}
                  {{ contact.legalContact.buildingNumber | dhEmDashFallback }}
                </watt-description-list-item>
                <watt-description-list-item
                  [label]="t('country')"
                  [value]="contact.legalContact.countryCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('streetCode')"
                  [value]="contact.legalContact.streetCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('postDistrict')"
                  [value]="contact.legalContact.postCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('postBox')"
                  [value]="contact.legalContact.postBox | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('municipalityCode')"
                  [value]="contact.legalContact.municipalityCode | dhEmDashFallback"
                />
                <watt-description-list-item
                  [label]="t('darID')"
                  [value]="contact.legalContact.darReference | dhEmDashFallback"
                />
              </watt-description-list>
            </div>
          }
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
export class DhCustomerContactDetailsComponent extends WattTypedModal<Contact[]> {}
