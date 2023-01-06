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
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { UserRoleStatus } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-role-status',
  standalone: true,
  template: `<ng-container
    *transloco="let t; read: 'admin.userManagement.roleStatus'"
  >
    <watt-badge *ngIf="status === 'Active'" type="info">{{
      t('active')
    }}</watt-badge>

    <watt-badge *ngIf="status === 'Inactive'" type="warning">{{
      t('inactive')
    }}</watt-badge>
  </ng-container>`,
  imports: [CommonModule, TranslocoModule, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhRoleStatusComponent {
  @Input() status!: UserRoleStatus;
}
