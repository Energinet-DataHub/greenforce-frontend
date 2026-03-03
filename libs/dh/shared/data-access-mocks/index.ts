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

import { wholesaleMocks } from './src/wholesale.mocks';
import { marketParticipantMocks } from './src/market-participant.mocks';
import { messageArchiveMocks } from './src/message-archive.mocks';
import { adminMocks } from './src/admin.mocks';
import { marketParticipantUserMocks } from './src/market-participant-user.mocks';
import { marketParticipantUserRoleMocks } from './src/market-participant-user-role.mocks';
import { tokenMocks } from './src/token.mocks';
import { eSettMocks } from './src/esett.mocks';
import { imbalancePricesMocks } from './src/imbalance-prices.mocks';
import { userProfileMocks } from './src/user-profile.mocks';
import { defaultMocks } from './src/default.mocks';
import { notificationsMocks } from './src/notifications.mocks';
import { meteringPointMocks } from './src/metering-point.mocks';
import { organizationMocks } from './src/organization.mocks';
import { requestMocks } from './src/request.mocks';
import { processMocks } from './src/process';
import { chargesMocks } from './src/charges.mocks';
import { measurementsReportsMocks } from './src/measurements-reports.mocks';
import { releaseTogglesMocks } from './src/release-toggles.mocks';
import { moveInMocks } from './src/move-in.mocks';

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
  organizationMocks,
  requestMocks,
  meteringPointMocks,
  processMocks,
  chargesMocks,
  measurementsReportsMocks,
  releaseTogglesMocks,
  moveInMocks,
];
