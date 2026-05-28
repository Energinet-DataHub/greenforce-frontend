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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';

@Component({
  selector: 'dh-actor-conversation-confirm-close-conversation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WATT_MODAL, WattButtonComponent, TranslocoDirective],
  template: `
    <watt-modal
      size="small"
      #modal
      *transloco="let t; prefix: 'meteringPoint.actorConversation.confirmCloseConversation'"
      [title]="t('title')"
    >
      <p>{{ t('message') }}</p>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancelButton') }}
        </watt-button>
        <watt-button (click)="modal.close(true)">
          {{ t('confirmButton') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhActorConversationConfirmCloseConversation extends WattTypedModal {}
