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
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterFlexComponent, VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattMenuComponent, WattMenuItemComponent, WattMenuTriggerDirective } from '@energinet/watt/menu';
import { DhActorConversationTextAreaComponent } from './actor-conversation-text-area.component';
import { NonNullableFormBuilder } from '@angular/forms';
import { Conversation } from '../types';

@Component({
  selector: 'dh-actor-conversation-selected-conversation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattIconComponent,
    VaterStackComponent,
    WattBadgeComponent,
    WattButtonComponent,
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuTriggerDirective,
    DhActorConversationTextAreaComponent,
    VaterUtilityDirective,
    VaterFlexComponent,
  ],
  styles: `
    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <vater-stack fill="both">
      <!-- Header -->
      <vater-stack
        direction="row"
        fill="horizontal"
        justify="space-between"
        class="watt-space-inset-stretch-m"
      >
        <vater-stack gap="s" align="start">
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

        <vater-stack direction="row" gap="m">
          <watt-button [disabled]="true" variant="secondary">Afslut sag</watt-button>
          <watt-button variant="secondary" [wattMenuTriggerFor]="menu">
            <watt-icon name="moreVertical" />
          </watt-button>
          <watt-menu #menu>
            <watt-menu-item> Intern note</watt-menu-item>
            <watt-menu-item> Marker som ulæst</watt-menu-item>
          </watt-menu>
        </vater-stack>
      </vater-stack>
      <hr class="watt-divider no-margin" />

      <!-- Content -->
      <vater-flex fill="both">
        <!-- Messages will go here -->
      </vater-flex>
      <vater-stack fill="horizontal" class="watt-space-inset-ml">
        <dh-actor-conversation-text-area
          vater
          fill="horizontal"
          [small]="true"
          [control]="formControl"
        />
      </vater-stack>
    </vater-stack>
  `,
})
export class DhActorConversationSelectedConversationComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  formControl = this.fb.control('');
  conversation = input.required<Conversation>()
}
