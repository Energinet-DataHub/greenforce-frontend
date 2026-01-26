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
import { Case } from '../types';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { DatePipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-actor-conversation-list-item',
  imports: [VaterStackComponent, DatePipe, VaterFlexComponent, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.selected]': 'selected()',
    '[style.display]': '"block"',
    '[style.cursor]': '"pointer"',
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

    .unread-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--watt-color-primary);
    }
  `,
  template: `
    <div class="unread-indicator"></div>
    <vater-flex
      align="start"
      gap="xs"
      class="inset-stretch-inverted"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack fill="horizontal" direction="row" justify="space-between">
        <h5 class="no-margin">{{ t('subjects.' + case().subject) }}</h5>
        @if (case().closed) {
          <span>{{ t('closed') }}</span>
        }
      </vater-stack>
      <vater-stack fill="horizontal" direction="row" justify="space-between">
        <span class="light-text font-size-s">{{ case().id }}</span>
        <span class="light-text font-size-s">{{
            case().lastUpdatedDate | date: 'dd-MM-yyyy'
          }}</span>
      </vater-stack>
    </vater-flex>
    <hr class="watt-divider no-margin" />
  `,
})
export class DhActorConversationListItemComponent {
  case = input.required<Case>();
  selected = input<boolean>(false);
}
