import { Component, inject, input, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';

import {
  DeactivateUserDocument,
  GetUsersDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhUser } from '@energinet-datahub/dh/admin/shared';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  standalone: true,
  selector: 'dh-deactivate',
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
          first: user()?.firstName,
          last: user()?.lastName,
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

  user = input<DhUser>();

  loading = this.deactivateUserMutation.loading;

  deactivate = (success: boolean) => {
    const user = this.user();
    if (success && user) {
      this.deactivateUserMutation.mutate({
        refetchQueries: [GetUsersDocument],
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
