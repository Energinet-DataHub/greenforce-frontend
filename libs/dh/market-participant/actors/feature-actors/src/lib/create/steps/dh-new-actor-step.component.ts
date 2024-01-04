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

import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  EicFunction,
  GetGridAreasForCreateActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';

import { ActorForm } from '../dh-actor-form.model';

@Component({
  standalone: true,
  selector: 'dh-new-actor-step',
  imports: [
    VaterStackComponent,
    TranslocoDirective,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
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
        <watt-field-hint>{{ t('glnOrEicHint') }}</watt-field-hint>
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
        [showResetOption]="false"
        (ngModelChange)="onMarketRoleChange($event)"
        [formControl]="newActorForm.controls.marketrole"
        [label]="t('marketRole')"
      />

      <watt-dropdown
        *ngIf="showGridAreaOptions()"
        [options]="gridAreaOptions"
        [multiple]="true"
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
        <watt-field-hint>{{ t('phoneHint') }}</watt-field-hint>
        <watt-field-error *ngIf="newActorForm.controls.contact.controls.phone.hasError('pattern')">
          {{ t('phoneInvalid') }}
        </watt-field-error>
      </watt-text-field>
    </vater-stack>
  </vater-stack>`,
})
export class DhNewActorStepComponent {
  private _apollo = inject(Apollo);

  @Input({ required: true }) newActorForm!: ActorForm;

  marketRoleOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(EicFunction);
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

  onMarketRoleChange(eicfunction: EicFunction): void {
    this.showGridAreaOptions.set(eicfunction === EicFunction.GridAccessProvider);

    if (eicfunction === EicFunction.GridAccessProvider) {
      this.newActorForm.controls.gridArea.enable();
    }
  }
}
