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
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs';

import { EttApiEnvironment, EttApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { getUnixTime } from 'date-fns';
import { EttAuthStore } from '@energinet-datahub/ett/shared/services';
import { toSignal } from '@angular/core/rxjs-interop';

export interface EttTransfer {
  startDate: number;
  senderName?: string;
  endDate: number | null;
  receiverName?: string | null;
  receiverTin: string;
  transferAgreementStatus: 'Active' | 'Inactive' | 'Proposal' | 'ProposalExpired';
}

export interface EttListedTransfer extends EttTransfer {
  id: string;
  senderTin: string;
}

export interface EttListedTransferResponse {
  result: EttListedTransfer[];
}

export interface EttTransferAgreementsHistory {
  transferAgreement: EttTransfer;
  createdAt: number;
  action: 'Created' | 'Updated' | 'Deleted';
  actorName: string;
}

export interface EttTransferAgreementsHistoryResponse {
  totalCount: number;
  items: EttTransferAgreementsHistory[];
}

export interface EttTransferAgreementProposal {
  id: string;
  senderCompanyName: string;
  receiverTin: string;
  startDate: number;
  endDate: number;
}

@Injectable({
  providedIn: 'root',
})
export class EttTransfersService {
  #apiBase: string;
  #authStore = inject(EttAuthStore);

  private user = toSignal(this.#authStore.getUserInfo$);

  constructor(
    private http: HttpClient,
    @Inject(EttApiEnvironmentToken) apiEnvironment: EttApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  getTransfers() {
    return this.http
      .get<EttListedTransferResponse>(`${this.#apiBase}/transfer/transfer-agreements/overview`)
      .pipe(
        map((x) => x.result),
        switchMap((transfers) => {
          const receiverTins = transfers
            .filter((transfer) => transfer.receiverTin && transfer.receiverTin !== '')
            .map((transfer) => transfer.receiverTin);

          return this.getCompanyNames(receiverTins).pipe(
            map((companyNames) => {
              return transfers.map((transfer, index) => ({
                ...transfer,
                ...this.setSender(transfer),
                receiverName: companyNames[index],
                startDate: transfer.startDate,
                endDate: transfer.endDate ? transfer.endDate : null,
              }));
            })
          );
        })
      );
  }

  private setSender(transfer: EttListedTransfer) {
    return {
      ...transfer,
      senderName: transfer.senderName === '' ? this.user()?.name : transfer.senderName,
      senderTin: transfer.senderTin === '' ? this.user()?.tin ?? '' : transfer.senderTin,
    };
  }

  getCompanyNames(cvrNumbers: string[]) {
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
          return cvrNumbers.map((cvrNumber) => {
            return (
              companysData.find((company) => company.companyCvr === cvrNumber)?.companyName ?? null
            );
          });
        })
      );
  }

  createAgreementProposal(transfer: EttTransfer) {
    return this.http
      .post<EttTransferAgreementProposal>(`${this.#apiBase}/transfer/transfer-agreement-proposals`, {
        receiverTin: transfer.receiverTin === '' ? null : transfer.receiverTin,
        startDate: getUnixTime(transfer.startDate),
        endDate: transfer.endDate ? getUnixTime(transfer.endDate) : null,
      })
      .pipe(map((response) => response.id));
  }

  createTransferAgreement(proposalId: string) {
    return this.http.post<EttTransferAgreementProposal>(
      `${this.#apiBase}/transfer/transfer-agreements`,
      {
        transferAgreementProposalId: proposalId,
      }
    );
  }

  getAgreementProposal(proposalId: string) {
    return this.http
      .get<EttTransferAgreementProposal>(
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

  deleteAgreementProposal(proposalId: string) {
    return this.http.delete(`${this.#apiBase}/transfer/transfer-agreement-proposals/${proposalId}`);
  }

  updateAgreement(transferId: string, endDate: number | null) {
    return this.http
      .put<EttListedTransfer>(`${this.#apiBase}/transfer/transfer-agreements/${transferId}`, {
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
}
