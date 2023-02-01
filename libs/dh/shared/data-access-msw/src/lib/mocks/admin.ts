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

import marketParticipantUserOverviewData from './data/marketParticipantUserOverview.json';
import marketParticipantActorQuerySelectionActors from './data/marketParticipantActorQuerySelectionActors.json';
import marketParticipantUserRoleGetAll from './data/marketParticipantUserRoleGetAll.json';
import marketParticipantUserGetUserAuditLogs from './data/marketParticipantUserGetUserAuditLogs.json';
import marketParticipantUserRoleGetUserRoleWithPermissions from './data/marketParticipantUserRoleGetUserRoleWithPermissions.json';
import marketParticipantUserRoleGetUserRoleAuditLogs from './data/marketParticipantUserRoleGetUserRoleAuditLogs.json';

export function adminMocks(apiBase: string) {
  return [
    getMarketParticipantUserOverview(apiBase),
    getMarketParticipantActorQuerySelectionActors(apiBase),
    getMarketParticipantUserRoleGetAll(apiBase),
    getMarketParticipantUserGetUserAuditLogs(apiBase),
    getMarketParticipantUserRoleGetUserRoleWithPermissions(apiBase),
    getMarketParticipantUserRoleGetUserRoleAuditLogs(apiBase),
    putMarketParticipantUserRoleUpdate(apiBase),
  ];
}

function getMarketParticipantUserOverview(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserOverview/GetUserOverview`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantUserOverviewData));
    }
  );
}

function getMarketParticipantActorQuerySelectionActors(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantActorQuery/GetSelectionActors`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantActorQuerySelectionActors));
    }
  );
}

function getMarketParticipantUserRoleGetAll(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserRole/GetAll`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantUserRoleGetAll));
    }
  );
}

function getMarketParticipantUserGetUserAuditLogs(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUser/GetUserAuditLogs`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantUserGetUserAuditLogs));
    }
  );
}

function getMarketParticipantUserRoleGetUserRoleWithPermissions(
  apiBase: string
) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserRole/GetUserRoleWithPermissions`,
    (req, res, ctx) => {
      const userRoleId = req.url.searchParams.get('userRoleId');

      const userRole = marketParticipantUserRoleGetUserRoleWithPermissions.find(
        (userRole) => userRole.id === userRoleId
      );

      return res(ctx.json(userRole));
    }
  );
}

function getMarketParticipantUserRoleGetUserRoleAuditLogs(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/MarketParticipantUserRole/GetUserRoleAuditLogs`,
    (req, res, ctx) => {
      return res(ctx.json(marketParticipantUserRoleGetUserRoleAuditLogs));
    }
  );
}

function putMarketParticipantUserRoleUpdate(apiBase: string) {
  return rest.put(
    `${apiBase}/v1/MarketParticipantUserRole/Update`,
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  );
}
