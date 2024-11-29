import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

export interface ActorsFilters {
  actorStatus: ActorStatus[] | null;
  marketRoles: EicFunction[] | null;
}

export type AllFiltersCombined = ActorsFilters & { searchInput: string };
