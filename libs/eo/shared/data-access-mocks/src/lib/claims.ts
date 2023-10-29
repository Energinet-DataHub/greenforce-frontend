import { rest } from 'msw';

export function claimsMocks(apiBase: string) {
  return [
    getClaims(apiBase),
    postStartClaimProcess(apiBase),
    delteStopClaimProcess(apiBase),
  ];
}

const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

function postStartClaimProcess(apiBase: string) {
  return rest.post(`${apiBase}/claims/start-claim-process`, (req, res, ctx) => {
    const data = {
      "subjectId": id
    }

    return res(ctx.status(200), ctx.json(data));
  });
}

function delteStopClaimProcess(apiBase: string) {
  return rest.delete(`${apiBase}/claims/stop-claim-process`, (req, res, ctx) => {
    return res(ctx.status(204));
  });
}

function getClaims(apiBase: string) {
   return rest.get(`${apiBase}/v1/claims`.replace('/api', '/wallet-api'), (req, res, ctx) => {
    const data = {
      "result": [
        {
          "claimId": id,
          "quantity": 45,
          "productionCertificate": {
            "federatedStreamId": {
              "registry": "string",
              "streamId": id
            },
            "start": 0,
            "end": 0,
            "gridArea": "string",
            "attributes": {
              "additionalProp1": "string",
              "additionalProp2": "string",
              "additionalProp3": "string"
            }
          },
          "consumptionCertificate": {
            "federatedStreamId": {
              "registry": "string",
              "streamId": id
            },
            "start": 0,
            "end": 0,
            "gridArea": "string",
            "attributes": {
              "additionalProp1": "string",
              "additionalProp2": "string",
              "additionalProp3": "string"
            }
          }
        }
      ]
    };

    return res(ctx.status(200), ctx.json(data));
  });
}
