//#region License
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
//#endregion
import { Component, inject, input, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';

import {
  GetUsersDocument,
  DeactivateUserDocument,
  GetUserAuditLogsDocument,
  GetUserEditDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhUserDetails } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-deactivate-user',
  imports: [WATT_MODAL, WattButtonComponent, TranslocoDirective],
  template: ` <watt-modal
    #modal
    *transloco="let t; read: 'admin.userManagement.drawer'"
    [size]="'small'"
    [title]="t('deactivateConfirmation.title')"
    [disableClose]="true"
    (closed)="deactivate($event)"
  >
    <p>
      {{
        t('deactivateConfirmation.body', {
          name: user()?.name,
          email: user()?.email,
        })
      }}
    </p>
    <p>
      <b>
        {{ t('deactivateConfirmation.important') }}
      </b>
    </p>

    <watt-modal-actions>
      <watt-button variant="secondary" (click)="modal.close(false)">{{
        t('deactivateConfirmation.reject')
      }}</watt-button>

      <watt-button variant="secondary" (click)="modal.close(true)">{{
        t('deactivateConfirmation.confirm')
      }}</watt-button>
    </watt-modal-actions>
  </watt-modal>`,
})
export class DhDeactivteComponent {
  private deactivateUserMutation = mutation(DeactivateUserDocument);
  private toastService = inject(WattToastService);
  private transloco = inject(TranslocoService);

  modal = viewChild.required(WattModalComponent);

  user = input<DhUserDetails>();

  loading = this.deactivateUserMutation.loading;

  deactivate = (success: boolean) => {
    const user = this.user();
    if (success && user) {
      this.deactivateUserMutation.mutate({
        refetchQueries: [GetUsersDocument, GetUserEditDocument, GetUserAuditLogsDocument],
        variables: { input: { userId: user.id } },
        onCompleted: (data) =>
          data.deactivateUser.errors
            ? this.showToast('danger', 'deactivateError')
            : this.showToast('success', 'deactivateSuccess'),
        onError: () => this.showToast('danger', 'deactivateError'),
      });
    }
  };

  open(): void {
    this.modal().open();
  }

  private showToast(type: WattToastType, label: string): void {
    this.toastService.open({
      type,
      message: this.transloco.translate(`admin.userManagement.drawer.${label}`),
    });
  }
}
