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

import organizationsData from './data/marketParticipantOrganizations.json';
import gridAreaData from './data/marketParticipantGridArea.json';
import gridAreaOverviewData from './data/marketParticipantGridAreaOverview.json';
import actorData from './data/marketPaticipantActor.json';
import actorContactsData from './data/marketPaticipantActorContacts.json';
import organizationData from './data/marketPaticipantOrganization.json';

const port = 5001;

export const marketParticipantMocks = [
  getOrganizations(),
  getMarketParticipantGridArea(),
  getMarketParticipantGridAreaOverview(),
  getActor(),
  getActorContact(),
  getOrganization(),
];

function getOrganizations() {
  return rest.get(
    `https://localhost:${port}/v1/MarketParticipant/organization`,
    (req, res, ctx) => {
      return res(ctx.json(organizationsData));
    }
  );
}

function getOrganization() {
  return rest.get(
    `https://localhost:${port}/v1/MarketParticipant/organization/:organizationId`,
    (req, res, ctx) => {
      const { organizationId } = req.params;
      const organizationDataWithUpdatedId = {
        ...organizationData,
        organizationId,
      };
      return res(ctx.json(organizationDataWithUpdatedId));
    }
  );
}

function getMarketParticipantGridArea() {
  return rest.get(
    `https://localhost:${port}/v1/MarketParticipantGridArea`,
    (req, res, ctx) => {
      return res(ctx.json(gridAreaData));
    }
  );
}

function getMarketParticipantGridAreaOverview() {
  return rest.get(
    `https://localhost:${port}/v1/MarketParticipantGridAreaOverview`,
    (req, res, ctx) => {
      return res(ctx.json(gridAreaOverviewData));
    }
  );
}

function getActor() {
  return rest.get(
    `https://localhost:${port}/v1/MarketParticipant/organization/:organizationId/actor/:actorId`,
    (req, res, ctx) => {
      const { actorId } = req.params;
      const actorDataWithUpdatedId = {
        ...actorData,
        actorId,
      };
      return res(ctx.json(actorDataWithUpdatedId));
    }
  );
}

function getActorContact() {
  return rest.get(
    `https://localhost:${port}/v1/MarketParticipant/organization/:organizationId/actor/:actorId/contact`,
    (req, res, ctx) => {
      return res(ctx.json(actorContactsData));
    }
  );
}
