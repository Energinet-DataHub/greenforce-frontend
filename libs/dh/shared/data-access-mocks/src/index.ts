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
import { wholesaleMocks } from './lib/wholesale';
import { marketParticipantMocks } from './lib/market-participant';
import { messageArchiveMocks } from './lib/message-archive';
import { adminMocks } from './lib/admin';
import { marketParticipantUserMocks } from './lib/market-participant-user';
import { marketParticipantUserRoleMocks } from './lib/market-participant-user-role';
import { tokenMocks } from './lib/token';
import { eSettMocks } from './lib/esett-mocks';
import { imbalancePricesMocks } from './lib/imbalance-prices-mocks';
import { userProfileMocks } from './lib/user-profile-mocks';
import { defaultMocks } from './lib/default-mocks';
import { notificationsMocks } from './lib/notifications-mocks';

export const mocks = [
  wholesaleMocks,
  marketParticipantMocks,
  messageArchiveMocks,
  adminMocks,
  marketParticipantUserMocks,
  marketParticipantUserRoleMocks,
  tokenMocks,
  eSettMocks,
  imbalancePricesMocks,
  userProfileMocks,
  defaultMocks,
  notificationsMocks,
];
