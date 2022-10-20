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
import { rest } from 'msw';
import {
  ChargePriceV1Dto,
  ChargeV1Dto,
  MarketParticipantV1Dto,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain';

export const chargesMocks = [
  searchChargePrices(),
  getChargeLinks(),
  getCharges(),
  getMarketParticipants(),
  searchCharges(),
];

function getChargeLinks() {
  return rest.get('https://localhost:5001/v1/ChargeLinks', (req, res, ctx) => {
    return res(ctx.status(404));
  });
}

function getCharges() {
  return rest.get('https://localhost:5001/v1/Charges', (req, res, ctx) => {
    const result: ChargeV1Dto[] = [
      {
        chargeType: 'D01',
        resolution: 'PT15M',
        taxIndicator: false,
        transparentInvoicing: true,
        vatClassification: VatClassification.Vat25,
        validFromDateTime: '2022-09-28T22:00:00',
        validToDateTime: '2022-10-29T22:00:00',
        chargeId: '0AA1F',
        chargeName: 'Net abo A høj Forbrug',
        chargeDescription: 'Net abo A høj Forbrug beskrivelse',
        chargeOwner: '5790000681075',
        chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
      },
    ];
    return res(ctx.status(200), ctx.json(result));
  });
}

function getMarketParticipants() {
  return rest.get(
    'https://localhost:5001/v1/Charges/GetMarketParticipantsAsync',
    (req, res, ctx) => {
      const result: MarketParticipantV1Dto[] = [
        {
          id: 'C5E0990A-713B-41E6-AB9C-A1B357A1EABD',
          name: 'name 1',
          marketParticipantId: '8100000000016',
        },
      ];
      return res(ctx.status(200), ctx.json(result));
    }
  );
}

function searchCharges() {
  return rest.post(
    'https://localhost:5001/v1/Charges/SearchASync',
    (req, res, ctx) => {
      const result: ChargeV1Dto[] = [
        {
          chargeType: 'D01',
          resolution: 'P1D',
          taxIndicator: false,
          transparentInvoicing: true,
          vatClassification: VatClassification.Vat25,
          validFromDateTime: '2022-09-27T22:00:00',
          validToDateTime: '2022-11-29T22:00:00',
          chargeId: '0AA1F',
          chargeName: 'Net abo A høj Forbrug 1',
          chargeDescription: 'Net abo A høj Forbrug 1 beskrivelse',
          chargeOwner: '5790000681075',
          chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 041',
        },
        {
          chargeType: 'D02',
          resolution: 'PT15M',
          taxIndicator: false,
          transparentInvoicing: true,
          vatClassification: VatClassification.NoVat,
          validFromDateTime: '2022-09-29T22:00:00',
          validToDateTime: '2022-10-29T22:00:00',
          chargeId: '0AA1A',
          chargeName: 'net abo A høj Forbrug 2',
          chargeDescription: 'net abo A høj Forbrug 2 beskrivelse',
          chargeOwner: '5790000681074',
          chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 040',
        },
        {
          chargeType: 'D02',
          resolution: 'PT15M',
          taxIndicator: false,
          transparentInvoicing: true,
          vatClassification: VatClassification.NoVat,
          validFromDateTime: '2021-09-29T22:00:00',
          validToDateTime: '2021-10-29T22:00:00',
          chargeId: 'chargeid01',
          chargeName: 'Net abo A høj Forbrug 3',
          chargeDescription: 'Net abo A høj Forbrug 2 beskrivelse',
          chargeOwner: '5790000681074',
          chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
        },
      ];
      return res(ctx.status(200), ctx.json(result));
    }
  );
}

function searchChargePrices() {
  return rest.post(
    'https://localhost:5001/v1/Charges/SearchChargePricesAsync',
    (req, res, ctx) => {
      const result: ChargePriceV1Dto[] = [
        {
          price: 10,
          fromDateTime: '2022-01-01T22:00:00',
          toDateTime: '2022-01-02T22:00:00',
        },
        {
          price: 20,
          fromDateTime: '2022-09-02T22:00:00',
          toDateTime: '2022-09-03T22:00:00',
        },
        {
          price: 300,
          fromDateTime: '2022-09-03T22:00:00',
          toDateTime: '2022-09-04T22:00:00',
        },
      ];
      return res(ctx.status(200), ctx.json(result));
    }
  );
}
