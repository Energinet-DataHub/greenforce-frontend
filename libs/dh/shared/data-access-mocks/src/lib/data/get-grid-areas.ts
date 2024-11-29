import { GetGridAreasQuery, GridAreaType } from '@energinet-datahub/dh/shared/domain/graphql';

export const getGridAreas: GetGridAreasQuery = {
  __typename: 'Query',
  gridAreas: [
    {
      id: '4ee13230-3716-468f-96ee-01b15f054530',
      code: '001',
      name: 'Grid area 1',
      displayName: '001 • Grid area 1',
      validFrom: new Date(),
      validTo: null,
      __typename: 'GridAreaDto',
      includedInCalculation: true,
      type: GridAreaType.Distribution,
    },
    {
      id: '89801ec1-af12-46d9-b044-05a004a0d46c',
      code: '002',
      name: 'Grid area 2',
      displayName: '002 • Grid area 2',
      validFrom: new Date(),
      validTo: null,
      __typename: 'GridAreaDto',
      includedInCalculation: true,
      type: GridAreaType.Distribution,
    },
    {
      id: 'd45f9498-1954-4c7d-8e9c-0d4a2aba058b',
      code: '003',
      name: 'Grid area 3',
      displayName: '003 • Grid area 3',
      validFrom: new Date(),
      validTo: null,
      __typename: 'GridAreaDto',
      includedInCalculation: false,
      type: GridAreaType.Test,
    },
  ],
};
