import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { dayjs } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-user-latest-login',
  standalone: true,
  template: `
    @let days = daysSince();
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      @switch (days) {
        @case (null) {
          {{ t('never') }}
        }
        @case (0) {
          {{ t('today') }}
        }
        @case (1) {
          {{ t('yesterday') }}
        }
        @default {
          {{ t('daysAgo', { days }) }}
        }
      }
    </ng-container>
  `,
  imports: [TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhUserLatestLoginComponent {
  latestLoginAt = input<Date | null>();

  daysSince = computed(() => {
    return this.latestLoginAt() ? dayjs(new Date()).diff(this.latestLoginAt(), 'days') : null;
  });
}
