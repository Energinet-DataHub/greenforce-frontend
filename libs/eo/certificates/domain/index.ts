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
export interface EoCertificateAttributes {
  // Common attributes
  energyTag_ConnectedGridIdentification?: string;
  energyTag_Country?: string;
  energyTag_EnergyCarrier?: string;
  energyTag_GcFaceValue?: string;
  energyTag_GcIssuanceDatestamp?: number;
  energyTag_GcIssueDeviceType?: string;
  energyTag_GcIssueMarketZone?: string;
  energyTag_GcIssuer?: string;
  energyTag_ProductionDeviceCapacity?: string;
  energyTag_ProductionDeviceCommercialOperationDate?: string;
  energyTag_ProductionDeviceLocation?: string;
  energyTag_ProductionDeviceUniqueIdentification?: string;
  energyTag_ProductionEndingIntervalTimestamp?: string;
  energyTag_ProductionStartingIntervalTimestamp?: string;

  // Production-specific attributes
  energyTag_ProducedEnergySource?: string;
  energyTag_ProducedEnergyTechnology?: string;

  // Attributes before EnergyTag
  assetId?: string;
  fuelCode?: string;
  techCode?: string;
}

export interface EoCertificate {
  federatedStreamId: {
    registry: string;
    streamId: string;
  };
  quantity: number;
  start: number;
  end: number;
  gridArea: string;
  certificateType: EoCertificateType;
  attributes: EoCertificateAttributes;
  time?: string;
  amount?: string;
}

export enum EoCertificateType {
  Production = 'production',
  Consumption = 'consumption',
}

export interface EoCertificateContract {
  id: string;
  gsrn: string;
  startDate: number;
  endDate: number | null;
  created: number;
}
