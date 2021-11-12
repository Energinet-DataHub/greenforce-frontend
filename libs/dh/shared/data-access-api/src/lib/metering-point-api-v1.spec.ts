/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { HttpClientModule, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';

import { DhApiModule } from './dh-api.module';
import { MeteringPointDto, MeteringPointHttp } from './generated/v1';

const nullGsrn = '000000000000000000';
// Available in the metering point test environment
const testMeteringPointGsrns = [
  '571313180400014077',
  '573830327917661875',
  '572618486737161170',
  '575990512432508407',
  '576198124843533632',
  '572865215148321165',
  '576874126135722710',
  '576811034603915520',
  '571313180400014169',
  '579548851016417698',
];

describe('Metering Point API v1', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, DhApiModule.forRoot()],
    });

    http = TestBed.inject(MeteringPointHttp);
  });

  let http: MeteringPointHttp;

  it(`When an existing metering point is looked up by GSRN
    Then a successful response is received`, async () => {
    const [expectedGsrn] = testMeteringPointGsrns;

    const whenResponse = lastValueFrom(
      http.v1MeteringPointGetByGsrnGet(expectedGsrn)
    );

    await expect(whenResponse).resolves.toEqual(
      expect.objectContaining<MeteringPointDto>({
        gsrnNumber: expectedGsrn,
      })
    );
  });

  it(`When an unknown metering point is looked up by GSRN
    Then the response has status code 404 Not Found`, async () => {
    const whenResponse = lastValueFrom(
      http.v1MeteringPointGetByGsrnGet(nullGsrn)
    );

    await expect(whenResponse).rejects.toEqual(
      expect.objectContaining({
        status: HttpStatusCode.NotFound,
      })
    );
  });

  it(`When no GSRN is specified
    Then the response has status code 400 Bad Request`, async () => {
    const whenResponse = lastValueFrom(
      http.v1MeteringPointGetByGsrnGet(undefined)
    );

    await expect(whenResponse).rejects.toEqual(
      expect.objectContaining({
        status: HttpStatusCode.BadRequest,
      })
    );
  });
});
