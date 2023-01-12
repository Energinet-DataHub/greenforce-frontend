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
import { Component, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';

import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { DhTabsComponent } from '.././tabs/dh-drawer-tabs.component';
import { UserRoleInfoDto } from '@energinet-datahub/dh/shared/domain';
import { DhRoleStatusComponent } from "../../shared/dh-role-status.component";

@Component({
    selector: 'dh-role-drawer',
    standalone: true,
    templateUrl: './dh-role-drawer.component.html',
    styles: [
        `
      .role-name__grid {
        display: flex;
        align-items: center;
        gap: var(--watt-space-s);
        margin-bottom: 28px; /* Magic UX number */
      }

      .role-name__headline {
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
        DhRoleStatusComponent
    ]
})
export class DhRoleDrawerComponent {
  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  selectedRole: UserRoleInfoDto | null = null;

  onClose(): void {
    this.drawer.close();
    this.selectedRole = null;
  }

  open(role: UserRoleInfoDto): void {
    this.selectedRole = role;
    this.drawer.open();
  }
}
