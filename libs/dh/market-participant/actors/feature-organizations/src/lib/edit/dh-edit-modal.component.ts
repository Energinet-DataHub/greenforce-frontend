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
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';

import {
  GetAuditLogByOrganizationIdDocument,
  GetOrganizationByIdDocument,
  GetOrganizationEditDocument,
  GetOrganizationsDocument,
  UpdateOrganizationDocument,
  UpdateOrganizationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';

import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhOrganizationManageComponent } from '@energinet-datahub/dh/market-participant/actors/shared';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map } from 'rxjs';

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
export class DhOrganizationEditModalComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private updateOrganizationMutation = mutation(UpdateOrganizationDocument);
  private getOrganizationByIdQuery = query(GetOrganizationEditDocument);

  domains = new FormControl<string[]>([], {
    nonNullable: true,
    validators: [Validators.required],
  });

  organization = computed(() => this.getOrganizationByIdQuery.data()?.organizationById);

  loading = this.updateOrganizationMutation.loading;

  modal = viewChild.required(WattModalComponent);

  id = toSignal(
    this.route.parent ? this.route.parent.params.pipe(map((params) => params.id)) : EMPTY
  );

  constructor() {
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
