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
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { UserRoleAuditLog } from '../../../../userRoleAuditLog';

@Component({
  standalone: true,
  selector: 'dh-audit-change-cell',
  imports: [TranslocoModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.drawer.roles.tabs.history'">
      <div
        *ngIf="entry.changeType === 'CREATED'"
        [innerHTML]="
          t('logs.roles.CREATED', {
            changedByUserName: entry.changedByUserName
          })
        "
      ></div>
      <div
        *ngIf="entry.changeType === 'NAME_CHANGE'"
        [innerHTML]="
          t('logs.roles.NAME_CHANGE', {
            changedValueTo: entry.name,
            changedByUserName: entry.changedByUserName
          })
        "
      ></div>
      <div
        *ngIf="entry.changeType === 'DESCRIPTION_CHANGE'"
        [innerHTML]="
          t('logs.roles.DESCRIPTION_CHANGE', {
            changedValueTo: entry.description,
            changedByUserName: entry.changedByUserName
          })
        "
      ></div>
      <ng-container *transloco="let tStatus; read: 'admin.userManagement.roleStatus'">
        <div
          *ngIf="entry.changeType === 'STATUS_CHANGE'"
          [innerHTML]="
            t('logs.roles.STATUS_CHANGE', {
              changedValueTo: tStatus(entry.status.toLowerCase()),
              changedByUserName: entry.changedByUserName
            })
          "
        ></div>
      </ng-container>
      <div
        *ngIf="entry.changeType === 'PERMISSION_ADDED'"
        [innerHTML]="
          t('logs.roles.PERMISSION_ADDED', {
            changedValueTo: entry.permissions,
            changedByUserName: entry.changedByUserName
          })
        "
      ></div>
      <div
        *ngIf="entry.changeType === 'PERMISSION_REMOVED'"
        [innerHTML]="
          t('logs.roles.PERMISSION_REMOVED', {
            changedValueTo: entry.permissions,
            changedByUserName: entry.changedByUserName
          })
        "
      ></div>
    </ng-container>
  `,
})
export class DhAuditChangeCellComponent {
  @Input() entry!: UserRoleAuditLog;
}
