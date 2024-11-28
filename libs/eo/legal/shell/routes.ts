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
import { Routes } from '@angular/router';

export const eoLegalRoutes: Routes = [
  {
    path: 'terms',
    loadComponent: () =>
      import('@energinet-datahub/eo/legal/terms').then((x) => x.EoTermsComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('@energinet-datahub/eo/legal/privacy-policy').then((x) => x.EoPrivacyPolicyComponent),
  },
  {
    path: 'service-provider-terms',
    loadComponent: () =>
      import('@energinet-datahub/eo/legal/service-provider-terms').then(
        (x) => x.EoServiceProviderTermsComponent
      ),
  },
];