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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

import { DhNotification } from './dh-notification';
import { WattDatePipe } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, WattDatePipe],
  styles: `
    :host {
      display: block;
    }

    .notification {
      padding: var(--watt-space-m) var(--watt-space-ml) var(--watt-space-m) 28px;
      position: relative;

      &__datetime {
        color: var(--watt-on-light-medium-emphasis);
      }

      &--unread {
        .notification__headline {
          position: relative;

          &:before {
            content: '';
            background-color: var(--watt-color-state-info);
            border-radius: 50%;
            height: 8px;
            left: -16px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
          }
        }
      }

      &__message {
        margin: 0;
      }
    }
  `,
  template: `<div class="notification" [ngClass]="{ 'notification--unread': notification().read }">
    <span class="notification__datetime watt-text-s">
      {{ notification().datetime | wattDate: 'long' }}
    </span>
    <h5 class="notification__headline watt-space-stack-xxs">{{ notification().headline }}</h5>
    <p class="notification__message">{{ notification().message }}</p>
  </div>`,
})
export class DhNotificationComponent {
  notification = input.required<DhNotification>();
}
