import { rest } from 'msw';

export function transferMocks(apiBase: string) {
  return [
    getTransferAgreements(apiBase),
    getTransferAutomationStatus(apiBase),
  ];
}

function getTransferAgreements(apiBase: string) {
  return rest.get(`${apiBase}/transfer-agreements`, (req, res, ctx) => {
    const senderName = 'Producent A/S';
    const data = {
      result: [
        {
          id: '4ed4ed4c-930b-4ef6-99c2-b5300c024aff1',
          startDate: 1697796000,
          endDate: 1698400800,
          senderName,
          senderTin: '11223344',
          receiverTin: '11111111',
        },
        {
          id: '4ed4ed4c-930b-4ef6-99c2-b5300c024aff2',
          startDate: 1697796000,
          endDate: 1698400800,
          senderName,
          senderTin: '11223344',
          receiverTin: '22222222',
        },
        {
          id: '4ed4ed4c-930b-4ef6-99c2-b5300c024aff3',
          startDate: 1697796000,
          endDate: 1698400800,
          senderName,
          senderTin: '11223344',
          receiverTin: '33333333',
        },
      ],
    };

    return res(ctx.status(200), ctx.json(data));
  });
}

function getTransferAutomationStatus(apiBase: string) {
  return rest.get(`${apiBase}/transfer-automation/status`, (req, res, ctx) => {
    const data = {"healthy": false};

    return res(ctx.status(200), ctx.json(data));
  });
}
