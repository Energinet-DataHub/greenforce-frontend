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
import { OrganizationStatus } from '@energinet-datahub/dh/shared/domain';
import { WattDropdownOption } from '@energinet-datahub/watt/dropdown';

export const getValidOrganizationStatusTransitionOptions = (
  status: OrganizationStatus,
  statuses: WattDropdownOption[]
) => {
  switch (status) {
    case OrganizationStatus.New:
      return statuses.filter((x) =>
        [
          OrganizationStatus.New.toLowerCase(),
          OrganizationStatus.Active.toLowerCase(),
          OrganizationStatus.Blocked.toLowerCase(),
          OrganizationStatus.Deleted.toLocaleLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case OrganizationStatus.Active:
    case OrganizationStatus.Blocked:
      return statuses.filter((x) =>
        [
          OrganizationStatus.Active.toLowerCase(),
          OrganizationStatus.Blocked.toLocaleLowerCase(),
          OrganizationStatus.Deleted.toLocaleLowerCase(),
        ].includes(x.value.toLowerCase())
      );
    case OrganizationStatus.Deleted:
      return statuses.filter((x) =>
        [OrganizationStatus.Deleted.toLocaleLowerCase()].includes(
          x.value.toLowerCase()
        )
      );
    default:
      return [];
  }
};
