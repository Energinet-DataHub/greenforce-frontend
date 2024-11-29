import { DhSettlementReport } from '@energinet-datahub/dh/shared/domain';

export type DhSettlementReportPartial = Pick<
  DhSettlementReport,
  'id' | 'period' | 'calculationType' | 'gridAreas' | 'settlementReportDownloadUrl'
>;
