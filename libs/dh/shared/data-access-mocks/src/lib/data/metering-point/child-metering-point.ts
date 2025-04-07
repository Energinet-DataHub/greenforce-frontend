//#region License
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
//#endregion
import {
  AssetType,
  CommercialRelationDto,
  ConnectionState,
  ConnectionType,
  CustomerContactDto,
  DisconnectionType,
  ElectricalHeatingDto,
  ElectricityMarketMeteringPointType,
  EnergySupplyPeriodDto,
  GridAreaDto,
  MeteringPointDto,
  MeteringPointMeasureUnit,
  MeteringPointMetadataDto,
  MeteringPointSubType,
  Product,
  SettlementMethod,
  WashInstructions,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const childMeteringPoint = {
  __typename: 'MeteringPointDto',
  id: 4444444,
  isChild: true,
  isEnergySupplier: true,
  isGridAccessProvider: true,
  meteringPointId: '444444444444444444',
  relatedMeteringPoints: {
    __typename: 'RelatedMeteringPointsDto',
    current: {
      __typename: 'RelatedMeteringPointDto',
      id: 4444444,
      connectionState: ConnectionState.Connected,
      identification: '444444444444444444',
      type: ElectricityMarketMeteringPointType.ElectricalHeating,
      closedDownDate: null,
      connectionDate: new Date('2021-01-01'),
    },
    parent: {
      __typename: 'RelatedMeteringPointDto',
      id: 2222222,
      connectionState: ConnectionState.Connected,
      identification: '222222222222222222',
      type: ElectricityMarketMeteringPointType.Consumption,
      closedDownDate: null,
      connectionDate: new Date('2021-01-01'),
    },
    relatedMeteringPoints: [
      {
        __typename: 'RelatedMeteringPointDto',
        id: 3,
        connectionState: ConnectionState.Connected,
        identification: '333333333333333333',
        type: ElectricityMarketMeteringPointType.Exchange,
        closedDownDate: null,
        connectionDate: new Date('2024-01-01'),
      },
    ],
    relatedByGsrn: [
      {
        __typename: 'RelatedMeteringPointDto',
        id: 4,
        connectionState: ConnectionState.New,
        identification: '444444444444441111',
        type: ElectricityMarketMeteringPointType.ElectricalHeating,
        closedDownDate: null,
        connectionDate: new Date('2024-01-01'),
      },
    ],
    historicalMeteringPoints: [
      {
        __typename: 'RelatedMeteringPointDto',
        id: 5,
        connectionState: ConnectionState.ClosedDown,
        identification: '555555555555555555',
        type: ElectricityMarketMeteringPointType.ElectricalHeating,
        closedDownDate: new Date('2021-11-01'),
        connectionDate: new Date('2021-01-01'),
      },
    ],
    historicalMeteringPointsByGsrn: [
      {
        __typename: 'RelatedMeteringPointDto',
        id: 6,
        connectionState: ConnectionState.Disconnected,
        identification: '666666666666666666',
        type: ElectricityMarketMeteringPointType.ElectricalHeating,
        closedDownDate: null,
        connectionDate: new Date('2022-01-01'),
      },
    ],
  },
  commercialRelation: {
    __typename: 'CommercialRelationDto',
    energySupplier: '222222222222222222',
    energySupplierName: {
      __typename: 'ActorNameDto',
      value: 'Test Supplier',
    },
    id: 1,
    activeElectricalHeatingPeriods: {
      __typename: 'ElectricalHeatingDto',
      id: 1,
      validFrom: new Date('2021-01-01'),
    } as ElectricalHeatingDto,
    haveElectricalHeating: true,
    hadElectricalHeating: false,
    electricalHeatingPeriods: [],
    activeEnergySupplyPeriod: {
      __typename: 'EnergySupplyPeriodDto',
      id: 1,
      validFrom: new Date('2023-01-01'),
      customers: [
        {
          __typename: 'CustomerDto',
          id: 1,
          isProtectedName: true,
          cvr: null,
          name: 'Hr name',
          technicalContact: null,
          legalContact: {
            __typename: 'CustomerContactDto',
            id: 1,
            cityName: 'Hr City',
            darReference: '123456789',
            municipalityCode: '123',
            postBox: '1234',
            postCode: '1234',
            streetCode: '1234',
            buildingNumber: '4',
            streetName: 'Hr Street',
            countryCode: 'DK',
            isProtectedAddress: true,
            email: 'hr@name.dk',
            phone: '12345678',
          } as CustomerContactDto,
        },
        {
          __typename: 'CustomerDto',
          id: 2,
          isProtectedName: false,
          cvr: '12345678',
          name: 'Fru Name',
          legalContact: null,
          technicalContact: {
            __typename: 'CustomerContactDto',
            id: 2,
            cityName: 'Fru City',
            darReference: '987654321',
            municipalityCode: '987',
            postBox: '9876',
            postCode: '9876',
            streetCode: '9876',
            buildingNumber: '4',
            streetName: 'Fru Street',
            countryCode: 'DK',
            isProtectedAddress: false,
            email: 'fru@name.dk',
            phone: '87654321',
          } as CustomerContactDto,
        },
      ],
    } as EnergySupplyPeriodDto,
  } as unknown as CommercialRelationDto,
  metadata: {
    __typename: 'MeteringPointMetadataDto',
    id: 444444411,
    measureUnit: MeteringPointMeasureUnit.KWh,
    gridArea: {
      __typename: 'GridAreaDto',
      id: '1',
      displayName: '001',
    } as GridAreaDto,
    ownedBy: '',
    type: ElectricityMarketMeteringPointType.ElectricalHeating,
    subType: MeteringPointSubType.Physical,
    connectionState: ConnectionState.New,
    netSettlementGroup: 6,
    assetType: AssetType.CombustionEngineDiesel,
    connectionType: ConnectionType.Installation,
    disconnectionType: DisconnectionType.RemoteDisconnection,
    fromGridArea: {
      __typename: 'GridAreaDto',
      id: '2',
      displayName: '002',
    } as GridAreaDto,
    environmentalFriendly: true,
    meterNumber: '123456789',
    product: Product.FuelQuantity,
    resolution: 'PT15M',
    scheduledMeterReadingMonth: 1,
    toGridArea: {
      __typename: 'GridAreaDto',
      id: '3',
      displayName: '003',
    } as GridAreaDto,
    settlementMethod: SettlementMethod.FlexSettled,
    capacity: '100',
    powerLimitKw: 100,
    powerPlantGsrn: '1234567890',
    installationAddress: {
      __typename: 'InstallationAddressDto',
      id: 1,
      buildingNumber: '4',
      cityName: 'City',
      postCode: '5000',
      countryCode: 'DK',
      darReference: '123456789',
      washInstructions: WashInstructions.Washable,
      floor: '3',
      locationDescription: 'Location',
      municipalityCode: '123',
      citySubDivisionName: 'Subdivision name',
      room: 'th',
      streetCode: '44',
      streetName: 'Gade Vej Alle',
    },
  } as MeteringPointMetadataDto,
} as MeteringPointDto;
