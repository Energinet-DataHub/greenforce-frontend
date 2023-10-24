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
  Component,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Apollo, MutationResult } from 'apollo-angular';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import {
  GetAuditLogByOrganizationIdDocument,
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
  UpdateOrganizationDocument,
  UpdateOrganizationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhOrganizationDetails } from '../dh-organization';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const validDomainRegExp = /^([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,6}$/;

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
    CommonModule,
    TranslocoDirective,
    FormsModule,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
})
export class DhOrganizationEditModalComponent implements AfterViewInit, OnChanges {
  private readonly apollo = inject(Apollo);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(WattModalComponent)
  innerModal?: WattModalComponent;

  domainControl = new FormControl('', {
    validators: [Validators.required, Validators.pattern(validDomainRegExp)],
    nonNullable: true,
  });
  isLoading = false;

  @Input() organization!: DhOrganizationDetails;

  @Output() closed = new EventEmitter<void>();

  ngAfterViewInit() {
    this.innerModal?.open();
  }

  ngOnChanges() {
    this.domainControl.setValue(this.organization.domain);
  }

  save(): void {
    if (this.domainControl.invalid || this.isLoading) {
      return;
    }

    this.apollo
      .mutate({
        useMutationLoading: true,
        mutation: UpdateOrganizationDocument,
        variables: {
          input: {
            orgId: this.organization.organizationId,
            domain: this.domainControl.value,
          },
        },
        refetchQueries: (result) => {
          if (this.isUpdateSuccessful(result.data)) {
            return [
              GetOrganizationsDocument,
              GetOrganizationByIdDocument,
              GetAuditLogByOrganizationIdDocument,
            ];
          }

          return [];
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryResult) => {
        this.isLoading = queryResult.loading;

        if (queryResult.loading) {
          return;
        }

        this.showNotification(queryResult);

        this.onCloseModal();
      });
  }

  onCloseModal() {
    this.innerModal?.close(false);

    this.closed.emit();
  }

  private showNotification(queryResult: MutationResult<UpdateOrganizationMutation>): void {
    const basePath = 'marketParticipant.organizationsOverview.edit.updateRequest';

    if (this.isUpdateSuccessful(queryResult.data)) {
      const message = this.transloco.translate(`${basePath}.success`);
      this.toastService.open({ message, type: 'success' });
    } else {
      const message = this.transloco.translate(`${basePath}.error`);
      this.toastService.open({ message, type: 'danger' });
    }
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<UpdateOrganizationMutation>['data']
  ): boolean {
    return !mutationResult?.updateOrganization.errors?.length;
  }
}
