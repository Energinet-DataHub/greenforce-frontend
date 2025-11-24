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
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';

@Component({
  selector: 'dh-metering-point-cancel-charge-link',
  imports: [TranslocoDirective, ReactiveFormsModule, WATT_MODAL, WattButtonComponent],
  styles: `
    :host {
      form > * {
        width: 50%;
      }
    }
  `,
  template: `
    <watt-modal
      size="small"
      #cancel
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.cancel'"
      [title]="t('title')"
    >
      {{ t('cancelWarning') }}
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="cancel.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="secondary" (click)="cancelLink(); cancel.close(true)">
          {{ t('cancel') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMeteringPointCancelChargeLink extends WattTypedModal {
  cancelLink() {
    console.log('Cancelling link with values:');
  }
}
