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
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { eoLandingPageRelativeUrl, eoTermsRoutePath } from '@energinet-datahub/eo/shared/utilities';
import jwt_decode from 'jwt-decode';
import { EoAuthStore, EoLoginToken } from './auth.store';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  #loginUrl: string;
  #authApiBase: string;

  constructor(
    private http: HttpClient,
    private store: EoAuthStore,
    private router: Router,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#authApiBase = `${apiEnvironment.apiBase}/auth`;
    this.#loginUrl = `${apiEnvironment.apiBase}/auth/oidc/login?fe_url=${window.location.origin}&return_url=${window.location.origin}/dashboard`;
  }

  handlePostLogin() {
    this.handleToken();
    this.handleTermsAcceptance();
  }

  refreshToken() {
    this.handleToken();
  }

  login() {
    window.location.href = `${this.#authApiBase}/login`;
  }

  logout() {
    // TODO: Navigate til /api/auth/logout med bearer token headeren
    this.http.post(`${this.#authApiBase}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.router.navigateByUrl(eoLandingPageRelativeUrl),
      error: () => this.router.navigateByUrl(eoLandingPageRelativeUrl),
    });
  }

  private handleTermsAcceptance() {
    this.store.getScope$.subscribe((scope) => {
      if (scope.includes('not-accepted-terms') === true) {
        this.router.navigate([eoTermsRoutePath]);
      }
    });
  }

  private handleToken() {
    const mockToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGhvbWFzIE0uIFRlc2xhc2VuIiwic3ViIjoiMjc5NDY1NjAtNjVjZC00MTgxLWEwNjMtOTVjNWFjNzQyMmY3Iiwic2NvcGUiOiJhY2NlcHRlZC10ZXJtcyBkYXNoYm9hcmQgcHJvZHVjdGlvbiBtZXRlcnMgY2VydGlmaWNhdGVzIiwiZWF0IjoiWVRJMllCR3dGaUExcVFtbVpxWlN4Q2pMTFZhZGtzWlorVDlwcitJRmErTWdUTTVVLzBwVW8xQStUV1ZDSlI2REJoelQzWmYrMlNZSDFsWitFTUZrL3IydkFDa1dBUFV0MmlOK2ZPb3BmSHJDQ1UzTVdzWUVOTUZpV3MvdnBJTC9tRWVXNzJzZnliZkY3OWcyRWxkNlpLa3FCTTdZQUdKeUhRc0N3TmVQajBlalliNkUvUks5VVVCSXFVRkl3UFViVlhNenJ1SWNUT1RMY21pTTVGRXlCa3JwNWFCeHhQSmllNDBWL0Nyc0dxSWl5cGlIVXBtNVB1VjVrTmNsemRiSURIdWVSNVZFS2NFbUpiUE9ZYzJyQmZWcHBiaEQ4U2t2Z3ArS0R1Zk9jSXFSblp1R2kyQmp5VWRmSFMwTGtrd2JpcSttUXpRbHc5aEN6NHl0cDZ1UmJMUEQ3cW5UVmZIaG1EKzEvWEpvL1YyTGs1Ri9RR1BDNXREUzY0TWZtUXRXQS9CVkFiYWQwWmkyUjVEQVZlSm5RVS85eVlqWVRxdmg5NkVmaHZzN2dSNk03bGwvQ0xhNkFJZjI4djBBaTI3QzlKV2l2MlRINHBQTmV4NStndXBqWDdzQ0psay9Da29PVno1KzNhaXFuRjFTWDF1VW10MkxtTnpPUE02TzcxM1RVZElDamYwUVFnTlJBa2JVc215VWJXakpKZFZ3alRCVHFBSkFYYnZjYlFXeVJrTUhVTEZHT1JDUXNvVlRwbWI4SDJiUXlGcDJ0OXladU5NckpBWWZ0L2tSamtSNE9nQWJhYjNrcDRQMVlocWFxSjlCdWFSb0sxcnhpRzVUcTd6Vzk3WWs4OEVTZExQb09zTEUyZitVL2ZhSWRZdE9qYzFZQXB3WmNqYlFFL1hGRzh4aW04N0pOM0wrYTBRT1F0VkJxaWk1WVk0d2wyMVZCWHZMQ1l2bkFBTHh2V2ZSdm1UVVNZdHVqWXFqR1VYTEpwUVo1YmtrQkx5ZWE0Q2xnSWpWUnhjcE9FQXdjZDdJTDlrUHlqYTRYUmtidUZuSlQ0S2c4WERWNVdQVTRxOHJrM0x6dFUvUHc4ZDBVdk1jeEpoNnZZdGhtMlFLK0FpZTJvNHd2eHVDT3QyVlJ4aExNOExQTEgwTTdqL3VvK000QTA0T1NuODNKWGFTOWJGOTRRa0dGaHU0UlludlhTQTIvN3l6MUsvc3p5MmNGTldWVDhZeDlkejNRV3pDaXIvRVZRaGxWVnRCdlpaWnpwclQ0aW85VWNJSWZ2VWtiUHVOT0NEdVg2bk5HUT09IiwiZWl0IjoiTkY4VytwSHVvWGJLODhBWjRZYkZZSDEwKzVEZWIwOERpSjJXWFZwZEhYSytQTXNZTWJRZUdUdUJvQmVxT1ZxLy9tY0NSRmZqMnZxWjR3bVc1ZVlrWDdackZZQ2pQK3hBb2ZaYmcwNVhFMnJ4dW5ycTlkWndNU1ZmOUpZYUlCQzUzRzdyR2JvLy9Ta3U3ZVg3V1Z2YzZzdDJySVA5NVFtNGh0SCsyUnorVmNaK3lxSVhUTEhBUnZNd0loMmM1SklYODdOZXducDFNQWJ1V2EvTEhIWURLRURDTmQraEtpbTlsRlY4MjQ5K3JPMXExUVUwZlNlWFFzTUJvWnhnZDZzbmhjYllJcHExVkorNy9yWWt6aUdPdFpLeDhTdmZMOHFaR0lyZ1BWcmJKbnNpckhQRUJrWkR5TzhHd1k2aXY3TUFmSjZZZUpjSEhFNndyWlZ3eDJGd0dOT2dlaDN1bGYwV3E0TWZ4Q1pGQ1JKbkJ4RjlEZ1hSWDg1b3crSVptNnZibVhIVkNESGZOMVZ3QlR2OEl5Uk9mQmphRzMwK1NJbEh2Q3VDaGRrYVdGRzlXcjlrL1ErR0FKMko0cWF2VXdnVzhuZkVveVJzRkhLTzI5Nlpwb1hRbGZFVFdlQU1ITHcvdlVzV2tvUVFOWnlEN211RjFKSG9kaC9jTkkxaUtTL2RFRE00U2V1STg5c3c2ZElKV1ROTzlXckd6SG91NEpJejVjTkxxT1FCMVM5YkE4UXBXanYxcFdWZ0JwTzZsaEo1Z0UxL0hlMUNuU3lFeDZFRnNaR3AxaUxubmpvUGR6OUlUUHhuWEdaNlh3WWFWQzRNeWFpU0FWa0tRalhXRm9Nbng2c2lhcVU1Nit0Q3FGVUxXRXRLRzNObGpZM3V4RDhIRUZUeDY2aXlQTUxZZXc2OEJKTmhZUk50WjRUWE5rRjcwbThUMjJrWHdGVXNMMjRHeGg5TmpyYUl1b0UvNXkyY2oyUmc0TU1JWUFodXRqRFRUR1pEdk9RV1h5b3dLSEFQS2JSMHJrejlDZWE5Uk9xZk9yRDVVRi9pUy9GMVRLM0VoRE4vK3I3SXRZQzJReVhSdzFETWc4RTI0U1ZmVmxweWJ6Nkd4b3dXU1lYa2RpSVMzRGxRNEtVR1lLTFEzVkpYbHN4cmtsSDVNbVJIc3VqazhuVVdVbTl5NDdGNURGbHJyMU95MlMrekVTbjI2ZmFZQTNuRFZTUzYzUGhkVWM0WUNJUTI0QjczNi9xRUx0b3NNRXIwUWEzWFRySllrb0dEMzVNbHM2OUFnUEcyOE9ZdGRjbm0rRmFvaE00TlhYdlc0QVF3Z3lxamRRbz0iLCJleHQiOiJmNGI1MzAwZS04YWQ4LTQ5YjAtODU5MC05YjBlMDJjZjc4YmYiLCJhdHYiOjIsInRybSI6MiwiYWNsIjpmYWxzZSwibmJmIjoxNjc5NjY1MjgwLCJleHAiOjE2Nzk2NjU1ODAsImlhdCI6MTY3OTY2NTI4MCwiaXNzIjoiZW8tdS0xMTQ0YXV0aGNoYXJ0Lndlc3RldXJvcGUuY2xvdWRhcHAuYXp1cmUuY29tIiwiYXVkIjoiVXNlcnMifQ.RzGzoZkBMzTdx-HB9obSB0fBts0tyn1j1WqaTLN0l7pr6VK1vTXz0wgsT8N-h66KpdyMi59bWlBkTqVocDkUfu4bfum03eSn0Bhrrucags94ILblBjZfpxQ-zZthm3bBu3Mp1UTK9ehWPZckY4UjfEpv1AI-QbvYr0IiZlb-b-1eEq0NQV4JKD012gRnNybu_e61mbV_13RAIYyvfuWUKi80PYmSF57aJxYlK3ZhTkTNXEze-PvPxHyrZCu8VTAMXaWzB04CBTUhVoZdM2QYs3gVgrhasxhpc266nSLxXI5oYi74ErKAND_33yGTDRjJtc1FUagrs5-HJU63-6288g';

    let decodedToken: EoLoginToken;
    let token: string;

    try {
      decodedToken = jwt_decode(this.getTokenFromCookie('Authorization'));
      token = this.getTokenFromCookie('Authorization').replace('Authorization=', '');
    } catch {
      decodedToken = jwt_decode(mockToken);
      token = mockToken;
    }

    this.store.token.next(token);
    this.store.setTokenClaims(decodedToken);
  }

  private getTokenFromCookie(cookieName: string) {
    return document.cookie.split(';').find((c) => c.trim().startsWith(`${cookieName}=`)) ?? '';
  }
}
