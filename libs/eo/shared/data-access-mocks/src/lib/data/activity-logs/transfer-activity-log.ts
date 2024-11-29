import { generateCombinations } from './mock-generator';

export const transferActivityLogResponse = {
  activityLogEntries: generateCombinations(['TransferAgreement', 'TransferAgreementProposal']),
  hasMore: false,
};
