//#region License
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
//#endregion
import { http, HttpResponse } from 'msw';

export function serviceProviderTermsMocks(apiBase: string) {
  return [acceptServiceProviderTerms(apiBase), getServiceProviderTermsAccepted(apiBase)];
}

function acceptServiceProviderTerms(apiBase: string) {
  return http.post(`${apiBase}/authorization/service-provider-terms`, () => {
    return HttpResponse.json({ status: 200 });
  });
}

function getServiceProviderTermsAccepted(apiBase: string) {
  return http.get(`${apiBase}/authorization/service-provider-terms`, () => {
    const data = {
      termsAccepted: false,
    };
    return HttpResponse.json(data, { status: 200 });
  });
}
