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
import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';

import { DhOrganizationManageComponent } from '@energinet-datahub/dh/market-participant/actors/shared';
@Component({
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WattButtonComponent,
    WattSpinnerComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,

    VaterStackComponent,
    VaterFlexComponent,
    DhDropdownTranslatorDirective,

    DhOrganizationManageComponent,
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

      :host > watt-dropdown,
      :host > vater-stack,
      :host > vater-flex {
        width: 50%;
      }

      watt-spinner {
        margin-right: var(--watt-space-s);
      }
    `,
  ],

  template: `<ng-container *transloco="let t; read: 'marketParticipant.actor.create'">
    <vater-stack direction="row" justify="space-between" class="watt-space-stack-m">
      <h4>{{ t('newOrganization') }}</h4>
      <watt-button variant="text" (click)="toggleShowCreateNewOrganization.emit()">{{
        t('chooseOrganization')
      }}</watt-button>
    </vater-stack>

    <vater-stack gap="m" align="center" direction="row">
      <watt-dropdown
        translateKey="marketParticipant.actor.create.counties"
        dhDropdownTranslator
        [label]="t('country')"
        [showResetOption]="false"
        [options]="countryOptions"
        [formControl]="newOrganizationForm().controls.country"
      />
      <watt-text-field
        [formControl]="newOrganizationForm().controls.cvrNumber"
        [label]="t('cvrNumber')"
      >
        @if (this.lookingForCVR()) {
          <watt-spinner [diameter]="22" />
        }
        @if (newOrganizationForm().controls.cvrNumber.hasError('invalidCvrNumber')) {
          <watt-field-error>
            {{ t('cvrInvalid') }}
          </watt-field-error>
        }
      </watt-text-field>
    </vater-stack>

    <vater-stack gap="m" align="flex-start">
      <watt-text-field
        [formControl]="newOrganizationForm().controls.companyName"
        [label]="t('companyName')"
      />

      <dh-organization-manage [domains]="newOrganizationForm().controls.domains" />
    </vater-stack>
  </ng-container>`,
})
export class DhNewOrganizationStepComponent {
  toggleShowCreateNewOrganization = output<void>();
  lookingForCVR = input.required<boolean>();
  newOrganizationForm = input.required<
    FormGroup<{
      country: FormControl<string>;
      cvrNumber: FormControl<string>;
      companyName: FormControl<string>;
      domains: FormControl<string[]>;
    }>
  >();

  countryOptions: WattDropdownOptions = [
    { value: 'DK', displayValue: 'DK' },
    { value: 'SE', displayValue: 'SE' },
    { value: 'NO', displayValue: 'NO' },
    { value: 'FI', displayValue: 'FI' },
    { value: 'DE', displayValue: 'DE' },
  ];
}
