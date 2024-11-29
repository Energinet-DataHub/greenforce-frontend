import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';

export type eoDashboardPeriod = {
  timeAggregate: EoTimeAggregate;
  start: number;
  end: number;
} | null;
