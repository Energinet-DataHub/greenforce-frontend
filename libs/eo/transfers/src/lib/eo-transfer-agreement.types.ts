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
export type TransferAgreementQuantityType =
  | 'TransferAllCertificates'
  | 'TransferCertificatesBasedOnConsumption';

export interface TransferAgreement {
  startDate: number;
  senderName?: string;
  endDate: number | null;
  receiverName?: string | null;
  receiverTin: string;
  transferAgreementStatus: 'Active' | 'Inactive' | 'Proposal' | 'ProposalExpired';
}

export interface ListedTransferAgreement extends TransferAgreement {
  id: string;
  senderTin: string;
}

export interface ListedTransferAgreementResponse {
  result: ListedTransferAgreement[];
}

export interface TransferAgreementsHistory {
  transferAgreement: TransferAgreement;
  createdAt: number;
  action: 'Created' | 'Updated' | 'Deleted';
  actorName: string;
}

export interface TransferAgreementsHistoryResponse {
  totalCount: number;
  items: TransferAgreementsHistory[];
}

export interface TransferAgreementProposal {
  id: string;
  senderCompanyName: string;
  receiverTin: string;
  startDate: number;
  endDate: number;
}

export interface TransferAgreementProposalRequest {
  senderOrganizationId: string;
  startDate: number;
  endDate: number;
  receiverTin: string;
  type: TransferAgreementQuantityType;
}

export interface TransferAgreementProposalResponse {
  id: string;
  senderCompanyName: string;
  receiverTin: string;
  startDate: number;
  endDate: number;
  type: TransferAgreementQuantityType;
}

export interface TransferAgreementRequest {
  receiverOrganizationId: string;
  senderOrganizationId: string;
  startDate: number;
  endDate?: number;
  type: TransferAgreementQuantityType;
}

export interface TransferAgreementDTO {
  id: string;
  startDate: number;
  endDate?: number;
  senderName: string;
  senderTin: string;
  receiverTin: string;
  type: TransferAgreementQuantityType;
}

export interface ExistingTransferAgreement {
  startDate: number;
  endDate: number | null;
}
