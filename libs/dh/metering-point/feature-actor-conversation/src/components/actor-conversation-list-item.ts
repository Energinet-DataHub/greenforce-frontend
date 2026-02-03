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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Conversation } from '../types';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';
import { DhCircleComponent } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet/watt/date';

@Component({
  selector: 'dh-actor-conversation-list-item',
  imports: [
    VaterStackComponent,
    VaterFlexComponent,
    TranslocoDirective,
    DhCircleComponent,
    WattDatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.selected]': 'selected()',
    '[style.display]': '"block"',
    '[style.cursor]': '"pointer"',
    '[style.position]': '"relative"',
  },
  styles: `
    :host(.selected) {
      background-color: var(--watt-color-primary-ultralight);
    }

    :host(:hover) {
      background-color: var(--watt-color-neutral-grey-100);
    }

    :host(.selected:hover) {
      background-color: var(--watt-color-primary-ultralight);
    }

    .light-text {
      font-weight: 400;
      color: var(--watt-color-neutral-grey-600);
    }

    .inset-stretch-inverted {
      padding: var(--watt-space-m) var(--watt-space-ml);
    }

    .no-margin {
      margin: 0;
    }

    .min-height-line-height-xs {
      min-height: 22px;
    }

    .unread-indicator {
      position: absolute;
      left: var(--watt-space-s);
      color: var(--watt-color-primary);
    }
  `,
  template: `
    <vater-flex
      align="start"
      gap="xs"
      class="inset-stretch-inverted"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack fill="horizontal" direction="row" justify="space-between">
        @if (conversation().unread) {
          <dh-circle class="unread-indicator" />
        }
        <h5 class="no-margin">{{ t('subjects.' + conversation().subject) }}</h5>
        @if (conversation().closed) {
          <span>{{ t('closed') }}</span>
        }
      </vater-stack>
      <vater-stack
        fill="horizontal"
        direction="row"
        justify="space-between"
        class="min-height-line-height-xs"
      >
        <span class="light-text font-size-s">{{ conversation().id }}</span>
        <span class="light-text font-size-s">{{
          conversation().lastUpdatedDate | wattDate: 'short'
        }}</span>
      </vater-stack>
    </vater-flex>
    <hr class="watt-divider no-margin" />
  `,
})
export class DhActorConversationListItemComponent {
  conversation = input.required<Conversation>();
  selected = input<boolean>(false);
}
