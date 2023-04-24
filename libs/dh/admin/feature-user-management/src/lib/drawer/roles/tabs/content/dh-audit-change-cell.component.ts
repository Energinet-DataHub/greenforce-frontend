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
