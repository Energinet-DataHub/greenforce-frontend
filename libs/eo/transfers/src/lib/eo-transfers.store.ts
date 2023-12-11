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
import { Observable, firstValueFrom, of, switchMap, tap, throwError, withLatestFrom } from 'rxjs';
import { fromUnixTime } from 'date-fns';

import {
  EoListedTransfer,
  EoTransferAgreementProposal,
  EoTransferAgreementsHistory,
  EoTransfersService,
} from './eo-transfers.service';
import { EoAuthStore } from '@energinet-datahub/eo/shared/services';

interface EoTransfersState {
  loadingTransferAgreements: boolean;
  patchingTransfer: boolean;
  patchingTransferError: HttpErrorResponse | null;
  transfers: EoListedTransfer[];
  selectedTransfer?: EoListedTransfer;
  error: HttpErrorResponse | null;
  historyOfSelectedTransfer: EoTransferAgreementsHistory[];
  historyOfSelectedTransferError: HttpErrorResponse | null;
  historyOfSelectedTransferLoading: boolean;
  walletDepositEndpoint?: string;
  walletDepositEndpointError: HttpErrorResponse | null;
  walletDepositEndpointLoading: boolean;
}

export interface EoExistingTransferAgreement {
  startDate: number;
  endDate: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoTransfersStore extends ComponentStore<EoTransfersState> {
  readonly transfers$ = this.select((state) => state.transfers);
  readonly loadingTransferAgreements$ = this.select((state) => state.loadingTransferAgreements);
  readonly selectedTransfer$ = this.select((state) => state.selectedTransfer);
  readonly error$ = this.select((state) => state.error);

  readonly patchingTransfer$ = this.select((state) => state.patchingTransfer);
  readonly patchingTransferError$ = this.select((state) => state.patchingTransferError);

  readonly historyOfSelectedTransfer$ = this.select((state) => state.historyOfSelectedTransfer);
  readonly historyOfSelectedTransferError$ = this.select(
    (state) => state.historyOfSelectedTransferError
  );
  readonly historyOfSelectedTransferLoading$ = this.select(
    (state) => state.historyOfSelectedTransferLoading
  );

  readonly receiversTin$ = this.authStore.getTin$.pipe(
    switchMap((ownTin) => {
      return this.select((state) => {
        const tinArray = state.transfers.reduce((acc, transfer) => {
          if (transfer.receiverTin !== ownTin) {
            acc.push(transfer.receiverTin);
          }
          if (transfer.senderTin !== ownTin) {
            acc.push(transfer.senderTin);
          }
          return acc;
        }, [] as string[]);

        return [...new Set(tinArray)];
      });
    })
  );

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
        return transfer.id === updatedTransfer.id ? updatedTransfer : transfer;
      }),
      selectedTransfer: updatedTransfer,
      patchingTransfer: false,
      patchingTransferError: null,
    })
  );

  readonly getTransfers = this.effect(() => {
    return this.service.getTransfers().pipe(
      tap(() => {
        this.patchState({ loadingTransferAgreements: true, error: null });
      }),
      tapResponse(
        (response) => {
          this.setTransfers(
            response && response.result
              ? response.result.map((transfer) => {
                  return {
                    ...transfer,
                    startDate: fromUnixTime(transfer.startDate).getTime(),
                    endDate: transfer.endDate ? fromUnixTime(transfer.endDate).getTime() : null,
                  };
                })
              : []
          );
          this.patchState({ loadingTransferAgreements: false });
        },
        (error: HttpErrorResponse) => {
          this.setError(error);
          this.patchState({ loadingTransferAgreements: false });
        }
      )
    );
  });

  readonly getHistory = this.effect((transferAgreementId$: Observable<string>) => {
    return transferAgreementId$.pipe(
      tap(() => {
        this.patchState({
          historyOfSelectedTransferLoading: true,
          historyOfSelectedTransfer: [],
          historyOfSelectedTransferError: null,
        });
      }),
      switchMap((id) =>
        this.service.getHistory(id).pipe(
          tapResponse(
            (response) => {
              this.setHistoryOfSelectedTransfer(response ?? []);
            },
            (error: HttpErrorResponse) => {
              this.setHistoryOfSelectedTransferError(error);
            }
          )
        )
      )
    );
  });

  readonly patchSelectedTransfer = this.effect(
    (
      options$: Observable<{ endDate: number | null; onSuccess: () => void; onError?: () => void }>
    ) => {
      return options$.pipe(
        withLatestFrom(this.selectedTransfer$),
        switchMap(([options, selectedTransfer]) => {
          if (!selectedTransfer) {
            return throwError(() => new Error('No selected transfer'));
          }

          this.patchState({ patchingTransfer: true });

          let endDate = options.endDate;
          if (endDate) {
            endDate = Math.round(endDate / 1000);
          }

          return this.service.updateAgreement(selectedTransfer.id, endDate).pipe(
            tapResponse(
              (response) => {
                this.setTransfer(response);
                options.onSuccess();
              },
              (error: HttpErrorResponse) => {
                this.setPatchingTransferError(error);
                if (options.onError) {
                  options.onError();
                }
              }
            )
          );
        })
      );
    }
  );

  readonly removeTransfer = this.updater(
    (state, proposalId: string): EoTransfersState => ({
      ...state,
      transfers: state.transfers.filter((transfer) => transfer.id !== proposalId),
    })
  );

  private readonly setTransfers = this.updater(
    (state, transfers: EoListedTransfer[]): EoTransfersState => ({
      ...state,
      transfers,
      loadingTransferAgreements: false,
      error: null,
    })
  );

  private readonly addSingleTransfer = this.updater(
    (state, transfer: EoListedTransfer): EoTransfersState => ({
      ...state,
      transfers: [
        ...state.transfers,
        {
          ...transfer,
          startDate: fromUnixTime(transfer.startDate).getTime(),
          endDate: transfer.endDate ? fromUnixTime(transfer.endDate).getTime() : null,
        },
      ],
    })
  );

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoTransfersState => ({
      ...state,
      error,
      loadingTransferAgreements: false,
    })
  );

  readonly setPatchingTransferError = this.updater(
    (state, error: HttpErrorResponse | null): EoTransfersState => ({
      ...state,
      patchingTransferError: error,
      patchingTransfer: false,
    })
  );

  private readonly setHistoryOfSelectedTransfer = this.updater(
    (state, historyOfSelectedTransfer: EoTransferAgreementsHistory[]): EoTransfersState => ({
      ...state,
      historyOfSelectedTransfer: historyOfSelectedTransfer.map((history) => {
        return {
          ...history,
          createdAt: fromUnixTime(history.createdAt).getTime(),
          transferAgreement: {
            ...history.transferAgreement,
            endDate: history.transferAgreement.endDate
              ? fromUnixTime(history.transferAgreement.endDate).getTime()
              : null,
          },
        };
      }),
      historyOfSelectedTransferError: null,
      historyOfSelectedTransferLoading: false,
    })
  );

  private readonly setHistoryOfSelectedTransferError = this.updater(
    (state, historyOfSelectedTransferError: HttpErrorResponse | null): EoTransfersState => ({
      ...state,
      historyOfSelectedTransfer: [],
      historyOfSelectedTransferError,
      historyOfSelectedTransferLoading: false,
    })
  );

  readonly getExistingTransferAgreements$ = (
    receiverTin: string | null,
    id?: string
  ): Observable<EoExistingTransferAgreement[]> => {
    if (!receiverTin) return of([]);
    return this.select((state) =>
      state.transfers
        .filter((transfer) => transfer.id !== id)
        .filter((transfer) => transfer.receiverTin === receiverTin)
        .map((transfer) => {
          return { startDate: transfer.startDate, endDate: transfer.endDate };
        })
        // Filter out transfers that have ended
        .filter((transfer) => transfer.endDate === null || transfer.endDate > new Date().getTime())
        .sort((a, b) => {
          if (a.endDate === null) return 1; // a is lesser if its endDate is null
          if (b.endDate === null) return -1; // b is lesser if its endDate is null
          return a.endDate - b.endDate;
        })
    );
  };

  constructor(
    private service: EoTransfersService,
    private authStore: EoAuthStore
  ) {
    super({
      loadingTransferAgreements: false,
      transfers: [],
      error: null,
      patchingTransfer: false,
      patchingTransferError: null,
      historyOfSelectedTransfer: [],
      historyOfSelectedTransferError: null,
      historyOfSelectedTransferLoading: false,
      walletDepositEndpointError: null,
      walletDepositEndpointLoading: false,
    });
  }

  addTransfer(transfer: EoListedTransfer) {
    this.addSingleTransfer(transfer);
  }

  async addTransferProposal(proposal: EoTransferAgreementProposal) {
    const tin = (await firstValueFrom(this.authStore.getTin$)) || '';
    this.addSingleTransfer({
      ...proposal,
      startDate: proposal.startDate / 1000,
      endDate: proposal.endDate ? proposal.endDate / 1000 : null,
      senderName: proposal.senderCompanyName,
      senderTin: '',
      receiverTin: proposal.receiverTin !== null ? proposal.receiverTin : tin,
    });
  }
}
