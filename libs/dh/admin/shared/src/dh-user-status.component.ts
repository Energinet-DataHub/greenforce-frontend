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
import { Component, Input, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-user-status',
  standalone: true,
  template: `<ng-container *transloco="let t; read: 'admin.userManagement.userStatus'">
    @if (status() === UserStatus.Active) {
      <watt-badge type="info">{{ t(UserStatus.Active) }}</watt-badge>
    } @else if (status() === UserStatus.Inactive) {
      <watt-badge type="warning">{{ t(UserStatus.Inactive) }}</watt-badge>
    } @else if (status() === UserStatus.Invited) {
      <watt-badge type="info">{{ t(UserStatus.Invited) }}</watt-badge>
    } @else if (status() === UserStatus.InviteExpired) {
      <watt-badge type="warning">
        {{ t(UserStatus.InviteExpired) }}
      </watt-badge>
    }
  </ng-container>`,
  imports: [TranslocoDirective, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhUserStatusComponent {
  status = input.required<UserStatus>();
  UserStatus = UserStatus;
}
