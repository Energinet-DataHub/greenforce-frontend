import { rest } from 'msw';

import organizationData from './data/marketParticipant.json';
import gridAreaData from './data/marketParticipantGridArea.json';
import gridAreaOverviewData from './data/marketParticipantGridAreaOverview.json';

export const marketParticipantMocks = [
  getOrganizations(),
  getMarketParticipantGridArea(),
  getMarketParticipantGridAreaOverview(),
];

function getOrganizations() {
  return rest.get(
    'https://localhost:5001/v1/MarketParticipant/organization',
    (req, res, ctx) => {
      return res(ctx.json(organizationData));
    }
  );
}

function getMarketParticipantGridArea() {
  return rest.get(
    'https://localhost:5001/v1/MarketParticipantGridArea',
    (req, res, ctx) => {
      return res(ctx.json(gridAreaData));
    }
  );
}

function getMarketParticipantGridAreaOverview() {
  return rest.get(
    'https://localhost:5001/v1/MarketParticipantGridAreaOverview',
    (req, res, ctx) => {
      return res(ctx.json(gridAreaOverviewData));
    }
  );
}
