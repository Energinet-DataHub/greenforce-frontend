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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, throwError, withLatestFrom } from 'rxjs';
import { add } from 'date-fns';

import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';

interface EoTransfersState {
  hasLoaded: boolean;
  patchingTransfer: boolean;
  patchingTransferError: HttpErrorResponse | null;
  transfers: EoListedTransfer[];
  selectedTransfer?: EoListedTransfer;
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoTransfersStore extends ComponentStore<EoTransfersState> {
  readonly hasLoaded$ = this.select((state) => state.hasLoaded);
  readonly transfers$ = this.select((state) => state.transfers);
  readonly selectedTransfer$ = this.select((state) => state.selectedTransfer);
  readonly error$ = this.select((state) => state.error);
  readonly patchingTransfer$ = this.select((state) => state.patchingTransfer);
  readonly patchingTransferError$ = this.select((state) => state.patchingTransferError);

  readonly setSelectedTransfer = this.updater(
    (state, selectedTransfer: EoListedTransfer | undefined): EoTransfersState => ({
      ...state,
      selectedTransfer,
    })
  );

  readonly setTransfer = this.updater(
    (state, updatedTransfer: EoListedTransfer): EoTransfersState => ({
      ...state,
      transfers: state.transfers.map((transfer) => {
        return transfer.id === updatedTransfer.id
          ? this.datesToMilliseconds(updatedTransfer)
          : transfer;
      }),
      selectedTransfer: this.datesToMilliseconds(updatedTransfer),
      patchingTransfer: false,
      patchingTransferError: null,
    })
  );

  readonly getTransfers = this.effect(() => {
    return this.service.getTransfers().pipe(
      tapResponse(
        (response) => {
          this.setTransfers(
            response?.result?.map((transfer) => this.datesToMilliseconds(transfer))
          );
        },
        (error: HttpErrorResponse) => {
          this.setError(error);
        }
      )
    );
  });

  readonly patchSelectedTransfer = this.effect(
    (options$: Observable<{ endDate: string; onSuccess: () => void; onError: () => void }>) => {
      return options$.pipe(
        withLatestFrom(this.selectedTransfer$),
        switchMap(([options, selectedTransfer]) => {
          if (!selectedTransfer) {
            return throwError(() => new Error('No selected transfer'));
          }

          this.patchState({ patchingTransfer: true });

          const nextDay = add(new Date(options.endDate), { days: 1 });
          return this.service
            .updateAgreement(selectedTransfer.id, Math.round(nextDay.getTime() / 1000))
            .pipe(
              tapResponse(
                (response) => {
                  this.setTransfer(response);
                  options.onSuccess();
                },
                (error: HttpErrorResponse) => {
                  this.setPatchingTransferError(error);
                  options.onError();
                }
              )
            );
        })
      );
    }
  );

  private readonly setTransfers = this.updater(
    (state, transfers: EoListedTransfer[]): EoTransfersState => ({
      ...state,
      transfers,
      hasLoaded: true,
      error: null,
    })
  );

  private readonly addSingleTransfer = this.updater(
    (state, transfer: EoListedTransfer): EoTransfersState => ({
      ...state,
      transfers: [transfer].concat(state.transfers),
    })
  );

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoTransfersState => ({
      ...state,
      error,
      hasLoaded: true,
    })
  );

  private readonly setPatchingTransferError = this.updater(
    (state, error: HttpErrorResponse | null): EoTransfersState => ({
      ...state,
      patchingTransferError: error,
      patchingTransfer: false,
    })
  );

  constructor(private service: EoTransfersService) {
    super({
      hasLoaded: false,
      transfers: [],
      error: null,
      patchingTransfer: false,
      patchingTransferError: null,
    });
  }

  addTransfer(transfer: EoListedTransfer) {
    this.addSingleTransfer(this.datesToMilliseconds(transfer));
  }

  private datesToMilliseconds(transfer: EoListedTransfer): EoListedTransfer {
    return { ...transfer, startDate: transfer.startDate * 1000, endDate: transfer.endDate * 1000 };
  }
}
