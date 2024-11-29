import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { lastValueFrom } from 'rxjs';
import { EoMeteringPointsService } from './eo-metering-points.service';

function setup() {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  });

  const server = TestBed.inject(HttpTestingController);

  return {
    apiEnvironment: TestBed.inject(eoApiEnvironmentToken),
    client: TestBed.inject(EoMeteringPointsService),
    server,
    teardown: () => {
      server.verify();
    },
  };
}

describe('EoMeteringPointsService', () => {
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
