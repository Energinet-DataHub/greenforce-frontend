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
import { EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';

export interface MeteringPoint {
  /** Unique ID of the metering point - Global Service Relation Number */
  gsrn: string;
  /** Name of the area the metering point is registered in */
  gridArea: string;
  /** Type of metering point, ie. consumption or production */
  type: string;
  address: {
    /** Address line, ie. 'Dieselstraße 28' */
    address1: string;
    /** Extra address line for floor, side and such, ie. '3. Stock */
    address2: string | null;
    /** Local area description, ie. 'Niedersachsen' */
    locality: string | null;
    /** City name, ie. 'Wolfsburg' */
    city: string;
    /** Postcode, ie. '38446' */
    postalCode: string;
    /** Country-code, ie. 'DE' */
    country: string;
  };
  assetType: 'Wind' | 'Solar' | 'Other';
  subMeterType: 'Virtual' | 'Physical';
}

export interface EoMeteringPoint extends MeteringPoint {
  /** Granular certificate contract on metering point */
  contract?: EoCertificateContract;
  /** Indicates whether a contract status is loading for the meteringpoint */
  loadingContract: boolean;
}
