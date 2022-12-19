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
import hmacSHA256 from 'crypto-js/hmac-sha256';
import encBase64 from 'crypto-js/enc-base64';
import encUtf8 from 'crypto-js/enc-utf8';

import { permissions } from '@energinet-datahub/dh/shared/domain';

export function tokenMocks(apiBase: string) {
  return [postToken(apiBase)];
}

function getBase64Encoded(string: string) {
  const wordArr = encUtf8.parse(string);
  return encBase64.stringify(wordArr);
}

function createJWT(headerKey: unknown, dataKey: unknown, secretKey: string) {
  const header = getBase64Encoded(JSON.stringify(headerKey));
  const payload = btoa(JSON.stringify(dataKey));
  const secret = secretKey;
  const sign = hmacSHA256(header + "." + payload, secret);
  const sign64 = encBase64.stringify(sign);

  return (header + "." + payload + "." + sign64).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function postToken(apiBase: string) {
  return rest.post(`${apiBase}/v1/Token`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: createJWT({"alg": "HS256"}, {role: permissions}, ''),
      })
    );
  });
}
