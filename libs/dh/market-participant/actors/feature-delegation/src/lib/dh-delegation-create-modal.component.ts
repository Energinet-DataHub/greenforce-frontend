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
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject, signal } from '@angular/core';

import { Observable, map } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import {
  DelegationMessageType,
  GetDelegatesDocument,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

@Component({
  selector: 'dh-create-delegation',
  standalone: true,
  templateUrl: './dh-delegation-create-modal.component.html',
  styles: [
    `
      :host {
        display: block;
        vater-stack > *:not(watt-datepicker) {
          width: 100%;
        }

        watt-datepicker {
          margin-right: auto;
        }
      }
    `,
  ],
  imports: [
    RxPush,
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattDatepickerComponent,

    VaterStackComponent,
    DhDropdownTranslatorDirective,
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
