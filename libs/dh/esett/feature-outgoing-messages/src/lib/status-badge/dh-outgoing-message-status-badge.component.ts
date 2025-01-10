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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { dayjs } from '@energinet-datahub/watt/date';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { DocumentStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-outgoing-message-status-badge',
  template: `
    @let _status = status();

    <ng-container *transloco="let t; read: 'eSett.outgoingMessages.shared.documentStatus'">
      @switch (_status) {
        @case ('RECEIVED') {
          <watt-badge [type]="isSevere() ? 'danger' : 'neutral'">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('AWAITING_DISPATCH') {
          <watt-badge [type]="isSevere() ? 'danger' : 'neutral'">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('BIZ_TALK_ACCEPTED') {
          <watt-badge [type]="isSevere() ? 'danger' : 'neutral'">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('AWAITING_REPLY') {
          <watt-badge [type]="isSevere() ? 'danger' : 'neutral'">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('ACCEPTED') {
          <watt-badge type="success">{{ t(_status) }}</watt-badge>
        }
        @case ('REJECTED') {
          <watt-badge type="warning">{{ t(_status) }}</watt-badge>
        }
        @case ('MANUALLY_HANDLED') {
          <watt-badge type="success">{{ t(_status) }}</watt-badge>
        }
        @default {
          {{ _status | dhEmDashFallback }}
        }
      }
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WattBadgeComponent, DhEmDashFallbackPipe],
})
export class DhOutgoingMessageStatusBadgeComponent {
  status = input<DocumentStatus>();
  created = input<Date>();

  isSevere = computed(() => {
    const created = this.created();
    const status = this.status();

    if (created == null || status == null) {
      return false;
    }

    const secondsPassed = dayjs(new Date()).diff(created, 'second');

    switch (status) {
      case 'RECEIVED':
        return secondsPassed > 30; // 30 seconds to convert.
      case 'AWAITING_DISPATCH':
        return secondsPassed > 60 * 30; // 30 minutes to dispatch.
      case 'BIZ_TALK_ACCEPTED':
        return secondsPassed > 60 * 30; // 30 minutes to dispatch.
      case 'AWAITING_REPLY':
        return secondsPassed > 60 * 60; // 1 hour to reply.
      default:
        return false;
    }
  });
}
