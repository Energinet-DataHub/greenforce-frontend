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
import { NgIf } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { MarketParticipantUserStatus } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-user-status',
  standalone: true,
  template: `<ng-container *transloco="let t; read: 'admin.userManagement.userStatus'">
    <watt-badge *ngIf="status === 'Active'" type="info">{{ t('Active') }}</watt-badge>
    <watt-badge *ngIf="status === 'Inactive'" type="warning">{{ t('Inactive') }}</watt-badge>
    <watt-badge *ngIf="status === 'Invited'" type="info">{{ t('Invited') }}</watt-badge>
    <watt-badge *ngIf="status === 'InviteExpired'" type="warning">
      {{ t('InviteExpired') }}
    </watt-badge>
  </ng-container>`,
  imports: [NgIf, TranslocoDirective, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhUserStatusComponent {
  @Input() status!: MarketParticipantUserStatus;
}
