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
import { TranslocoDirective } from '@ngneat/transloco';

import { Apollo, MutationResult } from 'apollo-angular';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  ContactCategoryType,
  CreateMarketParticipantDocument,
  CreateMarketParticipantMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhCvrValidator,
  dhDkPhoneNumberValidator,
  dhDomainValidator,
  dhGlnOrEicValidator,
} from '@energinet-datahub/dh/shared/ui-validators';

import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { parseApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import { DhChooseOrganizationStepComponent } from './steps/dh-choose-organization-step.component';
import { DhNewOrganizationStepComponent } from './steps/dh-new-organization-step.component';
import { DhNewActorStepComponent } from './steps/dh-new-actor-step.component';
@Component({
  standalone: true,
  selector: 'dh-actors-create-actor-modal',
  templateUrl: './dh-actors-create-actor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_CARD,
    WATT_MODAL,
    WATT_STEPPER,

    DhChooseOrganizationStepComponent,
    DhNewOrganizationStepComponent,
    DhNewActorStepComponent,
  ],
})
export class DhActorsCreateActorModalComponent {
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private _toastService = inject(WattToastService);
  private _apollo = inject(Apollo);

  showCreateNewOrganization = signal(false);
  choosenOrganizationDomain = signal('');
  isCompleting = signal(false);

  @ViewChild(WattModalComponent)
  modal: WattModalComponent | undefined;

  chooseOrganizationForm = this._fb.group({
    orgId: new FormControl<string | null>(null, Validators.required),
  });

  newOrganizationForm = this._fb.group({
    country: ['', Validators.required],
    cvrNumber: ['', { validators: [Validators.required, dhCvrValidator()] }],
    companyName: ['', Validators.required],
    domain: ['', [Validators.required, dhDomainValidator]],
  });

  newActorForm = this._fb.group({
    glnOrEicNumber: ['', [Validators.required, dhGlnOrEicValidator()]],
    name: [''],
    marketrole: ['', Validators.required],
    gridArea: [{ value: '', disabled: true }, Validators.required],
    contact: this._fb.group({
      departmentOrName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, dhDkPhoneNumberValidator]],
    }),
  });

  getChoosenOrganizationDomain(): string {
    return this.newOrganizationForm.controls.domain.value
      ? this.newOrganizationForm.controls.domain.value
      : this.choosenOrganizationDomain();
  }

  setChoosenOrganizationDomain(domain: string): void {
    this.choosenOrganizationDomain.set(domain);
  }

  toggleShowCreateNewOrganization(): void {
    this.showCreateNewOrganization.set(!this.showCreateNewOrganization());
  }

  open() {
    this.modal?.open();
  }

  close() {
    this.modal?.close(false);
  }

  createMarketParticipent(): void {
    if (this.chooseOrganizationForm.controls.orgId.value && this.newActorForm.invalid) return;

    if (
      (this.chooseOrganizationForm.controls.orgId.value === null &&
        this.newOrganizationForm.invalid) ||
      this.newActorForm.invalid
    )
      return;

    this.isCompleting.set(true);
    this._apollo
      .mutate({
        mutation: CreateMarketParticipantDocument,
        variables: {
          input: {
            organizationId: this.chooseOrganizationForm.controls.orgId.value,
            organization: this.chooseOrganizationForm.controls.orgId.value
              ? null
              : {
                  address: {
                    country: this.newOrganizationForm.controls.country.value,
                  },
                  domain: this.newOrganizationForm.controls.domain.value,
                  businessRegisterIdentifier: this.newOrganizationForm.controls.cvrNumber.value,
                  name: this.newOrganizationForm.controls.companyName.value,
                },
            actorContact: {
              email: this.newActorForm.controls.contact.controls.email.value,
              name: this.newActorForm.controls.contact.controls.departmentOrName.value,
              phone: this.newActorForm.controls.contact.controls.phone.value,
              category: ContactCategoryType.Default,
            },
            actor: {
              name: { value: this.newActorForm.controls.name.value },
              // The hardcoded value is a placeholder for the organizationId what be replaced in the BFF with the created organizationId
              organizationId:
                this.chooseOrganizationForm.controls.orgId.value === null
                  ? '3f2504e0-4f89-41d3-9a0c-0305e82c3301'
                  : this.chooseOrganizationForm.controls.orgId.value,
              marketRoles: [
                {
                  eicFunction: this.newActorForm.controls.marketrole.value,
                  gridAreas: this.newActorForm.controls.gridArea.value
                    ? [{ id: this.newActorForm.controls.gridArea.value, meteringPointTypes: [] }]
                    : [],
                },
              ],
              actorNumber: {
                value: this.newActorForm.controls.glnOrEicNumber.value,
              },
            },
          },
        },
      })
      .subscribe((result) => this.handleCreateMarketParticipentResponse(result));
  }

  private handleCreateMarketParticipentResponse(
    response: MutationResult<CreateMarketParticipantMutation>
  ): void {
    if (response.errors && response.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: parseGraphQLErrorResponse(response.errors),
      });
    }

    if (
      response.data?.createMarketParticipant?.errors &&
      response.data?.createMarketParticipant?.errors.length > 0
    ) {
      this._toastService.open({
        type: 'danger',
        message: parseApiErrorResponse(response.data?.createMarketParticipant?.errors),
      });
    }

    if (response.data?.createMarketParticipant?.success) {
      this._toastService.open({ type: 'success', message: 'Market participant created' });
    }
    this.isCompleting.set(false);
    this.close();
  }
}
