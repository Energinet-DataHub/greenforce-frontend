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
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';

import { WattButtonModule } from '@energinet-datahub/watt/button';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { DhAdminUserRoleWithPermissionsManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-edit-user-role-modal',
  templateUrl: './dh-edit-user-role-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PushModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabsModule,
  ],
})
export class DhEditUserRoleModalComponent implements AfterViewInit {
  private readonly store = inject(
    DhAdminUserRoleWithPermissionsManagementDataAccessApiStore
  );

  roleName$ = this.store.userRole$.pipe(map((role) => role?.name ?? ''));

  @ViewChild(WattModalComponent) editUserRoleModal!: WattModalComponent;

  @Output() closed = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.editUserRoleModal.open();
  }

  closeModal(): void {
    this.editUserRoleModal.close(true);
    this.closed.emit();
  }
}
