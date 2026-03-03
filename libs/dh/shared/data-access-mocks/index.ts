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

import { wholesaleMocks } from './src/lib/wholesale.mocks';
import { marketParticipantMocks } from './src/lib/market-participant.mocks';
import { messageArchiveMocks } from './src/lib/message-archive.mocks';
import { adminMocks } from './src/lib/admin.mocks';
import { marketParticipantUserMocks } from './src/lib/market-participant-user.mocks';
import { marketParticipantUserRoleMocks } from './src/lib/market-participant-user-role.mocks';
import { tokenMocks } from './src/lib/token.mocks';
import { eSettMocks } from './src/lib/esett.mocks';
import { imbalancePricesMocks } from './src/lib/imbalance-prices.mocks';
import { userProfileMocks } from './src/lib/user-profile.mocks';
import { defaultMocks } from './src/lib/default.mocks';
import { notificationsMocks } from './src/lib/notifications.mocks';
import { meteringPointMocks } from './src/lib/metering-point.mocks';
import { organizationMocks } from './src/lib/organization.mocks';
import { requestMocks } from './src/lib/request.mocks';
import { processMocks } from './src/lib/process';
import { chargesMocks } from './src/lib/charges.mocks';
import { measurementsReportsMocks } from './src/lib/measurements-reports.mocks';
import { releaseTogglesMocks } from './src/lib/release-toggles.mocks';
import { moveInMocks } from './src/lib/move-in.mocks';

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
