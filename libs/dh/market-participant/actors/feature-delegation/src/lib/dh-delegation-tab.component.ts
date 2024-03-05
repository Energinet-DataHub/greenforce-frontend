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
import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhDelegationCreateModalComponent } from './dh-delegation-create-modal.component';

@Component({
  selector: 'dh-delegation-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      vater-flex {
        watt-button {
          margin-left: auto;
        }
      }
    `,
  ],
  template: `
    <vater-flex *transloco="let t; read: 'marketParticipant.delegation'">
      <watt-button (click)="create()" variant="secondary">{{ t('create') }}</watt-button>
      <vater-stack direction="row" justify="center">
        <watt-empty-state
          icon="custom-no-results"
          [title]="t('emptyTitle')"
          [message]="t('emptyMessage')"
        />
      </vater-stack>
    </vater-flex>
  `,
  imports: [
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    WattEmptyStateComponent,
    WattButtonComponent,
  ],
})
export class DhDelegationTabComponent {
  private readonly _modalService = inject(WattModalService);

  create() {
    this._modalService.open({ component: DhDelegationCreateModalComponent });
  }
}
