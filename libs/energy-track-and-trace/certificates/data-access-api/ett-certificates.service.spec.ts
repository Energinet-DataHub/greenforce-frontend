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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { EttApiEnvironment, EttApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import {
  EttCertificate,
  EttCertificateContract,
  EttCertificatesService,
} from './ett-certificates.service';

describe('EttCertificatesService', () => {
  let apiEnv: EttApiEnvironment;
  let service: EttCertificatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EttCertificatesService],
    }).compileComponents();

    apiEnv = TestBed.inject(EttApiEnvironmentToken);
    service = TestBed.inject(EttCertificatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCertificates', () => {
    it('emits an object with an array of certificates ', waitForAsync(() => {
      const mockObj: EttCertificate = {
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
      const mockObj: EttCertificateContract = {
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
      const mockObj: EttCertificateContract = {
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
