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
import { Inject, Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { getUnixTime } from 'date-fns';

export interface EoTransfer {
  startDate: number;
  senderName?: string;
  endDate: number | null;
  receiverName?: string | null;
  receiverTin: string;
}

export interface EoListedTransfer extends EoTransfer {
  id: string;
  senderTin: string;
}

export interface EoListedTransferResponse {
  result: EoListedTransfer[];
}

export interface EoTransferAgreementsHistory {
  transferAgreement: EoTransfer;
  createdAt: number;
  action: 'Created' | 'Updated' | 'Deleted';
  actorName: string;
}

export interface EoTransferAgreementsHistoryResponse {
  totalCount: number;
  items: EoTransferAgreementsHistory[];
}

export interface EoTransferAgreementProposal {
  id: string;
  senderCompanyName: string;
  receiverTin: string;
  startDate: number;
  endDate: number;
}

@Injectable({
  providedIn: 'root',
})
export class EoTransfersService {
  #apiBase: string;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  getTransfers() {
    return this.http
      .get<EoListedTransferResponse>(`${this.#apiBase}/transfer/transfer-agreements`)
      .pipe(
        map((x) => x.result),
        switchMap((transfers) => {
          return this.getCompanyNames(transfers.map((transfer) => transfer.receiverTin)).pipe(
            map((companyNames) => {
              return transfers.map((transfer, index) => ({
                ...transfer,
                senderName: transfer.senderName ?? '',
                senderTin: transfer.senderTin ?? '',
                receiverName: companyNames[index],
                startDate: transfer.startDate,
                endDate: transfer.endDate ? transfer.endDate : null,
              }));
            })
          );
        })
      );
  }

  getCompanyNames(cvrNumbers: string[]) {
    return this.http
      .post<{ result: { companyCvr: string; companyName: string }[] }>(`${this.#apiBase}/cvr`, {
        cvrNumbers,
      })
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

  createAgreementProposal(transfer: EoTransfer) {
    return this.http
      .post<EoTransferAgreementProposal>(`${this.#apiBase}/transfer/transfer-agreement-proposals`, {
        receiverTin: transfer.receiverTin === '' ? null : transfer.receiverTin,
        startDate: getUnixTime(transfer.startDate),
        endDate: transfer.endDate ? getUnixTime(transfer.endDate) : null,
      })
      .pipe(map((response) => response.id));
  }

  createTransferAgreement(proposalId: string) {
    return this.http.post<EoTransferAgreementProposal>(
      `${this.#apiBase}/transfer/transfer-agreements`,
      {
        transferAgreementProposalId: proposalId,
      }
    );
  }

  getAgreementProposal(proposalId: string) {
    return this.http
      .get<EoTransferAgreementProposal>(
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

  updateAgreement(transferId: string, endDate: number | null) {
    return this.http
      .put<EoListedTransfer>(`${this.#apiBase}/transfer/transfer-agreements/${transferId}`, {
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

  getHistory(transferAgreementId: string, limit = 10, offset = 0) {
    return this.http
      .get<EoTransferAgreementsHistoryResponse>(
        `${this.#apiBase}/transfer/transfer-agreements/${transferAgreementId}/history?limit=${limit}&offset=${offset}`
      )
      .pipe(
        map((response) => response.items),
        map((items) =>
          items.map((item) => ({
            ...item,
            createdAt: item.createdAt * 1000,
            transferAgreement: {
              ...item.transferAgreement,
              startDate: item.transferAgreement.startDate * 1000,
              endDate: item.transferAgreement.endDate
                ? item.transferAgreement.endDate * 1000
                : null,
            },
          }))
        )
      );
  }

  transferAutomationHasError(): Observable<boolean> {
    return this.http
      .get<{ healthy: boolean }>(`${this.#apiBase}/transfer-automation/status`)
      .pipe(map((response) => !response.healthy));
  }
}
