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
import { rest } from 'msw';

import marketParticipantUserRoleView from './data/marketParticipantUserRoleView.json';
import marketParticipantUserRolePermissions from './data/marketParticipantUserRolePermissions.json';

export function marketParticipantUserRoleMocks(apiBase: string) {
  return [GetUserRoleView(apiBase), Permissions(apiBase)];
}

function GetUserRoleView(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserRole/GetUserRoleView`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(marketParticipantUserRoleView));
    }
  );
}

function Permissions(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserRole/Permissions`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(marketParticipantUserRolePermissions)
      );
    }
  );
}
