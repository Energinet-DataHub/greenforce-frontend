import { DhProcess } from '@energinet-datahub/dh/metering-point/domain';

export interface DhProcessesTableRow {
  data: DhProcess;
  expanded: boolean;
  height: number;
}
