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
import { Process } from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { render } from '@testing-library/angular';
import { DhProcessesTabContentComponent, DhProcessesTabContentScam } from './dh-processes-tab-content.component';

const processId = "2c4024f5-762d-4a41-a75e-d045c0ed6572";
const mpGsrn = "577512493148035787";
const testData: Process[] = [
  {
    "id": processId,
    "meteringPointGsrn": mpGsrn,
    "name": "BRS-004",
    "createdDate": "2022-02-15T13:46:59.4781826",
    "effectiveDate": "2021-09-25T23:00:00",
    "status": "Completed",
    "details": [
      {
        "id": "de567425-a420-48da-9391-0696cd036391",
        "processId": processId,
        "name": "RequestCreateMeteringPoint",
        "sender": "0808118335003",
        "receiver": "5790001330552",
        "createdDate": "2022-02-15T13:46:59.4781826",
        "effectiveDate": "2021-09-25T23:00:00",
        "status": "Received",
        "errors": []
      },
      {
        "id": "be684c80-c78f-41ae-b47c-90f09fa54415",
        "processId": processId,
        "name": "ConfirmCreateMeteringPoint",
        "sender": "5790001330552",
        "receiver": "0808118335003",
        "createdDate": "2022-02-15T13:46:59.4782634",
        "effectiveDate": null,
        "status": "Sent",
        "errors": []
      }
    ]
  },
];


describe(DhProcessesTabContentComponent.name, () => {
  // async function setup(processes?: Process[]) {
  //   const { fixture } = await render(DhProcessesTabContentComponent, {
  //     imports: [
  //       getTranslocoTestingModule(),
  //       DhProcessesTabContentScam,
  //     ],
  //   });
  //
  //   runOnPushChangeDetection(fixture);
  // }

  it(`Hello world`, async () => {
    // TODO: Implement tests here when mocking is done for HTTP calls.
    expect(testData).toBe(testData);
  });
});
