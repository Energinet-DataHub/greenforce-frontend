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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { lastValueFrom } from 'rxjs';
import { EttMeteringPointsService } from './ett-metering-points.service';

function setup() {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  });

  const server = TestBed.inject(HttpTestingController);

  return {
    apiEnvironment: TestBed.inject(ettApiEnvironmentToken),
    client: TestBed.inject(EttMeteringPointsService),
    server,
    teardown: () => {
      server.verify();
    },
  };
}

describe('EttMeteringPointsService', () => {
  describe('getMeteringPoints', () => {
    it('emits API response with metering points', async () => {
      const { apiEnvironment, client, server, teardown } = setup();
      const fakeResponse = {
        meteringPoints: [{ gsrn: '1234-meter-id', gridArea: 'DK1' }],
      };

      const whenResponse = lastValueFrom(client.getMeteringPoints());
      const response = server.expectOne(
        (request) =>
          request.url === `${apiEnvironment.apiBase}/meteringpoints` && request.method === 'GET'
      );
      response.flush(fakeResponse);

      expect(await whenResponse).toEqual(fakeResponse);
      teardown();
    });
  });
});
