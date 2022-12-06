import { BatchDto } from '@energinet-datahub/dh/shared/domain';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { WattBadgeType } from '@energinet-datahub/watt/badge';

export type batch = BatchDto & { statusType: WattBadgeType };
