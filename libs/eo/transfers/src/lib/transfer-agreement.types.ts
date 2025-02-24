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
