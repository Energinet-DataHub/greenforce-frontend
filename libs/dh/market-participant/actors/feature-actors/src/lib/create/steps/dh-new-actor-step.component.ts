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
import { Component, Input, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  EicFunctionType,
  GetGridAreasForCreateActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

@Component({
  standalone: true,
  selector: 'dh-new-actor-step',
  imports: [
    VaterStackComponent,
    TranslocoDirective,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattDropdownComponent,
    ReactiveFormsModule,
    NgIf,
    DhDropdownTranslatorDirective,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      watt-dropdown {
        width: 100%;
      }

      h4 {
        margin-top: 0;
      }
    `,
  ],
  template: `<vater-stack
    gap="xl"
    align="flex-start"
    direction="row"
    *transloco="let t; read: 'marketParticipant.actor.create'"
  >
    <vater-stack fill="horizontal" align="flex-start" direction="column">
      <h4>{{ t('marketParty') }}</h4>

      <watt-text-field
        [formControl]="newActorForm.controls.glnOrEicNumber"
        [label]="t('glnOrEicNumber')"
      >
        <watt-field-error *ngIf="newActorForm.controls.glnOrEicNumber.hasError('invalidGlnOrEic')">
          {{ t('glnOrEicInvalid') }}
        </watt-field-error>
      </watt-text-field>

      <watt-text-field
        [formControl]="newActorForm.controls.name"
        [label]="t('name')"
        [tooltip]="t('tooltip')"
      />
      <watt-dropdown
        translate="marketParticipant.marketRoles"
        dhDropdownTranslator
        [options]="marketRoleOptions"
        (ngModelChange)="onMarketRoleChange($event)"
        [formControl]="newActorForm.controls.marketrole"
        [label]="t('marketRole')"
      />

      <watt-dropdown
        *ngIf="showGridAreaOptions()"
        [options]="gridAreaOptions"
        [formControl]="newActorForm.controls.gridArea"
        [label]="t('gridArea')"
      />
    </vater-stack>
    <vater-stack fill="horizontal" align="flex-start" direction="column">
      <h4>{{ t('contact') }}</h4>
      <watt-text-field
        [formControl]="newActorForm.controls.contact.controls.departmentOrName"
        [label]="t('departmentOrName')"
      />
      <watt-text-field
        [formControl]="newActorForm.controls.contact.controls.email"
        [label]="t('email')"
      >
        <watt-field-error *ngIf="newActorForm.controls.contact.controls.email.hasError('pattern')">
          {{ t('wrongEmailPattern') }}
        </watt-field-error>
      </watt-text-field>
      <watt-text-field
        [formControl]="newActorForm.controls.contact.controls.phone"
        [label]="t('phone')"
      >
        <watt-field-error *ngIf="newActorForm.controls.contact.controls.phone.hasError('pattern')">
          {{ t('phoneInvalid') }}
        </watt-field-error>
      </watt-text-field>
    </vater-stack>
  </vater-stack>`,
})
export class DhNewActorStepComponent {
  private _apollo = inject(Apollo);

  @Input({ required: true }) newActorForm!: FormGroup<{
    glnOrEicNumber: FormControl<string>;
    name: FormControl<string>;
    marketrole: FormControl<EicFunctionType>;
    gridArea: FormControl<string>;
    contact: FormGroup<{
      departmentOrName: FormControl<string>;
      email: FormControl<string>;
      phone: FormControl<string>;
    }>;
  }>;

  marketRoleOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(EicFunctionType);
  gridAreaOptions: WattDropdownOptions = [];

  showGridAreaOptions = signal(false);

  constructor() {
    this._apollo
      .query({
        notifyOnNetworkStatusChange: true,
        query: GetGridAreasForCreateActorDocument,
      })
      .subscribe((result) => {
        if (result.data?.gridAreas) {
          this.gridAreaOptions = result.data.gridAreas.map((gridArea) => ({
            value: gridArea.id,
            displayValue: gridArea.name,
          }));
        }
      });
  }

  onMarketRoleChange(eicfunction: EicFunctionType): void {
    this.showGridAreaOptions.set(eicfunction === EicFunctionType.GridAccessProvider);
    if (eicfunction === EicFunctionType.GridAccessProvider) {
      this.newActorForm.controls.gridArea.enable();
    }
  }
}
