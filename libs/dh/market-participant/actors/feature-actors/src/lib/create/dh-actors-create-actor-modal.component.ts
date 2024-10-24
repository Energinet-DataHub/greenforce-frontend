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
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  EicFunction,
  ContactCategory,
  GetOrganizationsDocument,
  GetOrganizationFromCvrDocument,
  CreateMarketParticipantDocument,
  CreateMarketParticipantMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhCvrValidator,
  dhDomainValidator,
  dhGlnOrEicValidator,
} from '@energinet-datahub/dh/shared/ui-validators';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import { DhOrganizationDetails } from '@energinet-datahub/dh/market-participant/actors/domain';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import { ActorForm } from './dh-actor-form.model';
import { DhNewActorStepComponent } from './steps/dh-new-actor-step.component';
import { DhNewOrganizationStepComponent } from './steps/dh-new-organization-step.component';
import { DhChooseOrganizationStepComponent } from './steps/dh-choose-organization-step.component';
import { dhMarketParticipantNameMaxLengthValidatorFn } from '../dh-market-participant-name-max-length.validator';

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
export class DhActorsCreateActorModalComponent extends WattTypedModal {
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private toastService = inject(WattToastService);

  private getOrganizationFromCvrDocumentQuery = lazyQuery(GetOrganizationFromCvrDocument);
  private createMarketParticipantDocumentMutation = mutation(CreateMarketParticipantDocument);

  lookingForCVR = this.getOrganizationFromCvrDocumentQuery.loading;

  showCreateNewOrganization = signal(false);
  isCompleting = signal(false);

  modal = viewChild.required(WattModalComponent);

  chooseOrganizationForm = this.fb.group({
    orgId: new FormControl<string | null>(null, Validators.required),
  });

  newOrganizationForm = this.fb.group({
    country: ['', Validators.required],
    cvrNumber: ['', { validators: [Validators.required] }],
    companyName: [{ value: '', disabled: true }, Validators.required],
    domain: ['', [Validators.required, dhDomainValidator]],
    domains: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, dhDomainValidator],
    }),
  });

  newActorForm: ActorForm = this.fb.group({
    glnOrEicNumber: ['', [Validators.required, dhGlnOrEicValidator()]],
    name: ['', [Validators.required, dhMarketParticipantNameMaxLengthValidatorFn]],
    marketrole: new FormControl<EicFunction | null>(null, Validators.required),
    gridArea: [{ value: [] as string[], disabled: true }, Validators.required],
    contact: this.fb.group({
      departmentOrName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    }),
  });

  countryChanged = toSignal(this.newOrganizationForm.controls.country.valueChanges, {
    initialValue: '',
  });
  cvrNumberChanged = toSignal(this.newOrganizationForm.controls.cvrNumber.valueChanges, {
    initialValue: '',
  });

  constructor() {
    super();

    effect(async () => {
      const country = this.countryChanged();
      const cvrNumber = this.cvrNumberChanged();

      this.newOrganizationForm.controls.companyName.disable();

      if (country === 'DK') {
        if (this.isInternalCvr(cvrNumber)) {
          this.newOrganizationForm.controls.companyName.enable();
          return;
        }

        if (cvrNumber.length === 8) {
          const result = await this.getOrganizationFromCvrDocumentQuery.query({
            variables: { cvr: cvrNumber },
          });

          const { hasResult, name } = result.data.searchOrganizationInCVR;

          if (hasResult) {
            this.newOrganizationForm.controls.companyName.setValue(name);
          }
        }
      }
    });

    this.newOrganizationForm.controls.country.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const internalCvrValidator: ValidatorFn = (control) =>
          this.isInternalCvr(control.value as string) ? null : { invalidCvrNumber: true };

        if (value === 'DK') {
          this.newOrganizationForm.controls.cvrNumber.setValidators([
            Validators.required,
            Validators.maxLength(64),
            (control) =>
              dhCvrValidator()(control) && internalCvrValidator(control)
                ? { invalidCvrNumber: true }
                : null,
          ]);
        } else {
          this.newOrganizationForm.controls.cvrNumber.setValidators(Validators.required);
        }

        this.newOrganizationForm.controls.cvrNumber.updateValueAndValidity();
      });

    this.newOrganizationForm.controls.country.setValue('DK');

    this.newOrganizationNameToActorName();
  }

  isInternalCvr(cvrNumber: string): boolean {
    return cvrNumber.startsWith('ENDK');
  }

  onSelectOrganization(organization: DhOrganizationDetails): void {
    this.newActorForm.controls.name.setValue(organization.name);
  }

  toggleShowCreateNewOrganization(): void {
    this.showCreateNewOrganization.set(!this.showCreateNewOrganization());
  }

  open(): void {
    this.modal().open();
  }

  close(isSuccess = false): void {
    this.modal().close(isSuccess);
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
    this.createMarketParticipantDocumentMutation
      .mutate({
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
              category: ContactCategory.Default,
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
                  eicFunction: this.newActorForm.controls.marketrole.value as EicFunction,
                  gridAreas: this.newActorForm.controls.gridArea.value.map((gridArea) => ({
                    code: gridArea,
                    meteringPointTypes: [],
                  })),
                },
              ],
              actorNumber: {
                value: this.newActorForm.controls.glnOrEicNumber.value,
              },
            },
          },
        },
        refetchQueries: [GetOrganizationsDocument],
      })
      .then((result) => this.handleCreateMarketParticipentResponse(result));
  }

  private handleCreateMarketParticipentResponse(
    response: MutationResult<CreateMarketParticipantMutation>
  ): void {
    if (response.errors && response.errors.length > 0) {
      this.toastService.open({
        type: 'danger',
        message: parseGraphQLErrorResponse(response.errors),
      });
    }

    if (
      response.data?.createMarketParticipant?.errors &&
      response.data?.createMarketParticipant?.errors.length > 0
    ) {
      this.toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.createMarketParticipant?.errors),
      });
    }

    if (response.data?.createMarketParticipant?.success) {
      this.toastService.open({
        type: 'success',
        message: translate('marketParticipant.actor.create.createSuccess'),
      });

      this.close(true);
    }

    this.isCompleting.set(false);
  }

  private newOrganizationNameToActorName(): void {
    this.newOrganizationForm.controls.companyName.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.newActorForm.controls.name.setValue(value);
      });
  }
}
