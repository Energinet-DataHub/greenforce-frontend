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
import {
  ListedTransferAgreement,
  ListedTransferAgreementResponse,
  TransferAgreementDTO,
  TransferAgreementProposal,
  TransferAgreementProposalRequest,
  TransferAgreementProposalResponse,
  TransferAgreementRequest,
} from './eo-transfer-agreement.types';

@Injectable({
  providedIn: 'root',
})
export class EoTransferAgreementsService {
  #apiBase: string;
  #authService = inject(EoAuthService);

  private user = this.#authService.user;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

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
