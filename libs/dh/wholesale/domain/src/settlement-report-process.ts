
import { BatchDto, DateRange, ProcessType } from "@energinet-datahub/dh/shared/domain";

export type settlementReportsProcess = BatchDto & { processType: ProcessType, gridAreaCode: string; gridAreaName: string };

export interface SettlementReportsProcessFilters {
  processType: string | null;
  gridArea?: string | null;
  period?: DateRange | null;
  executionTime?: DateRange | null;
}
