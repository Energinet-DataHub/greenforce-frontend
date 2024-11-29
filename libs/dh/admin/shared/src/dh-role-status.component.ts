import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { UserRoleStatus } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-role-status',
  standalone: true,
  template: `<ng-container *transloco="let t; read: 'admin.userManagement.roleStatus'">
    @if (status() === UserRoleStatus.Active) {
      <watt-badge type="info">{{ t('ACTIVE') }}</watt-badge>
    } @else if (status() === UserRoleStatus.Inactive) {
      <watt-badge type="warning">{{ t('INACTIVE') }}</watt-badge>
    }
  </ng-container>`,
  imports: [TranslocoDirective, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhRoleStatusComponent {
  UserRoleStatus = UserRoleStatus;

  status = input.required<UserRoleStatus>();
}
