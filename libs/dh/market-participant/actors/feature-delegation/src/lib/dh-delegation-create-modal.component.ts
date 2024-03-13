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
import { Component, inject, signal } from '@angular/core';
import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { TranslocoDirective } from '@ngneat/transloco';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatepickerV2Component } from '@energinet-datahub/watt/datepicker';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  DelegationMessageType,
  GetDelegatesDocument,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Observable, map } from 'rxjs';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { RxPush } from '@rx-angular/template/push';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-create-delegation',
  standalone: true,
  template: `<watt-modal
    title="{{ t('modalTitle') + ' ' + modalData.name }}"
    *transloco="let t; read: 'marketParticipant.delegation'"
  >
    <form id="set-up-delgation-form" [formGroup]="createDelegationForm" (ngSubmit)="save()">
      <vater-stack fill="horizontal" justify="flex-start">
        <watt-dropdown
          label="{{ t('delegations') }}"
          [formControl]="createDelegationForm.controls.delegations"
          [options]="delegations$ | push"
        />
        <watt-dropdown
          [multiple]="true"
          label="{{ t('message') }}"
          [formControl]="createDelegationForm.controls.messageTypes"
          [options]="messageTypes"
          translate="marketParticipant.delegation.messageTypes"
          dhDropdownTranslator
        />
        <watt-dropdown
          [multiple]="true"
          label="{{ t('gridArea') }}"
          [formControl]="createDelegationForm.controls.gridAreas"
          [options]="gridAreaOptions$ | push"
        />
        <watt-datepicker-v2
          [label]="t('start')"
          [formControl]="createDelegationForm.controls.startDate"
        />
      </vater-stack>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="closeModal(false)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button type="submit" formId="set-up-delgation-form" [loading]="isSaving()">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </form>
  </watt-modal>`,
  styles: [
    `
      :host {
        display: block;
        vater-stack > *:not(watt-datepicker-v2) {
          width: 100%;
        }

        watt-datepicker-v2 {
          margin-right: auto;
        }
      }
    `,
  ],
  imports: [
    WATT_MODAL,
    TranslocoDirective,
    WattDropdownComponent,
    VaterStackComponent,
    ReactiveFormsModule,
    RxPush,
    DhDropdownTranslatorDirective,
    WattButtonComponent,
    WattDatepickerV2Component,
  ],
})
export class DhDelegationCreateModalComponent extends WattTypedModal<DhActorExtended> {
  private _apollo: Apollo = inject(Apollo);
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  isSaving = signal(false);

  createDelegationForm = this._fb.group({
    gridAreas: [[], Validators.required],
    messageTypes: [[], Validators.required],
    startDate: new FormControl<Date | null>(null, Validators.required),
    delegations: [[], Validators.required],
  });

  gridAreaOptions$ = this.getGridAreaOptions();
  delegations$ = this.getDelegations();
  messageTypes = dhEnumToWattDropdownOptions(DelegationMessageType);

  closeModal(result: boolean) {}

  save() {
    this.isSaving.set(true);
    console.log(this.createDelegationForm.value);
    console.log('Saving');
  }

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    return this._apollo.query({ query: GetGridAreasDocument }).pipe(
      map((result) => result.data?.gridAreas),
      exists(),
      map((gridAreas) =>
        gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: `${gridArea.name} (${gridArea.code})`,
        }))
      )
    );
  }

  private getDelegations(): Observable<WattDropdownOptions> {
    return this._apollo.query({ query: GetDelegatesDocument }).pipe(
      map((result) => result.data?.actorsForEicFunction),
      exists(),
      map((delegates) =>
        delegates.map((delegate) => ({
          value: delegate.id,
          displayValue: delegate.name,
        }))
      )
    );
  }
}
