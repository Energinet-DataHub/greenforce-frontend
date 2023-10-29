import { rest } from 'msw';

export function claimsMocks(apiBase: string) {
  return [
    postStartClaimProcess(apiBase),
    delteStopClaimProcess(apiBase),
  ];
}

function postStartClaimProcess(apiBase: string) {
  return rest.post(`${apiBase}/claims/start-claim-process`, (req, res, ctx) => {
    const data = {
      "subjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }

    return res(ctx.status(200), ctx.json(data));
  });
}

function delteStopClaimProcess(apiBase: string) {
  return rest.delete(`${apiBase}/claims/stop-claim-process`, (req, res, ctx) => {
    return res(ctx.status(204));
  });
}
