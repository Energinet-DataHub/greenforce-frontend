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
import organizationsMocks from './organizations.json';
import contactMock from './contact.json';
import actorMock from './actor.json';
import gridAreaMock from './grid-area.json';

export const marketParticipantMocks = [
  rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization',
    (req, res, ctx) => {
      //return res(ctx.status(200));
      return res(ctx.status(200), ctx.json(organizationsMocks));
    }
  ),
  rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization/:organizationId',
    (req, res, ctx) => {
      const { organizationId } = req.params;
      //      return res(ctx.status(500), ctx.json({error: {message: 'Internal server error'}}));

      return res(
        ctx.status(200),
        ctx.json(
          organizationsMocks.find(
            (organization) => organization.organizationId === organizationId
          )
        )
      );
    }
  ),
  rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization/:organizationId/actor/:actorId/contact',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(contactMock));
      //return res(ctx.status(500), ctx.json({error: {message: 'Internal server error'}}));
    }
  ),
  rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization/:organizationId/contact',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(contactMock));
      //return res(ctx.status(500), ctx.json({error: {message: 'Internal server error'}}));
    }
  ),
  rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization/:organizationId/actor/:actorId',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(actorMock));
      return res(
        ctx.status(500),
        ctx.json({ error: { message: 'Internal server error' } })
      );
    }
  ),
  rest.put(
    'https://localhost:5001/v1/MarketParticipant/organization/:organizationId/actor/:actorId',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(actorMock));
      //return res(ctx.status(500), ctx.json({error: {message: 'Internal server error'}}));
    }
  ),
  rest.get(
    'https://localhost:5001/v1/MarketParticipantGridArea',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(gridAreaMock));
      //return res(ctx.status(500), ctx.json({error: {message: 'Internal server error'}}));
    }
  ),
];
