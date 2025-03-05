import { GetPaginatedOrganizationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';

export type Organization = ExtractNodeType<GetPaginatedOrganizationsDataSource>;
