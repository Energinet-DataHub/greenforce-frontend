import type {
  GridAreaStatus,
  GridAreaType,
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { WattRange } from '@energinet-datahub/watt/date';

export type DhGridAreaRow = {
  id: string;
  code: string;
  actor: string;
  organization: string;
  status: GridAreaStatus;
  type: GridAreaType;
  priceArea: PriceAreaCode;
  period: WattRange<Date>;
};
