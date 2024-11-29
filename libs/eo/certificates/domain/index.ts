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
