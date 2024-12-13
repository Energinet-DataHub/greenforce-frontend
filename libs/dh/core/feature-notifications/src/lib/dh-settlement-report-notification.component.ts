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
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-settlement-reports';

import { DhNotification } from './dh-notification';

@Component({
    selector: 'dh-settlement-report-notification',
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
  `
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
