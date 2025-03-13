import { GetBalanceResponsibleMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';

export type BalanceResponsibleMessage = ExtractNodeType<GetBalanceResponsibleMessagesDataSource>;
