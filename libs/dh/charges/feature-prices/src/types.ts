import { GetChargeByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetChargesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type Charges = ExtractNodeType<GetChargesDataSource>;
export type Charge = ResultOf<typeof GetChargeByIdDocument>['chargeById'];
