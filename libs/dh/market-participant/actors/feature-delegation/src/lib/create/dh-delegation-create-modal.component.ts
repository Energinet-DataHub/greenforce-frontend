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

import { Observable, map, of, tap } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { Apollo, MutationResult } from 'apollo-angular';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/picker/datepicker';
import {
  WattDropdownComponent,
  WattDropdownOption,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  EicFunction,
  GetDelegatesDocument,
  DelegatedProcess,
  GetDelegationsForActorDocument,
  CreateDelegationForActorDocument,
  CreateDelegationForActorMutation,
  GetAuditLogByActorIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import {
  parseGraphQLErrorResponse,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';
import { dateCannotBeOlderThanTodayValidator } from '../dh-delegation-validators';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

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
    WattFieldErrorComponent,

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

  date = new Date();
  isSaving = signal(false);

  createDelegationForm = this._fb.group({
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    delegatedProcesses: new FormControl<DelegatedProcess[] | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, [
      Validators.required,
      dateCannotBeOlderThanTodayValidator(),
    ]),
    delegation: new FormControl<string | null>(null, Validators.required),
  });

  gridAreaOptions$ = this.getGridAreaOptions();
  delegations$ = this.getDelegations();
  delegatedProcesses = this.getDelegatedProcesses();

  closeModal(result: boolean) {
    this.modal?.close(result);
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

    this.isSaving.set(true);

    this._apollo
      .mutate({
        mutation: CreateDelegationForActorDocument,
        variables: {
          input: {
            actorId: this.modalData.id,
            delegations: {
              startsAt: startDate,
              delegatedFrom: this.modalData.id,
              delegatedTo: delegation,
              gridAreas: gridAreas,
              delegatedProcesses,
            },
          },
        },
        refetchQueries: [GetDelegationsForActorDocument, GetAuditLogByActorIdDocument],
      })
      .subscribe((result) => this.handleCreateDelegationResponse(result));
  }

  private getDelegatedProcesses() {
    return dhEnumToWattDropdownOptions(
      DelegatedProcess,
      'asc',
      this.getDelegatedProcessesToExclude()
    );
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

  private getDelegations(): Observable<WattDropdownOptions> {
    const eicFunctions = [EicFunction.Delegated];

    if (this.modalData.marketRole === EicFunction.GridAccessProvider) {
      eicFunctions.push(EicFunction.GridAccessProvider);
    }

    return this._apollo
      .query({
        query: GetDelegatesDocument,
        variables: {
          eicFunctions,
        },
      })
      .pipe(
        map((result) => result.data?.actorsForEicFunction),
        exists(),
        map((delegates) =>
          delegates
            .filter((delegate) => delegate.id !== this.modalData.id)
            .map((delegate) => ({
              value: delegate.id,
              displayValue: `${delegate.glnOrEicNumber} • ${delegate.name}`,
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
        duration: 120_000,
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

  private getDelegatedProcessesToExclude(): DelegatedProcess[] {
    if (this.modalData.marketRole === EicFunction.BalanceResponsibleParty) {
      return [DelegatedProcess.RequestWholesaleResults];
    }

    return [];
  }
}
