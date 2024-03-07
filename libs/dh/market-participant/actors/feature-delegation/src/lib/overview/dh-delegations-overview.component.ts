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
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhDelegationsByType } from '../dh-delegations';

@Component({
  selector: 'dh-delegations-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WattButtonComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.delegation'">
      <vater-stack direction="row" justify="flex-end" class="watt-space-stack-m">
        <watt-button (click)="setUpDelegation.emit()" variant="secondary">
          {{ t('setUpDelegation') }}
        </watt-button>
      </vater-stack>

      @if (outgoing().length > 0) {
        <watt-expandable-card togglePosition="before" variant="solid">
          <watt-expandable-card-title>{{ t('outgoingMessages') }}</watt-expandable-card-title>

          @for (entry of outgoing(); track $index) {
            <watt-expandable-card togglePosition="before" variant="solid">
              <watt-expandable-card-title>{{ entry.type }}</watt-expandable-card-title>
            </watt-expandable-card>
          }
        </watt-expandable-card>
      }

      @if (incoming().length > 0) {
        <watt-expandable-card togglePosition="before" variant="solid">
          <watt-expandable-card-title>{{ t('incomingMessages') }}</watt-expandable-card-title>

          @for (entry of incoming(); track $index) {
            <watt-expandable-card togglePosition="before" variant="solid">
              <watt-expandable-card-title>{{ entry.type }}</watt-expandable-card-title>
            </watt-expandable-card>
          }
        </watt-expandable-card>
      }
    </ng-container>
  `,
})
export class DhDelegationsOverviewComponent {
  outgoing = input<DhDelegationsByType[]>([]);
  incoming = input<DhDelegationsByType[]>([]);

  @Output() setUpDelegation = new EventEmitter<void>();
}
