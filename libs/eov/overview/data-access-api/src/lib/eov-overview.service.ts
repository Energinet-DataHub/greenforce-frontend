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
import {
  ApplicationEnum,
  ConsentDtoArrayResponse,
  GraphDTOResponse,
  MeteringPointDetails,
  MeteringPointDto,
  PowerOfAttorneyWithThirdPartyInfoDto,
  SupplierSwitchHistory, TokenRegistrationDto, TokenRegistrationDtoListResponse,
} from '@energinet-datahub/eov/shared/domain';
import {
  EovApiEnvironment,
  eovApiEnvironmentToken,
} from '@energinet-datahub/eov/shared/environments';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class EovOverviewService {
  #apiBase: string;
  constructor(
    private http: HttpClient,
    @Inject(eovApiEnvironmentToken) apiEnvironment: EovApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiUrl}`;
  }

  getMeteringPoints() {
    return this.http.get<MeteringPointDto[]>(`${this.#apiBase}/customer/api/MeteringPoint`);
  }

  getMeteringPoint(meteringPointId: string) {
    return this.http.get<MeteringPointDetails>(this.#apiBase + '/customer/api/MeteringPoint/' + meteringPointId);
  }

  updateAlias(meteringPointId: string, alias: string) {
    return this.http.patch(this.#apiBase + '/customer/api/MeteringPoint/' + meteringPointId, { MeteringPointAlias: alias });
  }

  getGraphData(meteringPointId: string) {
    return this.http.get<GraphDTOResponse>(this.#apiBase + '/customer/api/MeterData/GetMonthlyGraphData/' + meteringPointId);
  }

  getSupplierSwitchHistory(meteringPointId: string) {
    return this.http.get<SupplierSwitchHistory>(this.#apiBase + '/customer/api/MeteringPoint/history/' + meteringPointId);
  }

  getConsents(language: string) {
    return this.http.get<ConsentDtoArrayResponse>(this.#apiBase + '/customer/api/cpr/getconsents/' + language).pipe(map((result) => result.result ?? []));
  }

  deleteConsent(applicationId: ApplicationEnum) {
    return this.http.post<Response>(this.#apiBase + '/customer/api/cpr/revokeconsent/' + applicationId, null);
  }

  getTokens() {
    return this.http.get<TokenRegistrationDtoListResponse>(`${this.#apiBase}/customer/api/TokenRegistration`);
  }

  activateToken(t: TokenRegistrationDto) {
    return this.http.get(`${this.#apiBase}/customer/api/TokenRegistration/activate/${t.tokenId}`);
  }

  deactivateToken(t: TokenRegistrationDto) {
    return this.http.get(`${this.#apiBase}/customer/api/TokenRegistration/deactivate/${t.tokenId}`);
  }

  addToken(t: TokenRegistrationDto) {
    return this.http.post(`${this.#apiBase}/customer/api/TokenRegistration`, t);
  }

  deleteToken(t: TokenRegistrationDto) {
    return this.http.delete(`${this.#apiBase}/customer/api/TokenRegistration/${t.tokenId}`);
  }

  getAuthorizations() {
    return this.http.get<PowerOfAttorneyWithThirdPartyInfoDto[]>(this.#apiBase + '/customer/api/PowerOfAttorney');
  }

  getAuthorizationPrint(authorizationId: string) {
    const filename = 'Authorization.pdf';

    return this.http
      .get(this.#apiBase + '/customer/api/PowerOfAttorney/' + authorizationId, {
        responseType: 'blob' as 'json',
      })
      .subscribe(
        (response: any) => {
          this.downloadFile(response, filename);
        },
        // (error) => {
        //   if (error.status === 410) {
        //     this.dialog.open(ConfirmDialogComponent, {
        //       data: {
        //         title: this.translate.instant('Customer.Authorization.Unavailable.Title'),
        //         message: this.translate.instant('Customer.Authorization.Unavailable.Message'),
        //       },
        //     });
        //   } else {
        //     this.snackBar.open(this.translate.instant('Error.Generic'), 'OK', {
        //       duration: 4000,
        //     });
        //   }
        // }
      );
  }

  private downloadFile(response: any, filename: string) {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
