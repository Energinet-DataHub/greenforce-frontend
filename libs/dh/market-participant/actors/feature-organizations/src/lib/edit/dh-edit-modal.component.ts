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
import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, effect, inject, input, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  GetOrganizationsDocument,
  UpdateOrganizationDocument,
  UpdateOrganizationMutation,
  GetOrganizationEditDocument,
  GetOrganizationByIdDocument,
  GetAuditLogByOrganizationIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';

import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhOrganizationManageComponent } from '@energinet-datahub/dh/market-participant/actors/shared';

@Component({
  selector: 'dh-organization-edit-modal',
  imports: [
    TranslocoDirective,
    FormsModule,
    ReactiveFormsModule,
    WATT_MODAL,
    WattButtonComponent,
    DhOrganizationManageComponent,
  ],
  template: `
    <watt-modal
      size="small"
      [title]="organization()?.name ?? ''"
      [loading]="loading()"
      (closed)="handleClosed()"
      *transloco="let t; read: 'marketParticipant.organizationsOverview.edit'"
    >
      <form id="editForm" (ngSubmit)="save()">
        <dh-organization-manage [domains]="domains" />
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button variant="secondary" type="submit" formId="editForm">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhOrganizationEditModalComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);

  private updateOrganizationMutation = mutation(UpdateOrganizationDocument);
  private getOrganizationByIdQuery = lazyQuery(GetOrganizationEditDocument);

  domains = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });

  organization = computed(() => this.getOrganizationByIdQuery.data()?.organizationById);

  loading = computed(
    () => this.updateOrganizationMutation.loading() || this.getOrganizationByIdQuery.loading()
  );

  modal = viewChild.required(WattModalComponent);

  // Router param value
  id = input.required<string>();

  constructor() {
    effect(() => {
      const id = this.id();
      this.getOrganizationByIdQuery.query({ variables: { id } });
    });

    effect(() => {
      const org = this.organization();

      if (org) {
        this.domains.patchValue(org.domains);
        this.modal().open();
      }
    });
  }

  close(result: boolean): void {
    this.modal().close(result);
  }

  handleClosed() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  save(): void {
    if (this.domains.invalid) return;

    if (!this.id()) return;

    this.updateOrganizationMutation
      .mutate({
        variables: {
          input: {
            orgId: this.id(),
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
    }
    this.close(true);
  }
}
