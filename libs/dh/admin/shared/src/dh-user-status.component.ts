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
