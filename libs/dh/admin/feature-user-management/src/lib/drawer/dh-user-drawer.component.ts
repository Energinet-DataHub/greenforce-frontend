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
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';

import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

import { DhTabsComponent } from './tabs/dh-drawer-tabs.component';
import { DhUserStatusComponent } from '../shared/dh-user-status.component';
import { DhEditUserModalComponent } from './dh-edit-user-modal/dh-edit-user-modal.component';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  styles: [
    `
      .user-name__grid {
        display: flex;
        align-items: center;
        gap: var(--watt-space-s);
      }

      .user-name__headline {
        margin: 0;
      }
    `,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    WattDrawerModule,
    WattButtonModule,
    DhTabsComponent,
    DhUserStatusComponent,
    DhEditUserModalComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhUserDrawerComponent {
  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  selectedUser: UserOverviewItemDto | null = null;

  @Output() closed = new EventEmitter<void>();

  isEditUserModalVisible = false;

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.selectedUser = null;
  }

  open(user: UserOverviewItemDto): void {
    this.selectedUser = user;
    this.drawer.open();
  }

  modalOnClose(): void {
    this.isEditUserModalVisible = false;
  }
}
