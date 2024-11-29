import { generateCombinations } from './mock-generator';

export const certificatesActivityLogResponse = {
  activityLogEntries: generateCombinations(['MeteringPoint']),
  hasMore: false,
};
