import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { DhNotification } from './dh-notification';

@Component({
  selector: 'dh-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WattDatePipe, WattIconComponent],
  styleUrl: './dh-notification.component.scss',
  template: `
    <ng-container *transloco="let t; read: 'notificationsCenter.notification'">
      <div class="notification notification--unread">
        <watt-icon
          name="close"
          class="icon-dismiss"
          [title]="t('markAsRead')"
          (click)="$event.stopPropagation(); dismiss.emit()"
        />

        <span class="notification__datetime watt-text-s">
          {{ notification().occurredAt | wattDate: 'long' }}
        </span>
        <h5 class="notification__headline watt-space-stack-xxs">
          {{ t(notification().notificationType + '.headline') }}
        </h5>
        <p class="notification__message">
          {{
            t(notification().notificationType + '.message', {
              relatedToId: notification().relatedToId,
            })
          }}
        </p>
      </div>
    </ng-container>
  `,
})
export class DhNotificationComponent {
  notification = input.required<DhNotification>();

  dismiss = output<void>();
}
