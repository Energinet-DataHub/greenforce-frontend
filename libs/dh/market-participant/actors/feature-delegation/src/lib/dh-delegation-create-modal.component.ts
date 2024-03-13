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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Observable, map, of } from 'rxjs';
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
  EicFunction,
  GetDelegatesDocument,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

/** TODO: Remove when Typescript 5.4 lands with support for groupBy  */
declare global {
  interface ObjectConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K extends PropertyKey, T>(
      items: Iterable<T>,
      keySelector: (item: T, index: number) => K
    ): Partial<Record<K, T[]>>;
  }

  interface MapConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K, T>(items: Iterable<T>, keySelector: (item: T, index: number) => K): Map<K, T[]>;
  }
}

@Component({
  selector: 'dh-create-delegation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    messageTypes: new FormControl<string[] | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
    delegations: new FormControl<string[] | null>(null, Validators.required),
  });

  gridAreaOptions$ = this.getGridAreaOptions();
  delegations$ = this.getDelegations();
  messageTypes = this.getMessageTypes();

  closeModal(result: boolean) {}

  constructor() {
    super();

    this.gridAreaOptions$.subscribe((gridAreas) => {
      if (gridAreas.length === 1) {
        this.createDelegationForm.controls.gridAreas.setValue([gridAreas[0].value]);
      }
    });
  }

  save() {
    this.isSaving.set(true);
    setTimeout(() => this.isSaving.set(false), 2000);
    console.log(this.createDelegationForm.value);
    console.log('Saving');
  }

  private getMessageTypes() {
    const groupedMessageTypes = [];
    const messageTypes = dhEnumToWattDropdownOptions(
      DelegationMessageType,
      this.getMessageTypesToExclude()
    );
    const groupByMessageTypes = Object.groupBy(
      messageTypes,
      (messageType) => messageType.value.split('_')[1]
    );

    for (const [key, value] of Object.entries(groupByMessageTypes)) {
      groupedMessageTypes.push({ value: key, displayValue: key, disabled: true });
      if (value === undefined) continue;

      for (const messageType of value) {
        groupedMessageTypes.push(messageType);
      }
    }

    return groupedMessageTypes;
  }

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    if (this.modalData.marketRole === EicFunction.GridAccessProvider) {
      return of(
        this.modalData.gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: gridArea.name,
        }))
      );
    }
    return this._apollo.query({ query: GetGridAreasDocument }).pipe(
      map((result) => result.data?.gridAreas),
      exists(),
      map((gridAreas) =>
        gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: gridArea.displayName,
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

  private getMessageTypesToExclude(): DelegationMessageType[] {
    if (this.modalData.marketRole === EicFunction.EnergySupplier) {
      return [
        //DelegationMessageType.Rsm018Inbound coming
        //DelegationMessageType.Rsm012Outbound coming
      ];
    }

    if (this.modalData.marketRole === EicFunction.BalanceResponsibleParty) {
      return [
        DelegationMessageType.Rsm012Inbound,
        DelegationMessageType.Rsm017Inbound,
        DelegationMessageType.Rsm017Outbound,
        DelegationMessageType.Rsm019Inbound,
        //DelegationMessageType.Rsm018Inbound coming
        //DelegationMessageType.Rsm012Outbound coming
      ];
    }

    return [];
  }
}
