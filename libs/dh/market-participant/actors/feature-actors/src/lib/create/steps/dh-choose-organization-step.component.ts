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
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattStepperStepComponent } from '@energinet-datahub/watt/stepper';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

@Component({
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattStepperStepComponent,
    WattDropdownComponent,
    WattButtonComponent,
    VaterStackComponent,
  ],
  selector: 'dh-choose-organization-step',
  styles: [
    `
      :host {
        display: block;
        watt-dropdown {
          width: 50%;
        }
      }
    `,
  ],
  template: ` <vater-stack
    align="flex-start"
    fill="horizontal"
    *transloco="let t; read: 'marketParticipant.actor.create'"
  >
    <watt-dropdown
      [showResetOption]="false"
      [options]="organizationOptions"
      [label]="t('organization')"
      (ngModelChange)="onOrganizationChange($event)"
      [formControl]="chooseOrganizationForm.controls.orgId"
    />
    <watt-button variant="text" icon="plus" (click)="toggleShowCreateNewOrganization.emit()">{{
      t('newOrganization')
    }}</watt-button>
  </vater-stack>`,
})
export class DhChooseOrganizationStepComponent {
  private _apollo = inject(Apollo);

  @Input({ required: true }) chooseOrganizationForm!: FormGroup<{ orgId: FormControl<string> }>;
  @Output() toggleShowCreateNewOrganization = new EventEmitter<void>();
  @Output() choosenOrganizationDomain = new EventEmitter<string>();

  private _getOrganizationsQuery$ = this._apollo.query({
    notifyOnNetworkStatusChange: true,
    query: GetOrganizationsDocument,
  });

  organizationOptions: WattDropdownOptions = [];

  constructor() {
    this._getOrganizationsQuery$.subscribe((result) => {
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
          this.choosenOrganizationDomain.emit(result.data.organizationById.domain);
        }
      });
  }
}
