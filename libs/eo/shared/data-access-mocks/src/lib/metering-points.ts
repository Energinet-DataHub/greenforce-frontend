import { rest } from 'msw';

export function meteringPointsMocks(apiBase: string) {
  return [getMeteringPoints(apiBase)];
}

function getMeteringPoints(apiBase: string) {
  return rest.get(`${apiBase}/meteringpoints`, (req, res, ctx) => {
    const city = 'Dummy city';

    const data = {
      meteringPoints: [
        {
          gsrn: '571313130083535430',
          gridArea: 'DK1',
          type: 'production',
          subMeterType: 'Virtual',
          assetType: 'Wind',
          address: {
            address1: 'Dummy street 1',
            address2: '',
            city,
            postalCode: '9999',
            country: 'DK',
          },
        },
        {
          gsrn: '571313171355435420',
          gridArea: 'DK1',
          type: 'consumption',
          subMeterType: 'Virtual',
          assetType: 'Solar',
          address: {
            address1: 'Dummy street 2',
            address2: '1 11A',
            city,
            postalCode: '9999',
            country: 'DK',
          },
        },
        {
          gsrn: '571313130083531004',
          gridArea: 'DK1',
          type: 'production',
          subMeterType: 'Virtual',
          assetType: 'Other',
          address: {
            address1: 'Dummy street 3',
            address2: '',
            city,
            postalCode: '9999',
            country: 'DK',
          },
        },
      ],
    };

    return res(ctx.status(200), ctx.json(data));
  });
}
