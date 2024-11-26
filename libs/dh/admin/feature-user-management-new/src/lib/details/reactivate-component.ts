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
import { Component, inject, input, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';

import {
  GetUsersDocument,
  GetUserByIdDocument,
  ReActivateUserDocument,
  GetUserAuditLogsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhUserDetails } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  standalone: true,
  selector: 'dh-reactivate',
  imports: [WATT_MODAL, WattButtonComponent, TranslocoDirective],
  template: ` <watt-modal
    #modal
    *transloco="let t; read: 'admin.userManagement.drawer'"
    [size]="'small'"
    [title]="t('reactivateConfirmation.title')"
    [disableClose]="true"
    (closed)="reActivate($event)"
  >
    <p>
      {{
        t('reactivateConfirmation.body', {
          name: user()?.name,
        })
      }}
    </p>
    <p>
      <b>
        {{ t('reactivateConfirmation.important') }}
      </b>
    </p>

    <watt-modal-actions>
      <watt-button variant="secondary" (click)="modal.close(false)">{{
        t('reactivateConfirmation.reject')
      }}</watt-button>

      <watt-button variant="secondary" (click)="modal.close(true)">{{
        t('reactivateConfirmation.confirm')
      }}</watt-button>
    </watt-modal-actions>
  </watt-modal>`,
})
export class DhReactivateComponent {
  private reactivateUserMutation = mutation(ReActivateUserDocument);
  private toastService = inject(WattToastService);
  private transloco = inject(TranslocoService);

  modal = viewChild.required(WattModalComponent);

  user = input<DhUserDetails>();

  loading = this.reactivateUserMutation.loading;

  reActivate = (success: boolean) => {
    const user = this.user();
    if (success && user) {
      this.reactivateUserMutation.mutate({
        refetchQueries: [GetUsersDocument, GetUserByIdDocument, GetUserAuditLogsDocument],
        variables: { input: { userId: user.id } },
        onError: () => this.showToast('danger', 'reactivateError'),
        onCompleted: (data) =>
          data.reActivateUser.errors
            ? this.showToast('danger', 'reactivateError')
            : this.showToast('success', 'reactivateSuccess'),
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
