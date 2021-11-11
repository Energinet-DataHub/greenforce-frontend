import { HttpClientModule, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';

import { DhApiModule } from './dh-api.module';
import { MeteringPointDto, MeteringPointHttp } from './generated/v1';

const nullGsrn = '000000000000000000';
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
    Then the response has status code 404`, async () => {
    const whenResponse = lastValueFrom(
      http.v1MeteringPointGetByGsrnGet(nullGsrn)
    );

    await expect(whenResponse).rejects.toEqual(
      expect.objectContaining({
        status: HttpStatusCode.NotFound,
      })
    );
  });
});
