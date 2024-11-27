import { Component, inject, input, viewChild } from '@angular/core';

import { GraphQLErrors } from '@apollo/client/errors';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import {
  DeactivateUserRoleDocument,
  GetFilteredUserRolesDocument,
  GetUserRoleWithPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

@Component({
  standalone: true,
  selector: 'dh-deactivate-user-role',
  imports: [WATT_MODAL, WattButtonComponent, TranslocoDirective],
  template: `<watt-modal
    *transloco="let t; read: 'admin.userManagement.drawer'"
    #confirmationModal
    [size]="'small'"
    [title]="t('deactivateWarningTitle')"
    [disableClose]="true"
    (closed)="confirmationClosed($event)"
  >
    <p>
      {{ t('deactivateWarning') }}
    </p>
    <watt-modal-actions>
      <watt-button variant="secondary" (click)="confirmationModal.close(false)">{{
        t('cancel')
      }}</watt-button>
      <watt-button variant="secondary" (click)="confirmationModal.close(true)">{{
        t('continue')
      }}</watt-button>
    </watt-modal-actions>
  </watt-modal>`,
})
export class DhDeactivedUserRoleComponent {
  private toastService = inject(WattToastService);
  private translocoService = inject(TranslocoService);
  private modal = viewChild.required(WattModalComponent);
  private deactivedUserRoleMutation = mutation(DeactivateUserRoleDocument);

  id = input<string>();

  isDeactivating = this.deactivedUserRoleMutation.loading;

  async confirmationClosed(deactivated: boolean) {
    const id = this.id();
    if (deactivated === false || id === undefined) return;

    this.toastService.open({
      message: this.translocoService.translate('admin.userManagement.drawer.disablingUserRole'),
      type: 'info',
    });

    const result = await this.deactivedUserRoleMutation.mutate({
      refetchQueries: [GetFilteredUserRolesDocument, GetUserRoleWithPermissionsDocument],
      variables: { input: { roleId: id } },
    });

    if (result.data?.deactivateUserRole.success) {
      this.toastService.open({
        message: this.translocoService.translate('admin.userManagement.drawer.userroleDisabled'),
        type: 'success',
      });
    }

    if (result.error?.graphQLErrors || result.data?.deactivateUserRole.errors) {
      this.error(result.error?.graphQLErrors, result.data?.deactivateUserRole.errors);
    }
  }

  open() {
    this.modal().open();
  }

  private error(
    errors: GraphQLErrors | undefined,
    apiErrors: ApiErrorCollection[] | undefined | null
  ) {
    let message = this.translocoService.translate(
      'admin.userManagement.createrole.createRoleRequest.error'
    );

    if (errors) {
      message = parseGraphQLErrorResponse(errors) ?? message;
    }

    if (apiErrors) {
      message = readApiErrorResponse(apiErrors) ?? message;
    }

    this.toastService.open({ message, type: 'danger' });
  }
}
