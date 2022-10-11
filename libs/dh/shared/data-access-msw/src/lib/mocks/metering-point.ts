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
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { rest } from 'msw';

export function meteringPointMocks(apiBase: string) {
  return [getByGsrn(apiBase)];
}

function getByGsrn(apiBase: string) {
  return rest.get(`${apiBase}/v1/MeteringPoint/GetByGsrn`, (req, res, ctx) => {
    const gsrnNumber = req.url.searchParams.get('gsrnNumber');
    if (gsrnNumber === '000000000000000000') {
      return res(ctx.status(404));
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          ...getByGsrnResponse,
          gsrnNumber,
        })
      );
    }
  });
}

const getByGsrnResponse: MeteringPointCimDto = {
  meteringPointId: '10e01f8d-be5f-4253-80a2-37082baa950b',
  gsrnNumber: '573876630161457173',
  streetName: 'Vestergade!!',
  postalCode: '5500',
  cityName: 'Middelfart',
  countryCode: 'DK',
  connectionState: 'D03',
  meteringMethod: 'D02',
  readingOccurrence: 'PT1H',
  meteringPointType: 'E17',
  ratedCapacity: 32,
  ratedCurrent: 230,
  gridAreaName: 'Volt U-001',
  gridAreaCode: '115',
  linkedExtendedMasterdata: '575774240560385464',
  locationDescription: 'String',
  productId: 'EnergyActive',
  unit: 'KWH',
  effectiveDate: '2021-09-25T22:00:00Z',
  meterId: '',
  streetCode: '0405',
  citySubDivisionName: 'Strib',
  floorIdentification: '1',
  suiteNumber: '12',
  buildingNumber: '10',
  municipalityCode: 625,
  isActualAddress: true,
  darReference: '0a3f50b9-b942-32b8-e044-0003ba298018',
  capacity: 6000,
  assetType: 'D12',
  settlementMethod: 'E02',
  inAreaCode: null,
  outAreaCode: null,
  netSettlementGroup: 'Six',
  supplyStart: '2021-09-25T22:00:00Z',
  connectionType: 'D02',
  disconnectionType: 'D01',
  productionObligation: null,
  childMeteringPoints: [],
  parentMeteringPoint: undefined,
  powerPlantGsrnNumber: '575774240560385464',
};
