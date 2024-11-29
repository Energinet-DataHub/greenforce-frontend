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
  standalone: true,
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
      (closed)="close(false)"
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
