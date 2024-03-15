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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, ViewChild, inject, signal } from '@angular/core';

import { Observable, map, of } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { Apollo, MutationResult } from 'apollo-angular';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerV2Component } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  EicFunction,
  GetGridAreasDocument,
  GetDelegatesDocument,
  DelegationMessageType,
  GetDelegationsForActorDocument,
  CreateDelegationForActorDocument,
  CreateDelegationForActorMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

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
    RxPush,
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattDatepickerV2Component,

    VaterStackComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhDelegationCreateModalComponent extends WattTypedModal<DhActorExtended> {
  private _apollo: Apollo = inject(Apollo);
  private _toastService: any = inject(WattToastService);
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  @ViewChild(WattModalComponent)
  modal: WattModalComponent | undefined;

  isSaving = signal(false);
  showGridAreaDropdown = signal(true);

  createDelegationForm = this._fb.group({
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    messageTypes: new FormControl<DelegationMessageType[] | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
    delegation: new FormControl<string | null>(null, Validators.required),
  });

  gridAreaOptions$ = this.getGridAreaOptions();
  delegations$ = this.getDelegations();
  messageTypes = this.getMessageTypes();

  closeModal(result: boolean) {
    this.modal?.close(result);
  }

  constructor() {
    super();

    this.gridAreaOptions$.pipe(takeUntilDestroyed()).subscribe((gridAreas) => {
      if (gridAreas.length === 1) {
        this.showGridAreaDropdown.set(false);
        this.createDelegationForm.controls.gridAreas.setValue([gridAreas[0].value]);
      } else {
        this.showGridAreaDropdown.set(true);
      }
    });
  }

  save() {
    if (this.createDelegationForm.invalid) return;

    const { startDate, gridAreas, messageTypes, delegation } =
      this.createDelegationForm.getRawValue();

    if (!startDate || !gridAreas || !messageTypes || !delegation) return;

    this.isSaving.set(true);

    this._apollo
      .mutate({
        mutation: CreateDelegationForActorDocument,
        refetchQueries: [GetDelegationsForActorDocument],
        variables: {
          input: {
            actorId: this.modalData.id,
            delegationDto: {
              startsAt: startDate,
              delegatedFrom: this.modalData.id,
              delegatedTo: delegation,
              gridAreas: gridAreas,
              messageTypes,
            },
          },
        },
      })
      .subscribe((result) => this.handleCreateDelegationResponse(result));
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
          value: gridArea.id,
          displayValue: `${gridArea.name} (${gridArea.code})`,
        }))
      );
    }
    return this._apollo.query({ query: GetGridAreasDocument }).pipe(
      map((result) => result.data?.gridAreas),
      exists(),
      map((gridAreas) =>
        gridAreas.map((gridArea) => ({
          value: gridArea.id,
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

  private handleCreateDelegationResponse(
    response: MutationResult<CreateDelegationForActorMutation>
  ): void {
    if (response.errors && response.errors.length > 0) {
      this._toastService.open({
        type: 'danger',
        message: parseGraphQLErrorResponse(response.errors),
      });
    }

    if (
      response.data?.createDelegationsForActor?.errors &&
      response.data?.createDelegationsForActor?.errors.length > 0
    ) {
      this._toastService.open({
        type: 'danger',
        message: readApiErrorResponse(response.data?.createDelegationsForActor?.errors),
      });
    }

    if (response.data?.createDelegationsForActor?.success) {
      this._toastService.open({
        type: 'success',
        message: translate('marketParticipant.delegation.createSuccess'),
      });

      this.closeModal(true);
    }

    this.isSaving.set(false);
  }

  private getMessageTypesToExclude(): DelegationMessageType[] {
    if (this.modalData.marketRole === EicFunction.EnergySupplier) {
      return [DelegationMessageType.Rsm018Inbound, DelegationMessageType.Rsm012Outbound];
    }

    if (this.modalData.marketRole === EicFunction.BalanceResponsibleParty) {
      return [
        DelegationMessageType.Rsm012Inbound,
        DelegationMessageType.Rsm017Inbound,
        DelegationMessageType.Rsm017Outbound,
        DelegationMessageType.Rsm019Inbound,
        DelegationMessageType.Rsm018Inbound,
        DelegationMessageType.Rsm012Outbound,
      ];
    }

    return [];
  }
}
