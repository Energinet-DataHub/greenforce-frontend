import { TestBed } from '@angular/core/testing';

import { EoMeteringPointsService } from './eo-metering-points.service';

describe('EoMeteringPointsService', () => {
  let service: EoMeteringPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EoMeteringPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
