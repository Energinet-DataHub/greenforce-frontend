//#region License
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
//#endregion
import { RedirectFunction } from '@angular/router';
import { ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { GetChargeResolutionDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

export const seriesRedirect: RedirectFunction = async (snapshot) => {
  const id = snapshot.params.id;
  const charge = await query(GetChargeResolutionDocument, { variables: { id } }).result();

  switch (charge.data.chargeById?.resolution) {
    case 'QuarterHourly':
    case 'Hourly':
      return `${getPath<ChargesSubPaths>('prices')}/day`;
    case 'Daily':
      return `${getPath<ChargesSubPaths>('prices')}/month`;
    case 'Monthly':
      return `${getPath<ChargesSubPaths>('prices')}/year`;
    case 'Unknown':
    default:
      return getPath<ChargesSubPaths>('information');
  }
};
