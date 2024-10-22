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
import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@ngneat/transloco';

import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattActionChipComponent } from '@energinet-datahub/watt/chip';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
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
    WattActionChipComponent,

    VaterStackComponent,
    VaterFlexComponent,
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
      @if (multipleDomainSupport) {
        <vater-stack direction="row" gap="m" fill="horizontal">
          <watt-text-field
            [prefix]="'alternateEmail'"
            [formControl]="newOrganizationForm().controls.domain"
            [label]="t('domain')"
          >
            @if (newOrganizationForm().controls.domain.hasError('pattern')) {
              <watt-field-error>
                {{ t('domainInvalid') }}
              </watt-field-error>
            }
          </watt-text-field>
          <watt-button variant="text" (click)="addDomain()">{{ t('add') }}</watt-button>
        </vater-stack>
        <vater-flex wrap="wrap" direction="row" grow="0" gap="s" justify="flex-start">
          @for (domain of newOrganizationForm().controls.domains.value; track domain) {
            <watt-action-chip icon="remove" (click)="removeDomain(domain)">{{
              domain
            }}</watt-action-chip>
          }
        </vater-flex>
      } @else {
        <watt-text-field
          [prefix]="'alternateEmail'"
          [formControl]="newOrganizationForm().controls.domain"
          [label]="t('domain')"
        >
          @if (newOrganizationForm().controls.domain.hasError('pattern')) {
            <watt-field-error>
              {{ t('domainInvalid') }}
            </watt-field-error>
          }
        </watt-text-field>
      }
    </vater-stack>
  </ng-container>`,
})
export class DhNewOrganizationStepComponent {
  private readonly featureFlags = inject(DhFeatureFlagsService);
  toggleShowCreateNewOrganization = output<void>();
  lookingForCVR = input.required<boolean>();
  newOrganizationForm = input.required<
    FormGroup<{
      country: FormControl<string>;
      cvrNumber: FormControl<string>;
      companyName: FormControl<string>;
      domain: FormControl<string>;
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

  addDomain() {
    if (this.newOrganizationForm().controls.domain.invalid) return;

    this.newOrganizationForm().controls.domains.value.push(
      this.newOrganizationForm().controls.domain.value
    );

    this.newOrganizationForm().controls.domain.reset();
  }

  removeDomain(domain: string) {
    this.newOrganizationForm().controls.domains.patchValue(
      this.newOrganizationForm().controls.domains.value.filter((d) => d !== domain)
    );
  }

  multipleDomainSupport = this.featureFlags.isEnabled('support-for-multiple-domains');
}
