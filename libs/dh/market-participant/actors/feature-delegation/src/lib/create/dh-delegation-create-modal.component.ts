//#region License
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
//#endregion
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, viewChild, inject, computed } from '@angular/core';

import { Observable, map, of, tap } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  WattDropdownOption,
  WattDropdownOptions,
  WattDropdownComponent,
} from '@energinet-datahub/watt/dropdown';

import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  EicFunction,
  DelegatedProcess,
  GetDelegatesDocument,
  GetActorDetailsDocument,
  GetDelegationsForActorDocument,
  CreateDelegationForActorDocument,
  CreateDelegationForActorMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { getGridAreaOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import { dhDateCannotBeOlderThanTodayValidator } from '../dh-delegation-validators';

@Component({
  selector: 'dh-create-delegation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-delegation-create-modal.component.html',
  styles: [
    `
      :host {
        display: block;
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
    WattFieldErrorComponent,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhDelegationCreateModalComponent extends WattTypedModal<DhActorExtended> {
  private toastService = inject(WattToastService);
  private formBuilder = inject(NonNullableFormBuilder);

  private createDelegationMutation = mutation(CreateDelegationForActorDocument);
  private getDelegatesQuery = this.getDelegations();

  modal = viewChild.required(WattModalComponent);

  today = new Date();
  isSaving = this.createDelegationMutation.loading;

  createDelegationForm = this.formBuilder.group({
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    delegatedProcesses: new FormControl<DelegatedProcess[] | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, [
      Validators.required,
      dhDateCannotBeOlderThanTodayValidator(),
    ]),
    delegation: new FormControl<string | null>(null, Validators.required),
  });

  gridAreaOptions$ = this.getGridAreaOptions();
  delegations = computed<WattDropdownOptions>(() => {
    const delegations = this.getDelegatesQuery.data()?.actorsForEicFunction ?? [];

    return delegations
      .filter((delegate) => delegate.id !== this.modalData.id)
      .map((delegate) => ({
        value: delegate.id,
        displayValue: `${delegate.glnOrEicNumber} • ${delegate.name}`,
      }));
  });

  delegatedProcesses = this.getDelegatedProcesses();

  closeModal(result: boolean) {
    this.modal().close(result);
  }

  constructor() {
    super();

    this.gridAreaOptions$.pipe(takeUntilDestroyed()).subscribe((gridAreas) => {
      if (gridAreas.length === 1) {
        this.createDelegationForm.controls.gridAreas.setValue([gridAreas[0].value]);
      }
    });
  }

  save() {
    if (this.createDelegationForm.invalid) return;

    const { startDate, gridAreas, delegatedProcesses, delegation } =
      this.createDelegationForm.getRawValue();

    if (!startDate || !gridAreas || !delegatedProcesses || !delegation) return;

    this.createDelegationMutation.mutate({
      variables: {
        input: {
          actorId: this.modalData.id,
          delegations: {
            startsAt: startDate,
            delegatedFrom: this.modalData.id,
            delegatedTo: delegation,
            gridAreas,
            delegatedProcesses,
          },
        },
      },
      refetchQueries: [GetDelegationsForActorDocument, GetActorDetailsDocument],
      onCompleted: (result) => this.handleCreateDelegationResponse(result),
    });
  }

  private getDelegatedProcesses() {
    return dhEnumToWattDropdownOptions(DelegatedProcess, this.getDelegatedProcessesToExclude());
  }

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    if (this.modalData.marketRole === EicFunction.GridAccessProvider) {
      const gridAreas = this.modalData.gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: gridArea.displayName,
      }));

      this.selectGridAreas(gridAreas);

      return of(gridAreas);
    }

    return getGridAreaOptions().pipe(tap((gridAreas) => this.selectGridAreas(gridAreas)));
  }

  private selectGridAreas(gridAreas: WattDropdownOption[]) {
    this.createDelegationForm.patchValue({
      gridAreas: gridAreas.map((gridArea) => gridArea.value),
    });
  }

  private getDelegations() {
    const eicFunctions = [EicFunction.Delegated];

    if (this.modalData.marketRole === EicFunction.GridAccessProvider) {
      eicFunctions.push(EicFunction.GridAccessProvider);
    }

    return query(GetDelegatesDocument, {
      variables: {
        eicFunctions,
      },
    });
  }

  private handleCreateDelegationResponse({
    createDelegationsForActor,
  }: CreateDelegationForActorMutation): void {
    if (createDelegationsForActor?.errors && createDelegationsForActor?.errors.length > 0) {
      this.toastService.open({
        duration: 60_000,
        type: 'danger',
        message: readApiErrorResponse(createDelegationsForActor?.errors),
      });
    }

    if (createDelegationsForActor.success) {
      this.toastService.open({
        type: 'success',
        message: translate('marketParticipant.delegation.createSuccess'),
      });

      this.closeModal(true);
    }
  }

  private getDelegatedProcessesToExclude(): DelegatedProcess[] {
    if (this.modalData.marketRole === EicFunction.BalanceResponsibleParty) {
      return [DelegatedProcess.RequestWholesaleResults];
    }

    if (this.modalData.marketRole === EicFunction.EnergySupplier) {
      return [DelegatedProcess.ReceiveMeteringPointData];
    }

    return [];
  }
}
