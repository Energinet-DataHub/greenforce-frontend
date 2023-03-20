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
import { MarketParticipantOrganizationStatus } from '@energinet-datahub/dh/shared/domain';
import { WattDropdownOption } from '@energinet-datahub/watt/dropdown';

export const getValidOrganizationStatusTransitionOptions = (
  status: MarketParticipantOrganizationStatus,
  statuses: WattDropdownOption[]
) => {
  switch (status) {
    case MarketParticipantOrganizationStatus.New:
      return statuses.filter((x) =>
        [
          MarketParticipantOrganizationStatus.New.toLowerCase(),
          MarketParticipantOrganizationStatus.Active.toLowerCase(),
          MarketParticipantOrganizationStatus.Blocked.toLowerCase(),
          MarketParticipantOrganizationStatus.Deleted.toLocaleLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case MarketParticipantOrganizationStatus.Active:
    case MarketParticipantOrganizationStatus.Blocked:
      return statuses.filter((x) =>
        [
          MarketParticipantOrganizationStatus.Active.toLowerCase(),
          MarketParticipantOrganizationStatus.Blocked.toLocaleLowerCase(),
          MarketParticipantOrganizationStatus.Deleted.toLocaleLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case MarketParticipantOrganizationStatus.Deleted:
      return statuses.filter((x) =>
        [MarketParticipantOrganizationStatus.Deleted.toLocaleLowerCase()].includes(
          x.value.toLowerCase()
        )
      );
    default:
      return [];
  }
};
