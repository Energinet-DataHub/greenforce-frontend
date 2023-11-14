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
import { TranslocoDirective } from '@ngneat/transloco';

import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, ViewChild, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  EicFunction,
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhCvrValidator,
  dhDkPhoneNumberValidator,
  dhDomainValidator,
  dhEicOrGlnValidator,
  dhFirstPartEmailValidator,
} from '@energinet-datahub/dh/shared/ui-validators';

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

        .dh-actors-create-actor {
          watt-dropdown {
            width: 100%;
          }

          .domain {
            padding-right: var(--watt-space-s);
          }
        }

        .dh-actors-create-actor-organization {
          vater-stack {
            width: 50%;
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
    ReactiveFormsModule,
    NgIf,

    WATT_MODAL,
    WATT_STEPPER,
    WattDropdownComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    DhDropdownTranslatorDirective,
    VaterStackComponent,
  ],
})
export class DhActorsCreateActorModalComponent {
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private _apollo = inject(Apollo);

  private _getOrganizationsQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetOrganizationsDocument,
  });

  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  organizationOptions: WattDropdownOptions = [];
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
    cvrNumber: ['', [Validators.required, dhCvrValidator()]],
    companyName: ['', Validators.required],
    domain: ['', [Validators.required, dhDomainValidator]],
  });

  newActorForm = this._fb.group({
    glnOrEicNumber: ['', [Validators.required, dhEicOrGlnValidator]],
    name: [''],
    marketrole: ['', Validators.required],
    contact: this._fb.group({
      departmentOrName: ['', Validators.required],
      email: ['', [Validators.required, dhFirstPartEmailValidator]],
      phone: ['', [Validators.required, dhDkPhoneNumberValidator]],
    }),
  });

  showCreateNewOrganization = signal(false);
  choosenOrganizationDomain = signal('');

  constructor() {
    this._getOrganizationsQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe((result) => {
      if (result.data?.organizations) {
        this.organizationOptions = result.data.organizations.map((org) => ({
          value: org.organizationId ?? '',
          displayValue: org.name,
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
}
