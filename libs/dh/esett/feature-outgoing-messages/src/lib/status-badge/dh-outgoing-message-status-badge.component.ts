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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

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
      <watt-badge *ngSwitchCase="'ACCEPTED'" type="success">{{ t(status!) }}</watt-badge>
      <watt-badge *ngSwitchCase="'RECEIVED'" type="success">{{ t(status!) }}</watt-badge>
      <watt-badge *ngSwitchCase="'AWAITING_DISPATCH'" type="neutral">{{ t(status!) }}</watt-badge>
      <watt-badge *ngSwitchCase="'AWAITING_REPLY'" type="neutral">{{ t(status!) }}</watt-badge>
      <watt-badge *ngSwitchCase="'REJECTED'" type="danger">{{ t(status!) }}</watt-badge>

      <ng-container *ngSwitchCase="null || undefined">{{ status | dhEmDashFallback }}</ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoDirective, DhEmDashFallbackPipe, WattBadgeComponent],
})
export class DhOutgoingMessageStatusBadgeComponent {
  @Input({ required: true }) status: DocumentStatus | null | undefined = null;
}
