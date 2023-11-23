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
import { Apollo, MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { NgIf, NgTemplateOutlet } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  ContactCategoryType,
  CreateMarketParticipantDocument,
  CreateMarketParticipantMutation,
  EicFunction,
  GetGridAreasForCreateActorDocument,
  GetUserRolesByEicfunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhCvrValidator,
  dhDkPhoneNumberValidator,
  dhDomainValidator,
  dhGlnOrEicValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { DhChooseOrganizationStepComponent } from './steps/dh-choose-organization-step.component';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { parseApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

type UserRoles = ResultOf<typeof GetUserRolesByEicfunctionDocument>['userRolesByEicFunction'];
type UserRole = UserRoles[number];

@Component({
  standalone: true,
  selector: 'dh-actors-create-actor-modal',
  templateUrl: './dh-actors-create-actor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .dh-actors-create-actor-modal__form {
        watt-dropdown {
          width: 50%;
        }

        .domain {
          padding-right: var(--watt-space-s);
        }

        .dh-actors-create-actor {
          watt-dropdown {
            width: 100%;
          }
        }

        .dh-actors-create-actor-organization,
        .dh-actors-create-actor-invite-user {
          vater-stack {
            width: 50%;
          }

          watt-table {
            max-height: 400px;
          }

          vater-stack[direction='row'] {
            watt-dropdown,
            watt-text-field {
              width: 50%;
            }
          }
        }
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,
    NgIf,

    WATT_CARD,
    NgTemplateOutlet,
    WATT_MODAL,
    WATT_STEPPER,
    WattDropdownComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    VaterFlexComponent,
    WATT_TABLE,
    WATT_CARD,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    DhDropdownTranslatorDirective,
    VaterStackComponent,

    DhChooseOrganizationStepComponent,
  ],
})
export class DhActorsCreateActorModalComponent {
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private _toastService = inject(WattToastService);
  private _apollo = inject(Apollo);

  private _getGridAreasQuery = this._apollo.query({
    notifyOnNetworkStatusChange: true,
    query: GetGridAreasForCreateActorDocument,
  });

  showCreateNewOrganization = signal(false);
  choosenOrganizationDomain = signal('');
  showGridAreaOptions = signal(false);
  isCompleting = signal(false);

  readonly dataSource: WattTableDataSource<UserRole> = new WattTableDataSource<UserRole>();

  columns: WattTableColumnDef<UserRole> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  gridAreaOptions: WattDropdownOptions = [];
  marketRoleOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(EicFunction);
  countryOptions: WattDropdownOptions = [
    { value: 'DK', displayValue: 'DK' },
    { value: 'SE', displayValue: 'SE' },
    { value: 'NO', displayValue: 'NO' },
    { value: 'FI', displayValue: 'FI' },
  ];

  chooseOrganizationForm = this._fb.group({ orgId: ['', Validators.required] });

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

  constructor() {
    this._getGridAreasQuery.subscribe((result) => {
      console.log(result);
      if (result.data?.gridAreas) {
        this.gridAreaOptions = result.data.gridAreas.map((gridArea) => ({
          value: gridArea.id,
          displayValue: gridArea.name,
        }));
      }
    });
  }

  getChoosenOrganizationDomain(): string {
    return this.newOrganizationForm.controls.domain.value
      ? this.newOrganizationForm.controls.domain.value
      : this.choosenOrganizationDomain();
  }

  setChoosenOrganizationDomain(domain: string): void {
    this.choosenOrganizationDomain.set(domain);
  }

  onMarketRoleChange(eicfunction: EicFunction): void {
    this._apollo
      .query({
        notifyOnNetworkStatusChange: true,
        query: GetUserRolesByEicfunctionDocument,
        variables: { eicfunction },
      })
      .subscribe((result) => {
        this.dataSource.data = result.data?.userRolesByEicFunction ?? [];
      });

    this.showGridAreaOptions.set(eicfunction === EicFunction.GridAccessProvider);
    if (eicfunction === EicFunction.GridAccessProvider) {
      this.newActorForm.controls.gridArea.enable();
    }
  }

  toggleShowCreateNewOrganization(): void {
    this.showCreateNewOrganization.set(!this.showCreateNewOrganization());
    this.newOrganizationForm.reset();
  }

  open() {
    this.innerModal?.open();
  }

  close() {
    this.innerModal?.close(false);
  }

  createMarketParticipent(): void {
    if (this.chooseOrganizationForm.controls.orgId.value !== '' && this.newActorForm.invalid)
      return;

    if (
      (this.chooseOrganizationForm.controls.orgId.value === '' &&
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
              organizationId: this.chooseOrganizationForm.controls.orgId.value,
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
