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
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { AuthHttp } from '@energinet-datahub/eo/auth/data-access-api';
import { EoAuthTermsStore } from './eo-auth-terms.store';
import { of } from 'rxjs';
import { browserLocationToken } from './browser-location.token';

describe(EoAuthTermsStore.name, () => {
  describe('Given the Auth API is available', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          EoAuthTermsStore,
          MockProvider(browserLocationToken, {
            replace: jest.fn(),
          }),
          MockProvider(ActivatedRoute, {
            queryParams: of({
              state,
            }),
          }),
          MockProvider(AuthHttp, {
            postAcceptTerms: jest.fn(() =>
              of({ next_url: '/dashboard?success=1' })
            ),
          }),
        ],
      });
      store = TestBed.inject(EoAuthTermsStore);
    });

    const state =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmZV91cmwiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAvIiwicmV0dXJuX3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9kYXNoYm9hcmQiLCJ0ZXJtc19hY2NlcHRlZCI6ZmFsc2UsInRlcm1zX3ZlcnNpb24iOm51bGwsImlkX3Rva2VuIjoiK0hEUGZjUktrS2tnekU1U2FCSXpBanJ1OXhucGVVUXdhVjNOY1QxRlArL1V1QUhkMDNFMEplSGxIZ0hUSjA2QXhtdHFZeUlUZ1IyUHF2ZVhwQXV1cTlJazdIdSs2WFVnU21HZ3pOZVpxcnZEV2RvWnk3S0lONGZJVlczaDBCRS9nV3hZZXo1c1VFWE5XM3J1UENYc3krR0JPQkk4TWFJelB3RXpBQzVqRWVHWGpsczRxZWlIdjFuWWV0QXlGSm9LellNM1ZVN1BlaEtXT0VpN25wQUpodnl5VDlDMU1OcUpoQXN3SHptTDg1Qll3b2ptSkFmaG1aeUpIcU1pdFNSTnNLTTZmNTB6clFpZ3B2NE5BL2xvaVdpY1I4N3V3UHk5RVZjS0pPdk1qbkh1QkN1cFlVSWI0NisreHpwdDlhZVhHR1E4cmx2MlgxY1ppb01DbVZSSGV1d1FOeDdIVW9JRFhaMzVxbUZjVnpkOENxemViblM2SHVUVlk5THB6Y2ZLNVJTV2pFVmlIT3k1dVgzcnFJNW1UaEFOZXlPWnIzVlA5SitCOTRHbU1rQVhRMzBzNmxPRlFvVkZJV2pzZE5DTEwzOTFaU2Q2cFFYK1NGS1ZwNUJOTDRnN0hnNXIxcVQ4R1F0VlNoK2EyM2FJNDViNktTNnNDOEduUnNSYUR2KzFuWS9LcUEzT1U0N29UREJFTkpnVjYwd1hac0JMdC8xOHZyNklOQ0N1TUt5Q1IvaWZwK2dkTlA3NDN4UjU5cVozNmtWTkRjOXFsTU9iRUcxOC9ERWlrbmMyenRoRFZWVGE3SkRQV3Zhb3VNdHk0TVgvY3Y3N2ZOV0JPZk9LNUJkSysweTZhTlVwNVAzTHRnTVJRNUl3bFdPQk5WUFB6SEJEUTBsdnZnbTR4ZnNqdjR5Q2xIYzlRa0dmeWRZcG5QUldlRElUMzdzRUlrem5ObTdtUDRMSXhGV0FEbXc5WWFYdWZNdVVueFR1MEZUY0FRSGRTemxWVUZXY2ZTa1FaVzJLQVExQU4vVU85ayt3azBRdlROZHU5VmFiWUlwWUF0Mm1iY1dPSVRJTXF3MENWaUNOdzJkRTVyMFp3M2NLSVk0YWJLeCs1VWw4bFBtNGpIRFdzckVuclM2WGZvL1lJSXFSWTFDeFAzbmEzSWJLR2lwbGdPY1pKVnFtYXF1SEpDd2VuTVlxVzhtNEJxYmNYemFsYWtKSFhXNzdZYXI5d2xoVE1jS0JXdDNuWTQwQXJ6OUxyWEJhQUM5VFdubHU4MlpYbCszdWFBTFR4MkFJVEZnNHlzZUVQQ0NPSWNKNGJuSVBpSitZT0VjSllQZmUvTEowQlNySzdEK09ndFhyVXBEcU5Zb2FzWTc4ODVUZVJLSEJySGREQS9iMmNDS0J3TlJoa1NYSjdYK3UwRzhoZXF5ay9GaGx1a2Z2MGpTK2s4SDdhWnBWNExkSGNZVnZHTjNyVGg5UktFUDFnaTNNRmJ5RGtvSWIzV1IzbUhKUGx2Z1Bla01hU1cxMUJzaEpVbXVGclVab0xYNDA1K1VOMmNmRXhhejRHaFJicFpLWGsvTURtaGxoK1UwVjM0Y3A5WUxhcnpEMGJlbGpjaWtiWG1xWFdQTjYweVBPcS94cjJYMWFRVmFYN1Y4V2JUd1ljZ2k4ZGhGS0JXZ3pKVC9oais5Wmo3VzNySUZGb3grSGw5dEtxRTBCbFFWUFhZalNxVTllU0lJS3RScVd5bUljREd3dTVCaVdhYzlKdVU1YjB4V3F0OUlyaWFTM0pycy9EWHVucVpXUlY2b1dEUG9qODQ2bGxlOXVQc3o0MGlvamJxTVdXNldkWGNBZ3MyWThKc3RORjljLzJ4R0lRdDNhN2NTSFVBbXhjS1RzOHU5djBTcWhhdmtvL1ZzQVBSM1hxcUVjdDhoVHdza1ViM1JHZDFOKzdaOTdLWnQ5cUhlREdWZTlzYmRucDJhbGduRnpjb2ZsRmFPUEhLTGxXQXJxTmxYUEdXOGU3Qko1ZkNwdFhROE5DeVRNSzVUQlZUYks4cGVBQVV0SlozS0JHOC9HV1krZVM4NkZMdWFVSmU2QkFDOTRNNmY3aUNIVm50az0iLCJ0aW4iOiIzOTMxNTA0MSIsImlkZW50aXR5X3Byb3ZpZGVyIjoibmVtaWQiLCJleHRlcm5hbF9zdWJqZWN0IjoiYTNsMWJhN2ItNjZjMi00YmJiLWExZGYtNzExODgxNGIzOGFjIn0.zYSy1Dom1t0hXY7f3_HgnH9E7V9FZ0dYRolfIKKjeYk';
    const version = '1.0';
    let store: EoAuthTermsStore;

    it('Then "version", "accepted" & "state" is added to the accept terms request', async () => {
      const authHttp = TestBed.inject(AuthHttp);
      store.onVersionChange(version);
      store.onAcceptTerms();
      expect(authHttp.postAcceptTerms).toHaveBeenCalledWith({
        state,
        version,
        accepted: true,
      });
      expect(authHttp.postAcceptTerms).toHaveBeenCalledTimes(1);
    });

    it('Then the "next_url" is received after accepting the terms', async () => {
      const location = TestBed.inject(browserLocationToken);
      store.onVersionChange(version);
      store.onAcceptTerms();
      expect(location.replace).toHaveBeenCalledWith('/dashboard?success=1');
      expect(location.replace).toHaveBeenCalledTimes(1);
    });
  });
});
