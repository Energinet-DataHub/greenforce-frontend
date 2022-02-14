import { rest } from 'msw';

export const handlers = [
  rest.get(
    'https://localhost:5001/v1/MeteringPoint/GetByGsrn',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          ...getByGsrn,
          gsrnNumber: req.url.searchParams.get('gsrnNumber'),
        })
      );
    }
  ),
  rest.get(
    'https://localhost:5001/v1/ChargeLinks?meteringPointId=575391908025497398',
    (req, res, ctx) => {
      return res(ctx.status(404));
    }
  ),
];

const getByGsrn = {
  meteringPointId: '10e01f8d-be5f-4253-80a2-37082baa950b',
  gsrnNumber: '573876630161457173',
  streetName: 'Vestergade',
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
  parentMeteringPoint: null,
  powerPlantGsrnNumber: '575774240560385464',
};
