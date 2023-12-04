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
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import {
  PermissionDto,
  MarketParticipantUpdatePermissionDto,
} from '@energinet-datahub/dh/shared/domain';
import { DhAdminEditPermissionStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';

@Component({
  selector: 'dh-edit-permission-modal',
  templateUrl: './dh-edit-permission-modal.component.html',
  standalone: true,
  styles: [
    `
      .tab-master-data {
        width: 25rem;
      }
    `,
  ],
  providers: [DhAdminEditPermissionStore],
  imports: [
    NgIf,
    TranslocoModule,
    ReactiveFormsModule,
    RxPush,
    WATT_MODAL,
    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,
  ],
})
export class DhEditPermissionModalComponent implements AfterViewInit, OnChanges {
  private readonly store = inject(DhAdminEditPermissionStore);

  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  readonly userPermissionsForm = this.formBuilder.group({
    description: this.formBuilder.nonNullable.control('', [Validators.required]),
  });
  readonly isSaving$ = this.store.isSaving$;

  @ViewChild(WattModalComponent)
  private editPermissionModal!: WattModalComponent;

  @Input() permission!: PermissionDto;

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  ngAfterViewInit(): void {
    this.editPermissionModal.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permission']) {
      this.userPermissionsForm.controls.description.setValue(
        changes['permission'].currentValue.description
      );
    }
  }

  closeModal(saveSuccess: boolean): void {
    this.editPermissionModal.close(saveSuccess);
    this.closed.emit({ saveSuccess });
  }

  save(): void {
    if (this.userPermissionsForm.invalid) {
      return;
    }

    if (this.userPermissionsForm.pristine) {
      return this.closeModal(false);
    }

    const onSuccessFn = () => {
      const message = this.transloco.translate('admin.userManagement.editPermission.saveSuccess');

      this.toastService.open({ type: 'success', message });
      this.closeModal(true);
    };

    const onErrorFn = () => {
      const message = this.transloco.translate('admin.userManagement.editPermission.saveError');

      this.toastService.open({ type: 'danger', message });
    };

    const updatedPermission: MarketParticipantUpdatePermissionDto = {
      id: this.permission.id,
      description: this.userPermissionsForm.controls.description.value,
    };

    this.store.updatePermission({ updatedPermission, onSuccessFn, onErrorFn });
  }
}
