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

import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';

@Component({
  selector: 'dh-cancel-process-modal',
  imports: [TranslocoDirective, WATT_MODAL, WattButtonComponent, WattIconComponent],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.cancelProcess'"
      [title]="t('title', { processType: modalData.processType })"
      #modal
    >
      <p>
        <watt-icon name="warning" />
        {{ t('body', { processType: modalData.processType }) }}
      </p>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button (click)="modal.close(true)">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhCancelProcessModal extends WattTypedModal<{ processType: string }> {}
