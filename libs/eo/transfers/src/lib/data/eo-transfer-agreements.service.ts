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
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, signal } from '@angular/core';
import { first, map, Observable, switchMap } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { getUnixTime } from 'date-fns';
import { EoActorService, EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import {
  ListedTransferAgreement,
  ListedTransferAgreementResponse,
  TransferAgreementDTO,
  TransferAgreementProposal,
  TransferAgreementProposalRequest,
  TransferAgreementProposalResponse,
  TransferAgreementRequest,
} from './transfer-agreement.types';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { TranslocoService } from '@ngneat/transloco';
import { translations } from '@energinet-datahub/eo/translations';

@Injectable({
  providedIn: 'root',
})
export class EoTransferAgreementsService {
  public transferAgreements = signal<{
    loading: boolean;
    error: boolean;
    data: ListedTransferAgreement[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  public transferAgreementsFromPOA = signal<{
    loading: boolean;
    error: boolean;
    data: ListedTransferAgreement[];
  }>({
    loading: false,
    error: false,
    data: [],
  });
  public selectedTransferAgreement = signal<ListedTransferAgreement | undefined>(undefined);
  public selectedTransferAgreementFromPOA = signal<ListedTransferAgreement | undefined>(undefined);
  public newlyCreatedProposalId = signal<string | null>(null);
  public creatingTransferAgreementProposal = signal<boolean>(false);
  public creatingTransferAgreementProposalFailed = signal<boolean>(false);

  // State
  #apiBase: string;
  #authService = inject(EoAuthService);
  private toastService = inject(WattToastService);

  private transloco = inject(TranslocoService);
  private translations = translations;
  private user = this.#authService.user;
  private actorService = inject(EoActorService);

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  fetchTransferAgreements() {
    this.setTransferAgreements(true, false, [...this.transferAgreements().data]);
    this.getTransferAgreements()
      .pipe(first())
      .subscribe({
        next: (transferAgreements) => {
          this.setTransferAgreements(
            false,
            false,
            transferAgreements.map((transferAgreement) => {
              return {
                ...transferAgreement,
                startDate: transferAgreement.startDate * 1000,
                endDate: transferAgreement.endDate ? transferAgreement.endDate * 1000 : null,
              };
            })
          );
        },
        error: () => {
          this.setTransferAgreements(false, true, []);
        },
      });
  }

  fetchTransferAgreementsFromPOA() {
    this.setTransferAgreementsFromPOA(true, false, [...this.transferAgreementsFromPOA().data]);
    this.getTransferAgreementsFromPOA()
      .pipe(first())
      .subscribe({
        next: (transferAgreementsFromPOA) => {
          this.setTransferAgreementsFromPOA(
            false,
            false,
            transferAgreementsFromPOA.map((transferAgreement) => {
              return {
                ...transferAgreement,
                startDate: transferAgreement.startDate * 1000,
                endDate: transferAgreement.endDate ? transferAgreement.endDate * 1000 : null,
              };
            })
          );
        },
        error: () => {
          this.setTransferAgreementsFromPOA(false, true, []);
        },
      });
  }

  setSelectedTransferAgreement(transferAgreement: ListedTransferAgreement | undefined) {
    this.selectedTransferAgreement.set(transferAgreement);
  }

  setSelectedTransferAgreementFromPOA(transferAgreement: ListedTransferAgreement | undefined) {
    this.selectedTransferAgreementFromPOA.set(transferAgreement);
  }

  setTransferAgreements(
    loading: boolean,
    error: boolean,
    transferAgreements: ListedTransferAgreement[]
  ) {
    this.transferAgreements.set({
      loading: loading,
      error: error,
      data: transferAgreements,
    });
  }

  setTransferAgreementsFromPOA(
    loading: boolean,
    error: boolean,
    transferAgreements: ListedTransferAgreement[]
  ) {
    this.transferAgreementsFromPOA.set({
      loading: loading,
      error: error,
      data: transferAgreements,
    });
  }

  setCreatingTransferAgreementProposal(creating: boolean) {
    this.creatingTransferAgreementProposal.set(creating);
  }

  setCreatingTransferAgreementProposalFailed(failed: boolean) {
    this.creatingTransferAgreementProposalFailed.set(failed);
  }

  acceptProposal(proposal: TransferAgreementProposal) {
    this.createTransferAgreementFromProposal(proposal.id).subscribe({
      next: (proposal) => {
        const transferAgreementFromProposal: ListedTransferAgreement = {
          ...proposal,
          senderName: proposal.senderCompanyName,
          senderTin: '',
          transferAgreementStatus: 'Proposal',
        };
        this.addTransferAgreement(transferAgreementFromProposal);
      },
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.creationOfTransferAgreementFromProposalFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  createNewTransferAgreementProposal(
    transferAgreementProposalRequest: TransferAgreementProposalRequest,
    senderTin: string
  ) {
    this.newlyCreatedProposalId.set(null);
    this.setCreatingTransferAgreementProposal(true);
    this.createTransferAgreementProposal(transferAgreementProposalRequest).subscribe({
      next: (proposal: TransferAgreementProposalResponse) => {
        this.newlyCreatedProposalId.set(proposal.id);
        const newTransferAgreement: ListedTransferAgreement = {
          ...proposal,
          id: proposal.id,
          senderTin: senderTin,
          senderName: proposal.senderCompanyName,
          transferAgreementStatus: 'Proposal',
          startDate: transferAgreementProposalRequest.startDate,
          endDate: transferAgreementProposalRequest.endDate ?? null,
        };
        this.addTransferAgreement(newTransferAgreement);
        this.setCreatingTransferAgreementProposal(false);
        this.setCreatingTransferAgreementProposalFailed(false);
      },
      error: () => {
        this.newlyCreatedProposalId.set(null);
        this.setCreatingTransferAgreementProposal(false);
        this.setCreatingTransferAgreementProposalFailed(true);
      },
    });
  }

  createNewTransferAgreement(
    transferAgreementRequest: TransferAgreementRequest,
    receiverName: string
  ) {
    this.createTransferAgreement(transferAgreementRequest).subscribe({
      next: (transferAgreementDTO) => {
        const transferAgreement: ListedTransferAgreement = {
          id: transferAgreementDTO.id,
          senderTin: transferAgreementDTO.senderTin,
          receiverTin: transferAgreementDTO.receiverTin,
          startDate: transferAgreementDTO.startDate,
          endDate: transferAgreementDTO.endDate === undefined ? null : transferAgreementDTO.endDate,
          transferAgreementStatus: 'Inactive',
          senderName: transferAgreementDTO.senderName,
          receiverName: receiverName,
        };
        this.addTransferAgreement(transferAgreement);
      },
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.creationOfTransferAgreementFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  addTransferAgreement(transferAgreement: ListedTransferAgreement) {
    const senderTin = transferAgreement.senderTin;
    const receiverTin = transferAgreement.receiverTin;
    const self = this.user()?.profile.org_cvr;

    const senderOrReceiverIsSelf = senderTin === self || receiverTin === self;

    if (senderOrReceiverIsSelf) {
      this.setTransferAgreements(false, false, [
        ...this.transferAgreements().data,
        transferAgreement,
      ]);
    }

    const hasPOAOverSenderOrReceiver =
      this.actorService.HasPOAOverCompany(senderTin) ||
      this.actorService.HasPOAOverCompany(receiverTin);

    if (hasPOAOverSenderOrReceiver) {
      this.setTransferAgreementsFromPOA(false, false, [
        ...this.transferAgreementsFromPOA().data,
        transferAgreement,
      ]);
    }
  }

  updateTransferAgreementEndDate(transferId: string, newEndDate: number | null) {
    this.updateTransferAgreement(transferId, newEndDate).subscribe({
      next: (transferAgreement) => {
        const ownTin = this.user()?.profile.org_cvr;
        const senderOrReceiverIsSelf =
          transferAgreement.senderTin === ownTin || transferAgreement.receiverTin === ownTin;

        if (senderOrReceiverIsSelf) {
          this.setTransferAgreements(false, false, [
            ...this.transferAgreements().data.filter(
              (transfer) => transfer.id !== transferAgreement.id
            ),
            transferAgreement,
          ]);
        }

        this.setTransferAgreementsFromPOA(false, false, [
          ...this.transferAgreements().data.filter(
            (transfer) => transfer.id !== transferAgreement.id
          ),
          transferAgreement,
        ]);
      },
    });
  }

  removeTransferAgreementProposal(transferAgreementProposalId: string) {
    this.deleteTransferAgreementProposal(transferAgreementProposalId).subscribe({
      next: () => {
        this.setTransferAgreements(
          false,
          false,
          this.transferAgreements().data.filter(
            (transferAgreementFromList) =>
              transferAgreementFromList.id !== transferAgreementProposalId
          )
        );
        this.setTransferAgreementsFromPOA(
          false,
          false,
          this.transferAgreementsFromPOA().data.filter(
            (transferAgreementFromList) =>
              transferAgreementFromList.id !== transferAgreementProposalId
          )
        );
      },
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(
            this.translations.transfers.removalOfTransferAgreementProposalFailed
          ),
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  // HTTP Requests

  getTransferAgreements() {
    return this.http
      .get<ListedTransferAgreementResponse>(
        `${this.#apiBase}/transfer/transfer-agreements/overview`
      )
      .pipe(
        map((x) => x.result),
        switchMap((transfers) => {
          const receiverTins = Array.from(
            new Set(
              transfers
                .filter(
                  (transfer) =>
                    transfer.receiverTin &&
                    transfer.receiverTin !== '' &&
                    transfer.receiverTin !== this.user()?.profile.org_cvr
                )
                .map((transfer) => transfer.receiverTin)
            )
          );

          return this.getCompanyNames(receiverTins).pipe(
            map((companyNames) => {
              return transfers.map((transfer) => ({
                ...transfer,
                ...this.setSender(transfer),
                receiverName: this.getReceiverName(transfer, companyNames),
                startDate: transfer.startDate,
                endDate: transfer.endDate ? transfer.endDate : null,
              }));
            })
          );
        })
      );
  }

  getTransferAgreementsFromPOA() {
    return this.http
      .get<ListedTransferAgreementResponse>(
        `${this.#apiBase}/transfer/transfer-agreements/overview/consent`
      )
      .pipe(
        map((x) => x.result),
        switchMap((transfers) => {
          const receiverTins = Array.from(
            new Set(
              transfers
                .filter(
                  (transfer) =>
                    transfer.receiverTin &&
                    transfer.receiverTin !== '' &&
                    transfer.receiverTin !== this.user()?.profile.org_cvr
                )
                .map((transfer) => transfer.receiverTin)
            )
          );

          return this.getCompanyNames(receiverTins).pipe(
            map((companyNames) => {
              return transfers.map((transfer) => ({
                ...transfer,
                ...this.setSender(transfer),
                receiverName: this.getReceiverName(transfer, companyNames),
                startDate: transfer.startDate,
                endDate: transfer.endDate ? transfer.endDate : null,
              }));
            })
          );
        })
      );
  }

  getCompanyNames(cvrNumbers: string[]): Observable<Map<string, string>> {
    return this.http
      .post<{ result: { companyCvr: string; companyName: string }[] }>(
        `${this.#apiBase}/transfer/cvr`,
        {
          cvrNumbers,
        }
      )
      .pipe(
        map((response) => response.result),
        map((companysData) => {
          return new Map(companysData.map((company) => [company.companyCvr, company.companyName]));
        })
      );
  }

  createTransferAgreementProposal(transfer: TransferAgreementProposalRequest) {
    return this.http.post<TransferAgreementProposalResponse>(
      `${this.#apiBase}/transfer/transfer-agreement-proposals/create`,
      {
        senderOrganizationId: transfer.senderOrganizationId,
        receiverTin: transfer.receiverTin === '' ? null : transfer.receiverTin,
        startDate: getUnixTime(transfer.startDate),
        endDate: transfer.endDate ? getUnixTime(transfer.endDate) : null,
      }
    );
  }

  createTransferAgreementFromProposal(proposalId: string) {
    return this.http.post<TransferAgreementProposal>(
      `${this.#apiBase}/transfer/transfer-agreements`,
      {
        transferAgreementProposalId: proposalId,
      }
    );
  }

  createTransferAgreement(
    transferAgreement: TransferAgreementRequest
  ): Observable<TransferAgreementDTO> {
    return this.http.post<TransferAgreementDTO>(
      `${this.#apiBase}/transfer/transfer-agreements/create`,
      {
        ...transferAgreement,
        startDate: getUnixTime(transferAgreement.startDate),
        endDate: transferAgreement.endDate ? getUnixTime(transferAgreement.endDate) : null,
      }
    );
  }

  getTransferAgreementProposal(proposalId: string) {
    return this.http
      .get<TransferAgreementProposal>(
        `${this.#apiBase}/transfer/transfer-agreement-proposals/${proposalId}`
      )
      .pipe(
        map((proposal) => ({
          ...proposal,
          startDate: proposal.startDate * 1000,
          endDate: proposal.endDate * 1000,
        }))
      );
  }

  deleteTransferAgreementProposal(proposalId: string) {
    return this.http.delete(`${this.#apiBase}/transfer/transfer-agreement-proposals/${proposalId}`);
  }

  updateTransferAgreement(transferId: string, endDate: number | null) {
    return this.http
      .put<ListedTransferAgreement>(`${this.#apiBase}/transfer/transfer-agreements/${transferId}`, {
        endDate: endDate ? getUnixTime(endDate) : null,
      })
      .pipe(
        map((transfer) => ({
          ...transfer,
          startDate: transfer.startDate * 1000,
          endDate: transfer.endDate ? transfer.endDate * 1000 : null,
        }))
      );
  }

  private getReceiverName(transfer: ListedTransferAgreement, companyNamesMap: Map<string, string>) {
    if (!transfer.receiverTin) return null;
    if (transfer.receiverTin === this.user()?.profile.org_cvr) return this.user()?.profile.name;
    return companyNamesMap.get(transfer.receiverTin) ?? null;
  }

  private setSender(transfer: ListedTransferAgreement) {
    return {
      ...transfer,
      senderName:
        transfer.senderName === '' ? this.#authService.user()?.profile.name : transfer.senderName,
      senderTin:
        transfer.senderTin === ''
          ? (this.#authService.user()?.profile.org_cvr ?? '')
          : transfer.senderTin,
    };
  }
}
