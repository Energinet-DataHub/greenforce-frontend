import {
  GetCommercialRelationsDataSource,
  GetMeteringPointDataSource,
} from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
export type MeteringPointPeriod = ExtractNodeType<GetMeteringPointDataSource>;
export type CommercialRelation = ExtractNodeType<GetCommercialRelationsDataSource>;
