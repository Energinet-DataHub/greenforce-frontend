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
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

import { DhTabsComponent } from './tabs/dh-drawer-tabs.component';

@Component({
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  styles: [
    `
      h1 {
        margin-top: 0;
      }
    `,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    WattDrawerModule,
    WattButtonModule,
    DhTabsComponent,
    WattBadgeComponent,
  ],
})
export class DhUserDrawerComponent {
  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  selectedUser: UserOverviewItemDto | null = null;

  onClose(): void {
    this.drawer.close();
    this.selectedUser = null;
  }

  open(user: UserOverviewItemDto): void {
    this.selectedUser = user;
    this.drawer.open();
  }
}
