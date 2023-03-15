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
import { Component, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { WattCardModule } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattTabsComponent, WattTabComponent } from '@energinet-datahub/watt/tabs';
import { Permission } from '../permission';

@Component({
  selector: 'dh-admin-permission-detail',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dh-admin-permission-detail.component.html',
  styleUrls: ['./dh-admin-permission-detail.component.scss'],
  imports: [
    CommonModule,
    WattDrawerModule,
    TranslocoModule,
    WattCardModule,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattTabsComponent,
    WattTabComponent,
  ],
})
export class DhAdminPermissionDetailComponent {
  @ViewChild('drawer')
  drawer!: WattDrawerComponent;
  selectedPermission: Permission | null = null;

  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.selectedPermission = null;
  }

  open(permission: Permission): void {
    this.selectedPermission = permission;
    this.drawer.open();
  }
}
