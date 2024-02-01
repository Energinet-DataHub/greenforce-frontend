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
import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

@Component({
  standalone: true,
  imports: [
    VaterStackComponent,
    WattButtonComponent,
    TranslocoDirective,
    WattDropdownComponent,
    ReactiveFormsModule,
    WattFieldErrorComponent,
    WattTextFieldComponent,
    NgIf,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-new-organization-step',
  styles: [
    `
      :host {
        display: block;
      }

      h4 {
        margin-top: 0;
        margin-bottom: 0;
      }

      watt-dropdown,
      vater-stack {
        width: 50%;
      }
    `,
  ],
  template: ` <ng-container *transloco="let t; read: 'marketParticipant.actor.create'">
    <vater-stack direction="row" justify="space-between" class="watt-space-stack-m">
      <h4>{{ t('newOrganization') }}</h4>
      <watt-button variant="text" (click)="toggleShowCreateNewOrganization.emit()">{{
        t('chooseOrganization')
      }}</watt-button>
    </vater-stack>

    <vater-stack gap="m" align="flex-start" direction="row">
      <watt-dropdown
        translate="marketParticipant.actor.create.counties"
        dhDropdownTranslator
        [label]="t('country')"
        [showResetOption]="false"
        [options]="countryOptions"
        [formControl]="newOrganizationForm.controls.country"
      />
      <watt-text-field
        [formControl]="newOrganizationForm.controls.cvrNumber"
        [label]="t('cvrNumber')"
        [trimOutput]="true"
      >
        <watt-field-error
          *ngIf="newOrganizationForm.controls.cvrNumber.hasError('invalidCvrNumber')"
        >
          {{ t('cvrInvalid') }}
        </watt-field-error>
      </watt-text-field>
    </vater-stack>
    <vater-stack gap="m" align="flex-start">
      <watt-text-field
        [formControl]="newOrganizationForm.controls.companyName"
        [label]="t('companyName')"
        [trimOutput]="true"
      />
      <watt-text-field
        [prefix]="'alternateEmail'"
        [formControl]="newOrganizationForm.controls.domain"
        [label]="t('domain')"
        [trimOutput]="true"
      >
        <watt-field-error *ngIf="newOrganizationForm.controls.domain.hasError('pattern')">
          {{ t('domainInvalid') }}
        </watt-field-error>
      </watt-text-field>
    </vater-stack>
  </ng-container>`,
})
export class DhNewOrganizationStepComponent {
  @Output() toggleShowCreateNewOrganization = new EventEmitter<void>();
  @Input({ required: true }) newOrganizationForm!: FormGroup<{
    country: FormControl<string>;
    cvrNumber: FormControl<string>;
    companyName: FormControl<string>;
    domain: FormControl<string>;
  }>;

  countryOptions: WattDropdownOptions = [
    { value: 'DK', displayValue: 'DK' },
    { value: 'SE', displayValue: 'SE' },
    { value: 'NO', displayValue: 'NO' },
    { value: 'FI', displayValue: 'FI' },
  ];
}
