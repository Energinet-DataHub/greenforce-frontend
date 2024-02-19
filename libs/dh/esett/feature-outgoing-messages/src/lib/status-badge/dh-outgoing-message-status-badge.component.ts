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
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { differenceInSeconds } from 'date-fns';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { DocumentStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  standalone: true,
  selector: 'dh-outgoing-message-status-badge',
  template: `
    <ng-container
      [ngSwitch]="status"
      *transloco="let t; read: 'eSett.outgoingMessages.shared.documentStatus'"
    >
      <watt-badge *ngSwitchCase="'RECEIVED'" [type]="isSevere() ? 'danger' : 'neutral'">
        {{ t(status!) }}
      </watt-badge>
      <watt-badge *ngSwitchCase="'AWAITING_DISPATCH'" [type]="isSevere() ? 'danger' : 'neutral'">
        {{ t(status!) }}
      </watt-badge>
      <watt-badge *ngSwitchCase="'BIZ_TALK_ACCEPTED'" [type]="isSevere() ? 'danger' : 'neutral'">
        {{ t(status!) }}
      </watt-badge>
      <watt-badge *ngSwitchCase="'AWAITING_REPLY'" [type]="isSevere() ? 'danger' : 'neutral'">
        {{ t(status!) }}
      </watt-badge>

      <watt-badge *ngSwitchCase="'ACCEPTED'" type="success">{{ t(status!) }}</watt-badge>
      <watt-badge *ngSwitchCase="'REJECTED'" type="warning">{{ t(status!) }}</watt-badge>

      <ng-container *ngSwitchDefault>{{ status | dhEmDashFallback }}</ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    TranslocoDirective,

    WattBadgeComponent,
    DhEmDashFallbackPipe,
  ],
})
export class DhOutgoingMessageStatusBadgeComponent {
  @Input({ required: true }) status: DocumentStatus | null | undefined = null;
  @Input({ required: true }) created: Date | null | undefined = null;

  isSevere(): boolean {
    if (!this.created) return false;

    const secondsPassed = differenceInSeconds(new Date(), this.created);

    switch (this.status) {
      case 'RECEIVED':
        return secondsPassed > 30; // 30 seconds to convert.
      case 'AWAITING_DISPATCH':
        return secondsPassed > 60 * 30; // 30 minutes to dispatch.
      case 'BIZ_TALK_ACCEPTED':
        return secondsPassed > 60 * 30; // 30 minutes to dispatch.
      case 'AWAITING_REPLY':
        return secondsPassed > 60 * 60; // 1 hour to reply.
    }

    return false;
  }
}
