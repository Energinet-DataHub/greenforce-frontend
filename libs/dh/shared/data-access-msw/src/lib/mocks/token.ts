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

export function tokenMocks(apiBase: string) {
  return [postToken(apiBase)];
}

function postToken(apiBase: string) {
  const mockedJwt = {
    sub: 'some-subject',
    azp: 'some-azp',
    token: 'mocked.token',
    nbf: 1671435203,
    exp: 1671438803,
    iss: 'some-issuer',
    aud: 'some-audience',
    iat: 1671435215,
  };

  return rest.post(`${apiBase}/v1/Token`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: `mocked.${btoa(JSON.stringify(mockedJwt))}`,
      })
    );
  });
}
