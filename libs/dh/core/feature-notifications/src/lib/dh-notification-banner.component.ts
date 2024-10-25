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
import { HotToastRef } from '@ngxpert/hot-toast';

import { DhNotification } from './dh-notification';

@Component({
  selector: 'dh-notification-banner',
  standalone: true,
  imports: [TranslocoDirective],
  styles: `
    :host {
      display: block;
    }

    p {
      margin: 0;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'notificationsCenter.notification'">
      <h5 class="watt-space-stack-xxs">{{ t(toastRef.data.notificationType + '.headline') }}</h5>
      <p>
        {{
          t(toastRef.data.notificationType + '.message', { relatedToId: toastRef.data.relatedToId })
        }}
      </p>
    </ng-container>
  `,
})
export class DhNotificationBannerComponent {
  public toastRef = inject<HotToastRef<DhNotification>>(HotToastRef);
}
