import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';

import { DhApiModule } from './dh-api.module';
import { MeteringPointHttp } from './generated/v1';

describe('Metering Point API v1', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DhApiModule.forRoot()],
    });

    http = TestBed.inject(MeteringPointHttp);
  });

  let http: MeteringPointHttp;

  it(`When an existing metering point is looked up by GSRN
    Then a successful response is received`, async () => {
    const response = await lastValueFrom(http.v1MeteringPointGetByGsrnGet(''));

    expect(response).not.toBeNull();
  });
});
