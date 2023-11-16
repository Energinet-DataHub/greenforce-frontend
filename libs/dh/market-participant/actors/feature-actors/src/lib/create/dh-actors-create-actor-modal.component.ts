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
import { Apollo } from 'apollo-angular';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { NgIf, NgTemplateOutlet } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ViewChild, inject, signal } from '@angular/core';

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
  EicFunction,
  GetGridAreasDocument,
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
  GetUserRolesByEicfunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhCvrValidator,
  dhDkPhoneNumberValidator,
  dhDomainValidator,
  dhEicOrGlnValidator,
  dhFirstPartEmailValidator,
} from '@energinet-datahub/dh/shared/ui-validators';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

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
  ],
})
export class DhActorsCreateActorModalComponent {
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private _apollo = inject(Apollo);

  private _getOrganizationsQuery$ = this._apollo.query({
    notifyOnNetworkStatusChange: true,
    query: GetOrganizationsDocument,
  });

  private _getGridAreasQuery = this._apollo.query({
    notifyOnNetworkStatusChange: true,
    query: GetGridAreasDocument,
  });

  showCreateNewOrganization = signal(false);
  choosenOrganizationDomain = signal('');
  showGridAreaOptions = signal(false);

  readonly dataSource: WattTableDataSource<UserRole> = new WattTableDataSource<UserRole>();

  columns: WattTableColumnDef<UserRole> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  organizationOptions: WattDropdownOptions = [];
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
    glnOrEicNumber: ['', [Validators.required, dhEicOrGlnValidator]],
    name: [''],
    marketrole: ['', Validators.required],
    gridArea: [{ value: '', disabled: !this.showGridAreaOptions() }, Validators.required],
    contact: this._fb.group({
      departmentOrName: ['', Validators.required],
      email: ['', [Validators.required, dhFirstPartEmailValidator]],
      phone: ['', [Validators.required, dhDkPhoneNumberValidator]],
    }),
  });

  newUserForm = this._fb.group({
    email: ['', [Validators.required, dhFirstPartEmailValidator]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', [Validators.required, dhDkPhoneNumberValidator]],
  });

  constructor() {
    this._getOrganizationsQuery$.subscribe((result) => {
      if (result.data?.organizations) {
        this.organizationOptions = result.data.organizations.map((org) => ({
          value: org.organizationId ?? '',
          displayValue: org.name,
        }));
      }
    });

    this._getGridAreasQuery.subscribe((result) => {
      if (result.data?.gridAreas) {
        this.gridAreaOptions = result.data.gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: gridArea.name,
        }));
      }
    });
  }

  onOrganizationChange(id: string): void {
    this._apollo
      .query({
        variables: { id },
        notifyOnNetworkStatusChange: true,
        query: GetOrganizationByIdDocument,
      })
      .subscribe((result) => {
        if (result.data?.organizationById.domain) {
          this.choosenOrganizationDomain.set(result.data.organizationById.domain);
        }
      });
  }

  getChoosenOrganizationDomain(): string {
    return this.newOrganizationForm.controls.domain.value
      ? this.newOrganizationForm.controls.domain.value
      : this.choosenOrganizationDomain();
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
  }

  toggleShowCreateNewOrganization(): void {
    this.showCreateNewOrganization.set(!this.showCreateNewOrganization());
    this.newOrganizationForm.reset();
  }

  selectedUserRoles(userRoles: UserRole[]): void {
    console.log(userRoles);
  }

  open() {
    this.innerModal?.open();
  }

  close() {
    this.innerModal?.close(false);
  }
}
