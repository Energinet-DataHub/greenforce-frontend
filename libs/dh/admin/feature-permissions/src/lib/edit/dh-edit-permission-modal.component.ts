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
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { UpdatePermissionDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';

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
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattTabComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,
  ],
})
export class DhEditPermissionModalComponent implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  readonly userPermissionsForm = this.formBuilder.group({
    description: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(1000),
    ]),
  });

  updatePermission = mutation(UpdatePermissionDocument);

  isSaving = computed(() => this.updatePermission.loading());

  private editPermissionModal = viewChild.required(WattModalComponent);

  permission = input.required<PermissionDto>();

  closed = output<{ saveSuccess: boolean }>();

  constructor() {
    effect(() => {
      if (this.updatePermission.error()) {
        const message = this.transloco.translate('admin.userManagement.editPermission.saveError');

        this.toastService.open({ type: 'danger', message });
      }

      if (this.updatePermission.data() && this.updatePermission.loading() === false) {
        const message = this.transloco.translate('admin.userManagement.editPermission.saveSuccess');

        this.toastService.open({ type: 'success', message });
        this.closeModal(true);
      }

      this.userPermissionsForm.controls.description.setValue(this.permission().description);
    });
  }

  ngAfterViewInit(): void {
    this.editPermissionModal().open();
  }

  closeModal(saveSuccess: boolean): void {
    this.editPermissionModal().close(saveSuccess);
    this.closed.emit({ saveSuccess });
  }

  save(): void {
    if (this.userPermissionsForm.invalid) {
      return;
    }

    if (this.userPermissionsForm.pristine) {
      return this.closeModal(false);
    }

    this.updatePermission.mutate({
      variables: {
        input: {
          id: this.permission().id,
          description: this.userPermissionsForm.controls.description.value,
        },
      },
    });
  }
}
