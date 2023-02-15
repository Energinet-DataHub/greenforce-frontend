import { ProcessType } from "@energinet-datahub/dh/shared/domain";

import { batch } from "./batch";

export type settlementReportsProcess = batch & { processType: ProcessType, gridAreaCode: string; gridAreaName: string };
