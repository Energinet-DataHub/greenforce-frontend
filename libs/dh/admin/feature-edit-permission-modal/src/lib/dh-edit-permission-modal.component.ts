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
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattModalComponent, WattModalModule } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-edit-permission-modal',
  templateUrl: './dh-edit-permission-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    WattModalModule,
    WattButtonModule,
    WattTabComponent,
    WattTabsComponent,
  ],
})
export class DhEditPermissionModalComponent implements AfterViewInit {
  @ViewChild(WattModalComponent)
  private editPermissionModal!: WattModalComponent;

  @Input() permission!: PermissionDto;

  @Output() closed = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.editPermissionModal.open();
  }

  closeModal(saveSuccess: boolean): void {
    this.editPermissionModal.close(saveSuccess);
    this.closed.emit();
  }
}
