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

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { DhActualAddressComponent } from './dh-actual-address.component';

import type { InstallationAddress } from './types';

@Component({
  selector: 'dh-address-details',
  imports: [
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
    DhActualAddressComponent,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; read: 'meteringPoint.overview.addressDetails'"
      [title]="t('title')"
      #modal
    >
      <watt-description-list variant="stack" [itemSeparators]="false">
        <watt-description-list-item
          [label]="t('address')"
          [value]="modalData.streetName | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('postCodeAndCity')"
          [value]="
            (modalData.cityName | dhEmDashFallback) + ' ' + (modalData.postCode | dhEmDashFallback)
          "
        />
        <watt-description-list-item
          [label]="t('country')"
          [value]="modalData.countryCode | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('streetCode')"
          [value]="modalData.streetCode | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('postDistrict')"
          [value]="modalData.postCode | dhEmDashFallback"
        />
        <watt-description-list-item [label]="t('postBox')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item
          [label]="t('municipalityCode')"
          [value]="modalData.municipalityCode | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('darID')"
          [value]="modalData.darReference | dhEmDashFallback"
        />
      </watt-description-list>

      <!-- <dh-actual-address [isActualAddress]="modalData.washInstruction" /> -->

      <watt-modal-actions>
        <watt-button (click)="modal.close(false)" variant="secondary">
          {{ t('closeButton') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhAddressDetailsComponent extends WattTypedModal<InstallationAddress> {}
