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
import {
  Process,
  ProcessDetail,
  ProcessStatus,
} from '@energinet-datahub/dh/shared/data-access-api';

export class DHProcess implements Process {
  createdDate: string;
  details: ProcessDetail[];
  effectiveDate?: string | null;
  id: string;
  meteringPointGsrn: string;
  name: string;
  status: ProcessStatus;

  constructor(process: Process) {
    this.createdDate = process.createdDate;
    this.details = process.details;
    this.effectiveDate = process.effectiveDate;
    this.id = process.id;
    this.meteringPointGsrn = process.meteringPointGsrn;
    this.name = process.name;
    this.status = process.status;
  }

  // TODO: PR Question: What is the preferred way to handle the need for this?
  // TODO: Also, figure out if this is actually how the "indicator light" should work since old process details would still show their errors
  public hasErrors(): boolean {
    return this.details.some((detail) => detail.errors.length > 0);
  }
}
