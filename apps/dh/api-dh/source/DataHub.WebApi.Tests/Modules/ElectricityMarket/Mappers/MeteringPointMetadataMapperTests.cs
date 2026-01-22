// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System.Linq;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Shared;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;
using Xunit;
using static Energinet.DataHub.WebApi.Tests.Fixtures.MeteringPointConstants;
using AnnualDate = Energinet.DataHub.ElectricityMarket.Abstractions.Shared.AnnualDate;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Mappers;

public class MeteringPointMetadataMapperTests
{
    [Fact]
    public void MapToDto_MeteringPointDto_MapsAllProperties()
    {
        // Arrange
        var settlementDate = new AnnualDate(SettlementDateMonth, SettlementDateDay);

        var meteringPointPeriod = new MeteringPointDtoV1.MeteringPointPeriodDto(
            ValidFrom: _validFrom,
            ValidTo: _validTo,
            Type: MeteringPointType.Consumption,
            SubType: MeteringPointSubType.Physical,
            ConnectionState: ConnectionState.Connected,
            ConnectionType: ConnectionType.Direct,
            DisconnectionType: DisconnectionType.Remote,
            TimeResolution: TimeResolution.QuarterHourly,
            GridAreaId: GridAreaCode,
            ParentMeteringPointId: ParentId.ToString(),
            MeterId: MeterNumber,
            SettlementMethod: SettlementMethod.FlexSettled,
            Product: Product.EnergyActive,
            ProductObligation: true,
            AssetType: AssetType.WindTurbines,
            AssetCapacity: AssetCapacity,
            EnergyUnit: EnergyUnit.KWh,
            PowerLimitKw: PowerLimitKw,
            PowerLimitAmperes: PowerLimitAmperes,
            SettlementGroup: SettlementGroup.Six,
            SettlementDate: settlementDate,
            FromGridAreaId: FromGridAreaCode,
            ToGridAreaId: ToGridAreaCode,
            PowerPlantGsrn: PowerPlantGsrn.ToString(),
            new MeteringPointDtoV1.InstallationAddressDto(
                StreetCode: InstallationStreetCode,
                StreetName: InstallationStreetName,
                BuildingNumber: InstallationBuildingNumber,
                CityName: InstallationCityName,
                AdditionalCityName: InstallationAdditionalCityName,
                DarReference: InstallationDarReference,
                IsActualAddress: true,
                Floor: InstallationFloor,
                SuiteNumber: InstallationRoom,
                PostalCode: InstallationPostalCode,
                MunicipalityCode: InstallationMunicipalityCode,
                CountryCode: InstallationCountryCode,
                Remarks: InstallationRemarks));

        // Act
        var result = meteringPointPeriod.MapToDto();

        // Assert
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.True(result.Id > 0),
            () => Assert.Equal(_validFrom, result.ValidFrom),
            () => Assert.Equal(_validTo, result.ValidTo),
            () => Assert.Equal(ParentId.ToString(), result.ParentMeteringPoint),
            () => Assert.Equal(Clients.ElectricityMarket.v1.MeteringPointType.Consumption, result.Type),
            () => Assert.Equal(Clients.ElectricityMarket.v1.MeteringPointSubType.Physical, result.SubType),
            () => Assert.Equal(Clients.ElectricityMarket.v1.ConnectionState.Connected, result.ConnectionState),
            () => Assert.Equal(QuarterHourlyResolution, result.Resolution),
            () => Assert.Equal(GridAreaCode, result.GridAreaCode),
            () => Assert.Empty(result.OwnedBy),
            () => Assert.Equal(Clients.ElectricityMarket.v1.ConnectionType.Direct, result.ConnectionType),
            () => Assert.Equal(Clients.ElectricityMarket.v1.DisconnectionType.RemoteDisconnection, result.DisconnectionType),
            () => Assert.Equal(Clients.ElectricityMarket.v1.Product.EnergyActive, result.Product),
            () => Assert.True(result.ProductObligation),
            () => Assert.Equal(Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KWh, result.MeasureUnit),
            () => Assert.Equal(Clients.ElectricityMarket.v1.AssetType.WindTurbines, result.AssetType),
            () => Assert.Null(result.EnvironmentalFriendly),
            () => Assert.Equal(AssetCapacity.ToString(), result.Capacity),
            () => Assert.Equal((double)PowerLimitKw, result.PowerLimitKw),
            () => Assert.Equal(PowerLimitAmperes, result.PowerLimitAmp),
            () => Assert.Equal(MeterNumber, result.MeterNumber),
            () => Assert.Equal(SettlementGroupNumber, result.NetSettlementGroup),
            () => Assert.Null(result.ScheduledMeterReadingMonth),
            () => Assert.NotNull(result.ScheduledMeterReadingDate),
            () => Assert.Equal(SettlementDateMonth, result.ScheduledMeterReadingDate!.Month),
            () => Assert.Equal(SettlementDateDay, result.ScheduledMeterReadingDate!.Day),
            () => Assert.Equal(FromGridAreaCode, result.FromGridAreaCode),
            () => Assert.Equal(ToGridAreaCode, result.ToGridAreaCode),
            () => Assert.Equal(PowerPlantGsrn.ToString(), result.PowerPlantGsrn),
            () => Assert.Equal(Clients.ElectricityMarket.v1.SettlementMethod.FlexSettled, result.SettlementMethod),
            () => Assert.False(result.ManuallyHandled),
            () => Assert.NotNull(result.InstallationAddress),
            () => Assert.True(result.InstallationAddress!.Id > 0),
            () => Assert.Equal(InstallationStreetCode, result.InstallationAddress!.StreetCode),
            () => Assert.Equal(InstallationStreetName, result.InstallationAddress!.StreetName),
            () => Assert.Equal(InstallationBuildingNumber, result.InstallationAddress!.BuildingNumber),
            () => Assert.Equal(InstallationCityName, result.InstallationAddress!.CityName),
            () => Assert.Equal(InstallationAdditionalCityName, result.InstallationAddress!.CitySubDivisionName),
            () => Assert.Equal(InstallationDarReference, result.InstallationAddress!.DarReference),
            () => Assert.Equal(Clients.ElectricityMarket.v1.WashInstructions.Washable, result.InstallationAddress!.WashInstructions),
            () => Assert.Equal(InstallationCountryCode, result.InstallationAddress!.CountryCode),
            () => Assert.Equal(InstallationFloor, result.InstallationAddress!.Floor),
            () => Assert.Equal(InstallationRoom, result.InstallationAddress!.Room),
            () => Assert.Equal(InstallationPostalCode, result.InstallationAddress!.PostCode),
            () => Assert.Equal(InstallationMunicipalityCode, result.InstallationAddress!.MunicipalityCode),
            () => Assert.Equal(InstallationRemarks, result.InstallationAddress!.LocationDescription));
    }

    [Fact]
    public void MapToDto_CommercialRelation_MapsAllProperties()
    {
        // Arrange
        var legalContactAddress = CreateLegalContactAddress();
        var technicalContactAddress = CreateTechnicalContactAddress();
        var legalContact = CreateContact(CompanyName, CompanyCvr, false, RelationType.Juridical, legalContactAddress, null);
        var technicalContact = CreateContact(CompanyNameTwo, CompanyCvrTwo, true, RelationType.Technical, null, technicalContactAddress);

        var energySupplierPeriod = new MeteringPointDtoV1.EnergySupplierPeriodDto(
            _energySupplierValidFrom,
            _energySupplierValidTo,
            OrchestrationInstanceId,
            [legalContact, technicalContact]);

        var electricalHeatingPeriod = new MeteringPointDtoV1.ElectricalHeatingPeriodDto(
            _heatingValidFrom,
            _heatingValidTo);

        var commercialRelation = new MeteringPointDtoV1.CommercialRelationDto(
            _validFrom,
            _validTo,
            EnergySupplierId,
            energySupplierPeriod,
            electricalHeatingPeriod,
            [energySupplierPeriod],
            [electricalHeatingPeriod]);

        // Act
        var commercialRelationResult = commercialRelation.MapToDto();

        // Assert
        var legalCustomerResult = commercialRelationResult.ActiveEnergySupplyPeriod!.Customers.Single(c => c.RelationType == Clients.ElectricityMarket.v1.CustomerRelationType.Contact4);
        var technicalCustomerResult = commercialRelationResult.ActiveEnergySupplyPeriod!.Customers.Single(c => c.RelationType == Clients.ElectricityMarket.v1.CustomerRelationType.Contact1);

        // CommercialRelation
        Assert.Multiple(
            () => Assert.NotNull(commercialRelationResult),
            () => Assert.True(commercialRelationResult.Id > 0),
            () => Assert.Equal(_validFrom, commercialRelationResult.StartDate),
            () => Assert.Equal(_validTo, commercialRelationResult.EndDate),
            () => Assert.Equal(EnergySupplierId, commercialRelationResult.EnergySupplier),
            // EnergySupplyPeriod
            () => Assert.NotNull(commercialRelationResult.ActiveEnergySupplyPeriod),
            () => Assert.True(commercialRelationResult.ActiveEnergySupplyPeriod!.Id > 0),
            () => Assert.Equal(_energySupplierValidFrom, commercialRelationResult.ActiveEnergySupplyPeriod!.ValidFrom),
            () => Assert.Equal(_energySupplierValidTo, commercialRelationResult.ActiveEnergySupplyPeriod!.ValidTo),
            () => Assert.Equal(2, commercialRelationResult.ActiveEnergySupplyPeriod.Customers.Count),
            // Legal contact
            () => Assert.Null(legalCustomerResult.TechnicalContact),
            () => Assert.NotNull(legalCustomerResult.LegalContact),
            () => Assert.True(legalCustomerResult.Id > 0),
            () => Assert.Equal(CompanyName, legalCustomerResult.Name),
            () => Assert.Equal(CompanyCvr, legalCustomerResult.Cvr),
            () => Assert.False(legalCustomerResult.IsProtectedName),
            () => Assert.Equal(Clients.ElectricityMarket.v1.CustomerRelationType.Contact4, legalCustomerResult.RelationType),
            () => Assert.True(legalCustomerResult.LegalContact!.Id > 0),
            () => Assert.Equal(LegalContactName, legalCustomerResult.LegalContact!.Name),
            () => Assert.Equal(LegalContactEmail, legalCustomerResult.LegalContact!.Email),
            () => Assert.False(legalCustomerResult.LegalContact!.IsProtectedAddress),
            () => Assert.Equal(LegalContactPhone, legalCustomerResult.LegalContact!.Phone),
            () => Assert.Equal(LegalContactMobile, legalCustomerResult.LegalContact!.Mobile),
            () => Assert.Equal(LegalContactAttention, legalCustomerResult.LegalContact!.Attention),
            () => Assert.Equal(LegalContactStreetCode, legalCustomerResult.LegalContact!.StreetCode),
            () => Assert.Equal(LegalContactStreetName, legalCustomerResult.LegalContact!.StreetName),
            () => Assert.Equal(LegalContactBuildingNumber, legalCustomerResult.LegalContact!.BuildingNumber),
            () => Assert.Equal(LegalContactPostalCode, legalCustomerResult.LegalContact!.PostCode),
            () => Assert.Equal(LegalContactCityName, legalCustomerResult.LegalContact!.CityName),
            () => Assert.Equal(LegalContactAdditionalCityName, legalCustomerResult.LegalContact!.CitySubDivisionName),
            () => Assert.Equal(LegalDarReference, legalCustomerResult.LegalContact!.DarReference),
            () => Assert.Equal(LegalContactCountryCode, legalCustomerResult.LegalContact!.CountryCode),
            () => Assert.Equal(LegalContactFloor, legalCustomerResult.LegalContact!.Floor),
            () => Assert.Equal(LegalContactRoom, legalCustomerResult.LegalContact!.Room),
            () => Assert.Equal(LegalContactPoBox, legalCustomerResult.LegalContact!.PostBox),
            () => Assert.Equal(LegalContactMunicipalityCode, legalCustomerResult.LegalContact!.MunicipalityCode),
            // Technical contact
            () => Assert.Null(technicalCustomerResult.LegalContact),
            () => Assert.NotNull(technicalCustomerResult.TechnicalContact),
            () => Assert.True(technicalCustomerResult.Id > 0),
            () => Assert.Equal(CompanyNameTwo, technicalCustomerResult.Name),
            () => Assert.Equal(CompanyCvrTwo, technicalCustomerResult.Cvr),
            () => Assert.True(technicalCustomerResult.IsProtectedName),
            () => Assert.Equal(Clients.ElectricityMarket.v1.CustomerRelationType.Contact1, technicalCustomerResult.RelationType),
            () => Assert.True(technicalCustomerResult.TechnicalContact!.Id > 0),
            () => Assert.Equal(TechnicalContactName, technicalCustomerResult.TechnicalContact!.Name),
            () => Assert.Equal(TechnicalContactEmail, technicalCustomerResult.TechnicalContact!.Email),
            () => Assert.True(technicalCustomerResult.TechnicalContact!.IsProtectedAddress),
            () => Assert.Equal(TechnicalContactPhone, technicalCustomerResult.TechnicalContact!.Phone),
            () => Assert.Equal(TechnicalContactMobile, technicalCustomerResult.TechnicalContact!.Mobile),
            () => Assert.Equal(TechnicalContactAttention, technicalCustomerResult.TechnicalContact!.Attention),
            () => Assert.Equal(TechnicalContactStreetCode, technicalCustomerResult.TechnicalContact!.StreetCode),
            () => Assert.Equal(TechnicalContactStreetName, technicalCustomerResult.TechnicalContact!.StreetName),
            () => Assert.Equal(TechnicalContactBuildingNumber, technicalCustomerResult.TechnicalContact!.BuildingNumber),
            () => Assert.Equal(TechnicalContactPostalCode, technicalCustomerResult.TechnicalContact!.PostCode),
            () => Assert.Equal(TechnicalContactCityName, technicalCustomerResult.TechnicalContact!.CityName),
            () => Assert.Equal(TechnicalContactAdditionalCityName, technicalCustomerResult.TechnicalContact!.CitySubDivisionName),
            () => Assert.Equal(TechnicalDarReference, technicalCustomerResult.TechnicalContact!.DarReference),
            () => Assert.Equal(TechnicalContactCountryCode, technicalCustomerResult.TechnicalContact!.CountryCode),
            () => Assert.Equal(TechnicalContactFloor, technicalCustomerResult.TechnicalContact!.Floor),
            () => Assert.Equal(TechnicalContactRoom, technicalCustomerResult.TechnicalContact!.Room),
            () => Assert.Equal(TechnicalContactPoBox, technicalCustomerResult.TechnicalContact!.PostBox),
            () => Assert.Equal(TechnicalContactMunicipalityCode, technicalCustomerResult.TechnicalContact!.MunicipalityCode),
            // ElectricalHeatingPeriod
            () => Assert.NotNull(commercialRelationResult.ActiveElectricalHeatingPeriods),
            () => Assert.True(commercialRelationResult.ActiveElectricalHeatingPeriods!.Id > 0),
            () => Assert.Equal(_heatingValidFrom, commercialRelationResult.ActiveElectricalHeatingPeriods!.ValidFrom),
            () => Assert.Equal(_heatingValidTo, commercialRelationResult.ActiveElectricalHeatingPeriods!.ValidTo),
            () => Assert.False(commercialRelationResult.ActiveElectricalHeatingPeriods!.IsActive),
            () => Assert.Null(commercialRelationResult.ActiveElectricalHeatingPeriods!.TransactionType));
    }
}
