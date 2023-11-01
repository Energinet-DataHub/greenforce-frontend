import { Apollo } from 'apollo-angular';
import { TranslocoDirective } from '@ngneat/transloco';

import { NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { dhCvrValidator, dhDomainValidator } from '@energinet-datahub/dh/shared/validators';

@Component({
  standalone: true,
  selector: 'dh-actors-create-actor-modal',
  templateUrl: './dh-actors-create-actor-modal.component.html',
  styles: [
    `
      :host {
        display: block;
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

      .dh-actors-create-actor-modal__form {
        watt-dropdown {
          width: 50%;
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

  private _getOrganizationsQuery$ = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetOrganizationsDocument,
  });

  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  organizationOptions: WattDropdownOptions = [];
  countryOptions: WattDropdownOptions = [
    { value: 'DK', displayValue: 'DK' },
    { value: 'SE', displayValue: 'SE' },
    { value: 'NO', displayValue: 'NO' },
    { value: 'FI', displayValue: 'FI' },
  ];

  chooseOrganizationForm = this._fb.group({ orgId: [''] });
  newOrganizationForm = this._fb.group({
    country: ['', Validators.required],
    cvrNumber: ['', [Validators.required, dhCvrValidator()]],
    companyName: ['', Validators.required],
    domain: ['', [Validators.required, dhDomainValidator]],
  });

  showCreateNewOrganization = false;

  constructor() {
    this._getOrganizationsQuery$.valueChanges.pipe(takeUntilDestroyed()).subscribe((result) => {
      if (result.data?.organizations) {
        this.organizationOptions = result.data.organizations.map((org) => ({
          value: org.organizationId ?? '',
          displayValue: org.name,
        }));
      }
    });
  }

  toggleShowCreateNewOrganization(): void {
    this.showCreateNewOrganization = !this.showCreateNewOrganization;
  }

  open() {
    this.innerModal?.open();
  }

  close() {
    this.innerModal?.close(false);
  }
}
