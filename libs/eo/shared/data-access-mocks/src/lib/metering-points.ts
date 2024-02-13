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
import { http, HttpResponse } from 'msw';

export function meteringPointsMocks(apiBase: string) {
  return [getMeteringPoints(apiBase)];
}

function getMeteringPoints(apiBase: string) {
  return http.get(`${apiBase}/meteringpoints`, () => {
    const state = localStorage.getItem('metering-points');
    const city = 'Dummy city';
    const productionMeteringPoints = [
      {
        gsrn: '571313130083535430',
        gridArea: 'DK1',
        type: 'Production',
        subMeterType: 'Virtual',
        address: {
          address1: 'Producent Vej 1',
          address2: '',
          locality: null,
          city,
          postalCode: '9999',
          country: 'DK',
        },
        technology: {
          aibTechCode: 'T020000',
          aibFuelCode: 'F01050100',
        },
        canBeUsedForIssuingCertificates: true,
      },
      {
        gsrn: '571313130083531004',
        gridArea: 'DK1',
        type: 'Production',
        subMeterType: 'Virtual',
        address: {
          address1: 'Producent Vej 3',
          address2: '',
          locality: null,
          city,
          postalCode: '9999',
          country: 'DK',
        },
        technology: {
          aibTechCode: 'T070000',
          aibFuelCode: 'F00000000',
        },
        canBeUsedForIssuingCertificates: false,
      },
    ];
    const consumptionMeteringPoints = [
      {
        gsrn: '571313171355435421',
        gridArea: 'DK1',
        type: 'Consumption',
        subMeterType: 'Virtual',
        address: {
          address1: 'Producent Vej 2',
          address2: '1 11A',
          locality: null,
          city,
          postalCode: '9999',
          country: 'DK',
        },
        technology: {
          aibTechCode: 'T010000',
          aibFuelCode: 'F01040100',
        },
        canBeUsedForIssuingCertificates: true,
      },
      {
        gsrn: '571313171355435420',
        gridArea: 'DK1',
        type: 'Consumption',
        subMeterType: 'Virtual',
        address: {
          address1: 'Producent Vej 2',
          address2: '1 11A',
          locality: null,
          city,
          postalCode: '9999',
          country: 'DK',
        },
        technology: {
          aibTechCode: 'T010000',
          aibFuelCode: 'F01040100',
        },
        canBeUsedForIssuingCertificates: true,
      },
    ];

    let data: unknown[];

    if (state === 'no-metering-points') {
      data = [];
    } else if (state === 'only-consumption-metering-points') {
      data = [...consumptionMeteringPoints];
    } else if (state === 'only-production-metering-points') {
      data = [...productionMeteringPoints];
    } else if (state === 'metering-points-error') {
      return HttpResponse.error();
    } else {
      data = [...consumptionMeteringPoints, ...productionMeteringPoints];
    }

    return HttpResponse.json({ result: data }, { status: 200 });
  });
}
