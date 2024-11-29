import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-settlement-reports';

import { DhNotification } from './dh-notification';

@Component({
  selector: 'dh-settlement-report-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, TranslocoDirective, WattDatePipe, WattIconComponent],
  providers: [DhSettlementReportsService],
  styleUrl: './dh-notification.component.scss',
  styles: `
    .notification__message {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
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
          {{ t(notification().notificationType + '.message') }}
        </h5>
        <p class="notification__message" [title]="settlementReportName()">
          {{ settlementReportName() }}
        </p>
        <button type="button" class="action-button" (click)="$event.stopPropagation(); download()">
          {{ 'shared.download' | transloco }}
        </button>
      </div>
    </ng-container>
  `,
})
export class DhSettlementReportNotificationComponent {
  private readonly settlementReportsService = inject(DhSettlementReportsService);

  notification = input.required<DhNotification>();

  dismiss = output<void>();

  settlementReportName = this.settlementReportsService.settlementReportNameInNotification;

  getSettlementReportNamEffect = effect(() => {
    const settlementReportId = this.notification().relatedToId as string;

    this.settlementReportsService.getSettlementReportName(settlementReportId);
  });

  download() {
    const settlementReportId = this.notification().relatedToId as string;

    this.settlementReportsService.downloadReportFromNotification(settlementReportId);
  }
}
