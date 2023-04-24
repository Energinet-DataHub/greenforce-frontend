import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { UserRoleAuditLogExtended } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  standalone: true,
  selector: 'dh-audit-change-cell',
  imports: [TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.drawer.roles.tabs.history'">
      <div
        [innerHTML]="
          entry.userRoleChangeType === 'PermissionsChange'
            ? entry.changeType === 'added'
              ? isSinglePermissionChange
                ? t('logs.roles.PermissionAdded.singular', entry)
                : t('logs.roles.PermissionAdded.plural', entry)
              : t('logs.roles.PermissionRemoved', entry)
            : t('logs.roles.' + entry.userRoleChangeType, entry)
        "
      ></div>
    </ng-container>
  `,
})
export class DhAuditChangeCellComponent {
  @Input() entry!: UserRoleAuditLogExtended;

  get isSinglePermissionChange(): boolean {
    return this.entry.changedValueTo.includes(',') === false;
  }
}
