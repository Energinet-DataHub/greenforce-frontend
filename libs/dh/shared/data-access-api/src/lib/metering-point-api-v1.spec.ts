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
import { HttpClientModule, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';

import { DhApiModule } from './dh-api.module';
import { MeteringPointCimDto, MeteringPointHttp } from '@energinet-datahub/dh/shared/domain';

const nullGsrn = '000000000000000000';

// Available in the metering point U-001 test environment
const testMeteringPointGsrnsU001 = ['571313180400014602'];

// Available in the metering point U-002 test environment
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _testMeteringPointGsrnsU002 = [
  '575391908025497398',
  '577323355423810428',
  '572171372772494363',
  '572053635580655612',
  '572234041863383821',
  '577535562936931141',
  '576859301174106177',
  '576694542901211855',
  '578943703402903916',
  '579702678493999563',
  '570263739584198159',
  '574473342844191734',
  '574289323666998780',
  '572987831665871085',
  '573416679930586142',
  '570111980226971120',
  '578786663472792667',
  '572395320398525884',
  '577285766439957143',
  '570513847037876966',
  '574145954427421215',
  '573889365018332627',
  '578568925568597881',
  '572958772785955041',
  '573164968376441581',
  '570708164896675179',
  '572175600196427305',
  '575995465559983198',
  '571313180400014510',
  '571313180400014527',
  '577139541259605243',
  '578647957663234756',
  '578557647359763834',
  '571299231640042809',
  '570938868821567933',
  '577098220286790149',
  '578372563660229818',
  '573293665582836507',
  '578386751324820539',
  '575829035218490459',
  '579319933184852188',
];

xdescribe('Metering Point API v1', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, DhApiModule.forRoot()],
    });

    http = TestBed.inject(MeteringPointHttp);
  });

  let http: MeteringPointHttp;

  it(`When an existing metering point is looked up by GSRN
    Then a successful response is received`, async () => {
    const [expectedGsrn] = testMeteringPointGsrnsU001;
    const whenResponse = lastValueFrom(
      http.v1MeteringPointGetByGsrnGet(expectedGsrn)
    );

    await expect(whenResponse).resolves.toEqual(
      expect.objectContaining<MeteringPointCimDto>({
        gsrnNumber: expectedGsrn,
      } as MeteringPointCimDto)
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
