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
