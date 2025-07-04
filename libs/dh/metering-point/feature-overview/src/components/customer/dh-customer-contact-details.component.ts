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
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';

import { Contact } from '../../types';
import { DhCustomerContactComponent } from './dh-customer-contact.component';

@Component({
  selector: 'dh-customer-contact-details',
  imports: [
    TranslocoDirective,
    WATT_CARD,
    WATT_MODAL,
    WattButtonComponent,
    VaterStackComponent,
    DhCustomerContactComponent,
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
      <vater-stack direction="column" align="start">
        <h3>{{ t('legalContact') }}</h3>
        @if (this.legalContact) {
          <dh-customer-contact [contact]="legalContact" />
        }
        <h3>{{ t('technicalContact') }}</h3>
        @if (this.technicalContact) {
          <dh-customer-contact [contact]="technicalContact" />
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
  protected technicalContact = this.modalData.find((x) => x.technicalContact)?.technicalContact;
  protected legalContact = this.modalData.find((x) => x.legalContact)?.legalContact;
}
