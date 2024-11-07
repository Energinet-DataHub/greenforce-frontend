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
import { Router } from '@angular/router';
import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  DismissNotificationDocument,
  GetNotificationsDocument,
  OnNotificationAddedDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIcon } from '@energinet-datahub/watt/icon';
import { dayjs } from '@energinet-datahub/watt/date';

import { dhGetRouteByType } from './dh-get-route-by-type';
import { DhNotification } from './dh-notification';
import { DhNotificationComponent } from './dh-notification.component';
import { DhNotificationsCenterService } from './dh-notifications-center.service';

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

      .notifications-panel__items {
        max-height: 400px;
        overflow-y: auto;
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

      .notification-dot {
        position: relative;

        &::before {
          background-color: var(--watt-color-state-danger);
          border-radius: 50%;
          content: '';
          height: 5px;
          left: 25px;
          position: absolute;
          top: 16.2px;
          transform: translateY(-50%);
          width: 5px;
          z-index: 4;
        }
      }
    `,
  ],
  template: `
    <watt-button
      variant="icon"
      [class.notification-dot]="notificationDot()"
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

        <div class="notifications-panel__items">
          @for (notification of notifications(); track notification.id) {
            <dh-notification
              [notification]="notification"
              (click)="navigateTo(notification)"
              (dismiss)="onDismiss(notification.id)"
              (actionButtonClicked)="onActionButtonClicked(notification)"
            />
          } @empty {
            <p class="no-notifications">{{ t('noNotifications') }}</p>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class DhNotificationsCenterComponent {
  private readonly router = inject(Router);
  private readonly notificationsService = inject(DhNotificationsCenterService);
  private readonly dismissMutation = mutation(DismissNotificationDocument);
  private readonly getNotificationsQuery = query(GetNotificationsDocument);

  private readonly initTime = new Date();

  isOpen = false;

  notifications = computed(() => {
    const notifications = structuredClone(this.getNotificationsQuery.data()?.notifications ?? []);
    return notifications.sort(this.sortById);
  });

  constructor() {
    this.getNotificationsQuery.subscribeToMore({
      document: OnNotificationAddedDocument,
      updateQuery: (pref, { subscriptionData }) => {
        const incomingNotification = subscriptionData.data?.notificationAdded;
        if (!incomingNotification) return pref;

        if (dayjs(incomingNotification.occurredAt).isAfter(this.initTime)) {
          this.notificationsService.showBanner(incomingNotification);
        }

        const notifications = [...pref.notifications, incomingNotification]
          .filter((value, index, self) => self.findIndex((n) => n.id === value.id) === index)
          .sort(this.sortById);

        return {
          ...pref,
          notifications,
        };
      },
    });
  }

  notificationIcon = computed<WattIcon>(() =>
    this.notifications().length === 0 ? 'notifications' : 'notificationsUnread'
  );

  notificationDot = computed<boolean>(() => this.notificationIcon() === 'notificationsUnread');

  positionPairs: ConnectionPositionPair[] = [
    {
      offsetX: 0,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
  ];

  navigateTo(notification: DhNotification): void {
    this.router.navigate(dhGetRouteByType(notification));
  }

  onDismiss(notificationId: number): void {
    this.dismissMutation.mutate({
      variables: { input: { notificationId } },
      refetchQueries: [GetNotificationsDocument],
      onError: () => console.error('Failed to dismiss notification'),
    });
  }

  onActionButtonClicked(notification: DhNotification): void {
    this.notificationsService.handleActionButtonClick(notification);
  }

  private sortById(a: DhNotification, b: DhNotification): number {
    return b.id - a.id;
  }
}
