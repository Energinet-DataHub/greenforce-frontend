import { MarketParticipantEicFunction } from '@energinet-datahub/dh/shared/domain';
import { ActorStatus } from '@energinet-datahub/dh/shared/domain/graphql';

export interface ActorsFilters {
  actorStatus: ActorStatus[] | null;
  marketRoles: MarketParticipantEicFunction[] | null;
}
