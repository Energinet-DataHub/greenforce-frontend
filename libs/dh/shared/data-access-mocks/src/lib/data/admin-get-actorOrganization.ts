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
import { MarketParticipantOrganizationDto } from '@energinet-datahub/dh/shared/domain';

export const marketParticipantOrganization: MarketParticipantOrganizationDto = {
  organizationId: '47a76eb8-3814-4bc1-96a9-a9a5b9adf849',
  name: 'Energinet DataHub A/S',
  businessRegisterIdentifier: '39315041',
  domain: 'energinet.dk',
  status: 'Active',
  address: { streetName: null, number: null, zipCode: null, city: null, country: 'DK' },
};
