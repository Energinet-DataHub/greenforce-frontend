/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MarketParticipantActorStatus } from '@energinet-datahub/dh/shared/domain';
import { WattDropdownOption } from '@energinet-datahub/watt/dropdown';

export const getValidStatusTransitionOptions = (
  status: MarketParticipantActorStatus,
  statuses: WattDropdownOption[]
) => {
  switch (status) {
    case MarketParticipantActorStatus.New:
      return statuses.filter((x) =>
        [
          MarketParticipantActorStatus.New.toLowerCase(),
          MarketParticipantActorStatus.Active.toLowerCase(),
          MarketParticipantActorStatus.Inactive.toLowerCase(),
          MarketParticipantActorStatus.Passive.toLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case MarketParticipantActorStatus.Active:
      return statuses.filter((x) =>
        [
          MarketParticipantActorStatus.Active.toLowerCase(),
          MarketParticipantActorStatus.Inactive.toLowerCase(),
          MarketParticipantActorStatus.Passive.toLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case MarketParticipantActorStatus.Passive:
      return statuses.filter((x) =>
        [
          MarketParticipantActorStatus.Inactive.toLocaleLowerCase(),
          MarketParticipantActorStatus.Passive.toLocaleLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case MarketParticipantActorStatus.Inactive:
      return statuses.filter((x) =>
        [MarketParticipantActorStatus.Inactive.toLocaleLowerCase()].includes(x.value.toLowerCase())
      );
    default:
      return [];
  }
};
