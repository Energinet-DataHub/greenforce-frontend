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
import { Inject, inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { getUnixTime } from 'date-fns';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';

export type TransferAgreementQuantityType =
  | 'TransferAllCertificates'
  | 'TransferCertificatesBasedOnConsumption';

export interface EoTransfer {
  startDate: number;
  senderName?: string;
  endDate: number | null;
  receiverName?: string | null;
  receiverTin: string;
  transferAgreementStatus: 'Active' | 'Inactive' | 'Proposal' | 'ProposalExpired';
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

export interface EoTransferAgreementRequest {
  receiverOrganizationId: string;
  senderOrganizationId: string;
  startDate: number;
  endDate?: number;
  type: TransferAgreementQuantityType;
}

export interface EoTransferAgreementDTO {
  id: string;
  startDate: number;
  endDate?: number;
  senderName: string;
  senderTin: string;
  receiverTin: string;
  type: TransferAgreementQuantityType;
}

@Injectable({
  providedIn: 'root',
})
export class EoTransfersService {
  #apiBase: string;
  #authService = inject(EoAuthService);

  private user = this.#authService.user;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  getTransfers() {
    return this.http
      .get<EoListedTransferResponse>(`${this.#apiBase}/transfer/transfer-agreements/overview`)
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

  getTransfersFromPOA() {
    return this.http
      .get<EoListedTransferResponse>(
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

  private getReceiverName(transfer: EoListedTransfer, companyNamesMap: Map<string, string>) {
    if (!transfer.receiverTin) return null;
    if (transfer.receiverTin === this.user()?.profile.org_cvr) return this.user()?.profile.name;
    return companyNamesMap.get(transfer.receiverTin) ?? null;
  }

  private setSender(transfer: EoListedTransfer) {
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

  createAgreementProposal(transfer: EoTransfer) {
    return this.http
      .post<EoTransferAgreementProposal>(`${this.#apiBase}/transfer/transfer-agreement-proposals`, {
        receiverTin: transfer.receiverTin === '' ? null : transfer.receiverTin,
        startDate: getUnixTime(transfer.startDate),
        endDate: transfer.endDate ? getUnixTime(transfer.endDate) : null,
      })
      .pipe(map((response) => response.id));
  }

  createTransferAgreementFromProposal(proposalId: string) {
    return this.http.post<EoTransferAgreementProposal>(
      `${this.#apiBase}/transfer/transfer-agreements`,
      {
        transferAgreementProposalId: proposalId,
      }
    );
  }

  createTransferAgreement(
    transferAgreement: EoTransferAgreementRequest
  ): Observable<EoTransferAgreementDTO> {
    return this.http.post<EoTransferAgreementDTO>(
      `${this.#apiBase}/transfer/transfer-agreements/create`,
      {
        ...transferAgreement,
        startDate: getUnixTime(transferAgreement.startDate),
        endDate: transferAgreement.endDate ? getUnixTime(transferAgreement.endDate) : null,
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

  deleteAgreementProposal(proposalId: string) {
    return this.http.delete(`${this.#apiBase}/transfer/transfer-agreement-proposals/${proposalId}`);
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
}
