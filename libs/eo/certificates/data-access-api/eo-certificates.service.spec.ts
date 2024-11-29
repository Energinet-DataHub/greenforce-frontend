import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import {
  EoCertificate,
  EoCertificateContract,
  EoCertificatesService,
} from './eo-certificates.service';

describe('EoCertificatesService', () => {
  let apiEnv: EoApiEnvironment;
  let service: EoCertificatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EoCertificatesService],
    }).compileComponents();

    apiEnv = TestBed.inject(eoApiEnvironmentToken);
    service = TestBed.inject(EoCertificatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCertificates', () => {
    it('emits an object with an array of certificates ', waitForAsync(() => {
      const mockObj: EoCertificate = {
        id: '1234',
        gsrn: '2345',
        dateFrom: 0,
        dateTo: 0,
        quantity: 0,
        techCode: '',
        fuelCode: '',
        gridArea: '',
      };

      service.getCertificates().subscribe((res) => {
        expect(res.result.length).toEqual(1);
        expect(res).toEqual({ result: [mockObj] });
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiEnv.apiBase}/certificates`,
      });

      req.flush({ result: [mockObj] });
    }));
  });

  describe('getContracts', () => {
    it('emits an object with an array of contracts', waitForAsync(() => {
      const mockObj: EoCertificateContract = {
        id: '1234',
        gsrn: '2345',
        startDate: 1234,
        endDate: 4321,
        created: 2345,
      };

      service.getContracts().subscribe((res) => {
        expect(res.result.length).toEqual(1);
        expect(res).toEqual({ result: [mockObj] });
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiEnv.apiBase}/certificates/contracts`,
      });

      req.flush({ result: [mockObj] });
    }));
  });

  describe('createContract', () => {
    it('emits the created contract', waitForAsync(() => {
      const gsrn = '2345';
      const mockObj: EoCertificateContract = {
        id: '1234',
        gsrn,
        startDate: Math.floor(new Date().getTime() / 1000),
        created: Math.floor(new Date().getTime() / 1000),
        endDate: Math.floor(new Date().getTime() / 1000),
      };

      service.createContract(gsrn).subscribe((res) => {
        expect(res).toEqual({ mockObj });
      });

      const req = httpMock.expectOne({
        method: 'POST',
        url: `${apiEnv.apiBase}/certificates/contracts`,
      });

      expect(req.request.body).toEqual({ gsrn, startDate: mockObj.created });

      req.flush({ mockObj });
    }));
  });
});
