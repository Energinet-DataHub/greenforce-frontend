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
import {
  effect,
  inject,
  signal,
  computed,
  Component,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  Validators,
  ValidatorFn,
  FormControl,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, translate } from '@jsverse/transloco';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  EicFunction,
  ContactCategory,
  GetOrganizationsDocument,
  GetMarketParticipantsDocument,
  GetOrganizationFromCvrDocument,
  CreateMarketParticipantDocument,
  CreateMarketParticipantMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { dhCvrValidator, dhGlnOrEicValidator } from '@energinet-datahub/dh/shared/ui-validators';

import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/domain';

import {
  DhOrganizationDetails,
  DhMarketParticipantForm,
} from '@energinet-datahub/dh/market-participant/domain';

import { DhNewActorStepComponent } from './steps/dh-new-actor-step.component';
import { DhNewOrganizationStepComponent } from './steps/dh-new-organization-step.component';
import { DhChooseOrganizationStepComponent } from './steps/dh-choose-organization-step.component';
import { dhCompanyNameMaxLengthValidatorFn } from '../../validators/dh-company-name-max-length.validator';
import { dhMarketParticipantNameMaxLengthValidatorFn } from '../../validators/dh-market-participant-name-max-length.validator';

@Component({
  selector: 'dh-create-market-participant',
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_CARD,
    WATT_MODAL,
    WATT_STEPPER,
    DhNewActorStepComponent,
    DhNewOrganizationStepComponent,
    DhChooseOrganizationStepComponent,
  ],
})
export class DhCreateMarketParticipant {
  private navigation = inject(DhNavigationService);
  private formBuilder = inject(NonNullableFormBuilder);
  private toastService = inject(WattToastService);

  private getOrganizationFromCvrDocumentQuery = lazyQuery(GetOrganizationFromCvrDocument);
  private createMarketParticipantDocumentMutation = mutation(CreateMarketParticipantDocument);

  lookingForCVR = this.getOrganizationFromCvrDocumentQuery.loading;

  showCreateNewOrganization = signal(false);
  isCompleting = computed(() => this.createMarketParticipantDocumentMutation.loading());

  modal = viewChild.required(WattModalComponent);

  chooseOrganizationForm = this.formBuilder.group({
    orgId: new FormControl<string | null>(null, Validators.required),
  });

  newOrganizationForm = this.formBuilder.group({
    country: ['', Validators.required],
    cvrNumber: ['', { validators: [Validators.required] }],
    companyName: [
      { value: '', disabled: true },
      [Validators.required, dhCompanyNameMaxLengthValidatorFn],
    ],
    domains: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  newActorForm: DhMarketParticipantForm = this.formBuilder.group({
    glnOrEicNumber: ['', [Validators.required, dhGlnOrEicValidator()]],
    name: ['', [Validators.required, dhMarketParticipantNameMaxLengthValidatorFn]],
    marketrole: new FormControl<EicFunction | null>(null, Validators.required),
    gridArea: [{ value: [] as string[], disabled: true }, Validators.required],
    contact: this.formBuilder.group({
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
    effect(async () => {
      const country = this.countryChanged();
      const cvrNumber = this.cvrNumberChanged();

      if (country !== 'DK' || this.isInternalCvr(cvrNumber)) {
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
          this.newActorForm.controls.name.setValue(name);
        }

        this.newOrganizationForm.controls.cvrNumber.markAsTouched();
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

  close(isSuccess = false): void {
    this.modal().close(isSuccess);
  }

  closed() {
    this.navigation.navigate('list');
  }

  createMarketParticipent(): void {
    if (this.chooseOrganizationForm.controls.orgId.value && this.newActorForm.invalid) return;

    if (
      (this.chooseOrganizationForm.controls.orgId.value === null &&
        this.newOrganizationForm.invalid) ||
      this.newActorForm.invalid
    )
      return;

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
                  domains: this.newOrganizationForm.controls.domains.value,
                  businessRegisterIdentifier: this.newOrganizationForm.controls.cvrNumber.value,
                  name: this.newOrganizationForm.controls.companyName.value,
                },
            actorContact: {
              email: this.newActorForm.controls.contact.controls.email.value,
              name: this.newActorForm.controls.contact.controls.departmentOrName.value,
              phone: this.newActorForm.controls.contact.controls.phone.value,
              category: ContactCategory.Default,
            },
            marketParticipant: {
              name: { value: this.newActorForm.controls.name.value },
              // The hardcoded value is a placeholder for the organizationId what be replaced in the BFF with the created organizationId
              organizationId:
                this.chooseOrganizationForm.controls.orgId.value === null
                  ? '3f2504e0-4f89-41d3-9a0c-0305e82c3301'
                  : this.chooseOrganizationForm.controls.orgId.value,
              marketRole: {
                eicFunction: this.newActorForm.controls.marketrole.value as EicFunction,
                gridAreas: this.newActorForm.controls.gridArea.value.map((gridArea) => ({
                  id: gridArea,
                  meteringPointTypes: [],
                })),
              },
              actorNumber: {
                value: this.newActorForm.controls.glnOrEicNumber.value,
              },
            },
          },
        },
        refetchQueries: [GetMarketParticipantsDocument, GetOrganizationsDocument],
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
  }
}
