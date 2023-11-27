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
import { aggregateCertificatesMocks } from './lib/aggregate-certificates';
import { aggregateClaimsMocks } from './lib/aggregate-claims';
import { aggregateTransfersMocks } from './lib/aggregate-transfers';
import { authMocks } from './lib/auth';
import { certificatesMocks } from './lib/certificates';
import { claimsMocks } from './lib/claims';
import { meteringPointsMocks } from './lib/metering-points';
import { transferMocks } from './lib/transfer';

export const mocks = [
  aggregateCertificatesMocks,
  aggregateClaimsMocks,
  aggregateTransfersMocks,
  authMocks,
  certificatesMocks,
  claimsMocks,
  meteringPointsMocks,
  transferMocks,
];
