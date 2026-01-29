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
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattBadgeComponent } from '@energinet/watt/badge';

@Component({
  selector: 'dh-actor-conversation-selected-conversation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattIconComponent, VaterStackComponent, WattBadgeComponent],
  styles: `
    .no-margin {
      margin: 0;
    }

    .inset-stretch-inverted {
      padding: var(--watt-space-m) var(--watt-space-ml);
    }
  `,
  template: `
    <!-- Header -->
    <vater-stack gap="s" class="inset-stretch-inverted" align="start">
      <vater-stack direction="row" gap="xs">
        <span class="watt-text-s">Sort Strøm</span>
        <watt-icon name="right" size="xs" />
        <span class="watt-text-s">Netvirksomhed</span>
      </vater-stack>
      <vater-stack direction="row" gap="s">
        <h3 class="no-margin">Måledata</h3>
        <watt-badge type="neutral">Afsluttet</watt-badge>
      </vater-stack>
      <vater-stack direction="row" gap="m">
        <vater-stack direction="row" gap="xs">
          <label>ID</label>
          <span class="watt-text-s">521532</span>
        </vater-stack>
        <vater-stack direction="row" gap="xs">
          <label>Intern note</label>
          <span class="watt-text-s">CS00123645</span>
        </vater-stack>
      </vater-stack>
    </vater-stack>
    <hr class="watt-divider no-margin" />
  `,
})
export class DhActorConversationSelectedConversationComponent {}
