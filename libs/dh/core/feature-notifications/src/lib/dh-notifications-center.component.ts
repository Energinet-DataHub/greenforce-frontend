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
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { HotToastService } from '@ngxpert/hot-toast';

import { subscription } from '@energinet-datahub/dh/shared/util-apollo';
import { OnNotificationAddedDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattColor, WattColorHelperService } from '@energinet-datahub/watt/color';
import { WattIcon } from '@energinet-datahub/watt/icon';

import { DhNotification } from './dh-notification';
import { DhNotificationBannerComponent } from './dh-notification-banner.component';
import { DhNotificationComponent } from './dh-notification.component';

@Component({
  selector: 'dh-notifications-center',
  standalone: true,
  imports: [OverlayModule, TranslocoDirective, WattButtonComponent, DhNotificationComponent],
  styles: [
    `
      :host {
        display: block;
      }

      .notifications-panel {
        background-color: var(--watt-color-neutral-white);
        border-radius: 8px;
        width: 344px;
      }

      h3 {
        border-bottom: 1px solid var(--watt-color-neutral-grey-200);
        margin: 0;
        padding: var(--watt-space-m) var(--watt-space-ml);
      }

      dh-notification:not(:last-of-type) {
        border-bottom: 1px solid var(--watt-color-neutral-grey-200);
      }

      .no-notifications {
        margin: 0;
        padding: var(--watt-space-m) var(--watt-space-ml);
      }

      watt-button {
        margin: var(--watt-space-m) var(--watt-space-ml);
      }
    `,
  ],
  template: `
    <watt-button
      variant="icon"
      [icon]="notificationIcon()"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      (click)="isOpen = !isOpen"
    />

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayPositions]="positionPairs"
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen"
      (backdropClick)="isOpen = false"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="noop"
    >
      <div
        *transloco="let t; read: 'notificationsCenter'"
        class="notifications-panel watt-elevation"
      >
        <h3>{{ t('headline') }}</h3>

        @for (item of notifications(); track item) {
          <dh-notification [notification]="item" />
        }

        <p class="no-notifications">{{ t('noNotifications') }}</p>

        <watt-button variant="primary" (click)="showNotificationBanner()">
          Show notification
        </watt-button>
      </div>
    </ng-template>
  `,
})
export class DhNotificationsCenterComponent {
  private readonly hotToast = inject(HotToastService);
  private readonly colorService = inject(WattColorHelperService);

  isOpen = false;

  notifications = signal<DhNotification[]>([]);
  notificationAdded = subscription(OnNotificationAddedDocument, {
    onData: (data) => {
      const { occurredAt: datetime, reasonIdentifier: headline } = data.notificationAdded;
      const notification: DhNotification = { datetime, headline, message: '', read: false };
      this.notifications.update((notifications) => [notification, ...notifications]);
    },
  });

  notificationIcon = computed<WattIcon>(() =>
    this.notifications().every((n) => n.read) ? 'notifications' : 'notificationsUnread'
  );

  positionPairs: ConnectionPositionPair[] = [
    {
      offsetX: 0,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
  ];

  showNotificationBanner(): void {
    this.hotToast.show(DhNotificationBannerComponent, {
      position: 'top-right',
      dismissible: true,
      autoClose: false,
      style: {
        border: `1px solid ${this.colorService.getColor(WattColor.grey400)}`,
        'backdrop-filter': 'blur(30px)',
      },
      closeStyle: {
        position: 'absolute',
        left: '-10px',
        top: '-10px',
      },
    });
  }
}
