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

import { wholesaleMocks } from './wholesale.mocks';
import { marketParticipantMocks } from './market-participant.mocks';
import { messageArchiveMocks } from './message-archive.mocks';
import { adminMocks } from './admin.mocks';
import { marketParticipantUserMocks } from './market-participant-user.mocks';
import { marketParticipantUserRoleMocks } from './market-participant-user-role.mocks';
import { tokenMocks } from './token.mocks';
import { eSettMocks } from './esett.mocks';
import { imbalancePricesMocks } from './imbalance-prices.mocks';
import { userProfileMocks } from './user-profile.mocks';
import { defaultMocks } from './default.mocks';
import { notificationsMocks } from './notifications.mocks';
import { meteringPointMocks } from './metering-point.mocks';
import { organizationMocks } from './organization.mocks';
import { requestMocks } from './request.mocks';
import { processMocks } from './process';
import { chargesMocks } from './charges.mocks';
import { measurementsReportsMocks } from './measurements-reports.mocks';
import { releaseTogglesMocks } from './release-toggles.mocks';
import { moveInMocks } from './move-in.mocks';

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
