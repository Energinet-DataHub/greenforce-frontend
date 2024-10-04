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
import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { HotToastService } from '@ngxpert/hot-toast';

import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhNotificationBannerComponent } from './dh-notification-banner.component';

@Component({
  selector: 'dh-notifications-center',
  standalone: true,
  imports: [OverlayModule, TranslocoDirective, WattButtonComponent],
  styles: [
    `
      :host {
        display: block;
      }

      .notifications-panel {
        background-color: var(--watt-color-neutral-white);
        border-radius: 4px;
        min-width: 350px;
      }

      h3 {
        border-bottom: 1px solid var(--watt-color-neutral-grey-200);
        margin: 0;
        padding: var(--watt-space-m) var(--watt-space-ml);
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
      icon="notifications"
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

  isOpen = false;

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
        'background-color': 'rgba(219, 219, 219, 0.3)',
        border: '1px solid #bdbdbd', // gray-400
        width: '345px',
        color: 'rgba(0, 0, 0, 0.87)', // on-light-high-emphasis
        'backdrop-filter': 'blur(30px)',
      },
      closeStyle: {
        position: 'absolute',
        left: '-10px',
        top: '-10px',
        'background-color': 'rgb(237, 237, 237)',
        width: '12px',
        height: '12px',
        border: '1px solid #bdbdbd', // gray-400
        'border-radius': '50%',
        opacity: '1',
      },
    });
  }
}
