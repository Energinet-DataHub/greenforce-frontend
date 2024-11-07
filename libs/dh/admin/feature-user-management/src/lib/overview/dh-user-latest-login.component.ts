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
