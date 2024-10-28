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
import { Component, inject, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';

import {
  GetAuditLogByOrganizationIdDocument,
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
  UpdateOrganizationDocument,
  UpdateOrganizationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

import { DhOrganizationDetails } from '@energinet-datahub/dh/market-participant/actors/domain';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhOrganizationManageComponent } from '@energinet-datahub/dh/market-participant/actors/shared';

@Component({
  standalone: true,
  selector: 'dh-organization-edit-modal',
  templateUrl: './dh-edit-modal.component.html',
  styles: [
    `
      .domain-field {
        width: 25em;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    FormsModule,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,

    DhOrganizationManageComponent,
  ],
})
export class DhOrganizationEditModalComponent extends WattTypedModal<DhOrganizationDetails> {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private updateOrganizationMutation = mutation(UpdateOrganizationDocument);

  domains = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });

  loading = this.updateOrganizationMutation.loading;

  modal = viewChild.required(WattModalComponent);

  close(): void {
    this.modal().close(false);
  }

  constructor() {
    super();
    this.domains.patchValue(this.modalData.domains);
  }

  save(): void {
    if (this.domains.invalid) return;

    const { id } = this.modalData;

    if (!id) return;

    this.updateOrganizationMutation
      .mutate({
        variables: {
          input: {
            orgId: id,
            domains: this.domains.value,
          },
        },
        refetchQueries: [
          GetOrganizationsDocument,
          GetOrganizationByIdDocument,
          GetAuditLogByOrganizationIdDocument,
        ],
      })
      .then((response) => this.handleEditOrganizationResponse(response));
  }

  private handleEditOrganizationResponse(response: MutationResult<UpdateOrganizationMutation>) {
    if (
      response.data?.updateOrganization?.errors &&
      response.data?.updateOrganization?.errors.length > 0
    ) {
      this.toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.updateOrganization?.errors),
      });
    }

    if (response.data?.updateOrganization?.boolean) {
      const message = this.transloco.translate(
        `marketParticipant.organizationsOverview.edit.updateRequest.success`
      );

      this.toastService.open({ message, type: 'success' });
      this.modal().close(true);
    }
  }
}
