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
using static Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Mappers.MeteringPointConstants;
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
            _validFrom,
            _validTo,
            MeteringPointType.Consumption,
            MeteringPointSubType.Physical,
            ConnectionState.Connected,
            ConnectionType.Direct,
            DisconnectionType.Remote,
            TimeResolution.QuarterHourly,
            GridAreaCode,
            _parentId.ToString(),
            MeterNumber,
            SettlementMethod.FlexSettled,
            Product.EnergyActive,
            true,
            AssetType.WindTurbines,
            AssetCapacity,
            EnergyUnit.KWh,
            PowerLimitKw,
            PowerLimitAmperes,
            SettlementGroup.Six,
            settlementDate,
            FromGridAreaCode,
            ToGridAreaCode,
            _powerPlantGsrn.ToString(),
            new MeteringPointDtoV1.InstallationAddressDto(
                InstallationStreetCode,
                InstallationStreetName,
                InstallationBuildingNumber,
                InstallationCityName,
                InstallationAdditionalCityName,
                _installationDarReference,
                true,
                InstallationFloor,
                InstallationRoom,
                InstallationPostalCode,
                InstallationMunicipalityCode,
                InstallationCountryCode,
                InstallationRemarks));

        // Act
        var result = meteringPointPeriod.MapToDto();

        // Assert
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.True(result.Id > 0),
            () => Assert.Equal(_validFrom, result.ValidFrom),
            () => Assert.Equal(_validTo, result.ValidTo),
            () => Assert.Equal(_parentId.ToString(), result.ParentMeteringPoint),
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
            () => Assert.Equal(MeterNumber, result.MeterNumber),
            () => Assert.Equal(SettlementGroupNumber, result.NetSettlementGroup),
            () => Assert.Null(result.ScheduledMeterReadingMonth),
            () => Assert.NotNull(result.ScheduledMeterReadingDate),
            () => Assert.Equal(SettlementDateMonth, result.ScheduledMeterReadingDate!.Month),
            () => Assert.Equal(SettlementDateDay, result.ScheduledMeterReadingDate!.Day),
            () => Assert.Equal(FromGridAreaCode, result.FromGridAreaCode),
            () => Assert.Equal(ToGridAreaCode, result.ToGridAreaCode),
            () => Assert.Equal(_powerPlantGsrn.ToString(), result.PowerPlantGsrn),
            () => Assert.Equal(Clients.ElectricityMarket.v1.SettlementMethod.FlexSettled, result.SettlementMethod),
            () => Assert.False(result.ManuallyHandled),
            () => Assert.NotNull(result.InstallationAddress),
            () => Assert.True(result.InstallationAddress!.Id > 0),
            () => Assert.Equal(InstallationStreetCode, result.InstallationAddress!.StreetCode),
            () => Assert.Equal(InstallationStreetName, result.InstallationAddress!.StreetName),
            () => Assert.Equal(InstallationBuildingNumber, result.InstallationAddress!.BuildingNumber),
            () => Assert.Equal(InstallationCityName, result.InstallationAddress!.CityName),
            () => Assert.Equal(InstallationAdditionalCityName, result.InstallationAddress!.CitySubDivisionName),
            () => Assert.Equal(_installationDarReference, result.InstallationAddress!.DarReference),
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
        var legalContact = CreateLegalContactAddress();
        var technicalContact = CreateTechnicalContactAddress(isProtected: false, additionalCityName: null, postOfficeBox: null);
        var contact = CreateContact(CompanyName, CompanyCvr, false, RelationType.Juridical, legalContact, technicalContact);

        var energySupplierPeriod = new MeteringPointDtoV1.EnergySupplierPeriodDto(
            _energySupplierValidFrom,
            _energySupplierValidTo,
            _orchestrationInstanceId,
            [contact]);

        var electricalHeatingPeriod = new MeteringPointDtoV1.ElectricalHeatingPeriodDto(
            _heatingValidFrom,
            _heatingValidTo);

        var commercialRelation = new MeteringPointDtoV1.CommercialRelationDto(
            _validFrom,
            _validTo,
            EnergySupplierGln,
            energySupplierPeriod,
            electricalHeatingPeriod,
            [energySupplierPeriod],
            [electricalHeatingPeriod]);

        // Act
        var result = commercialRelation.MapToDto();

        // Assert
        var customer = result.ActiveEnergySupplyPeriod!.Customers.First();
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.True(result.Id > 0),
            () => Assert.Equal(EnergySupplierGln, result.EnergySupplier),
            () => Assert.Equal(_validFrom, result.StartDate),
            () => Assert.Equal(_validTo, result.EndDate),
            () => Assert.NotNull(result.ActiveEnergySupplyPeriod),
            () => Assert.True(result.ActiveEnergySupplyPeriod!.Id > 0),
            () => Assert.Equal(_energySupplierValidFrom, result.ActiveEnergySupplyPeriod!.ValidFrom),
            () => Assert.Equal(_energySupplierValidTo, result.ActiveEnergySupplyPeriod!.ValidTo),
            () => Assert.Single(result.ActiveEnergySupplyPeriod!.Customers),
            () => Assert.NotNull(customer),
            () => Assert.True(customer.Id > 0),
            () => Assert.Equal(CompanyName, customer.Name),
            () => Assert.Equal(CompanyCvr, customer.Cvr),
            () => Assert.False(customer.IsProtectedName),
            () => Assert.Equal(Clients.ElectricityMarket.v1.CustomerRelationType.Contact1, customer.RelationType),
            () => Assert.NotNull(customer.LegalContact),
            () => Assert.True(customer.LegalContact!.Id > 0),
            () => Assert.Equal(LegalContactName, customer.LegalContact!.Name),
            () => Assert.Equal(LegalContactEmail, customer.LegalContact!.Email),
            () => Assert.False(customer.LegalContact!.IsProtectedAddress),
            () => Assert.Equal(LegalContactPhone, customer.LegalContact!.Phone),
            () => Assert.Equal(LegalContactMobile, customer.LegalContact!.Mobile),
            () => Assert.Equal(LegalContactAttention, customer.LegalContact!.Attention),
            () => Assert.Equal(LegalContactStreetCode, customer.LegalContact!.StreetCode),
            () => Assert.Equal(LegalContactStreetName, customer.LegalContact!.StreetName),
            () => Assert.Equal(LegalContactBuildingNumber, customer.LegalContact!.BuildingNumber),
            () => Assert.Equal(LegalContactPostalCode, customer.LegalContact!.PostCode),
            () => Assert.Equal(LegalContactCityName, customer.LegalContact!.CityName),
            () => Assert.Equal(LegalContactAdditionalCityName, customer.LegalContact!.CitySubDivisionName),
            () => Assert.Equal(_legalDarReference, customer.LegalContact!.DarReference),
            () => Assert.Equal(LegalContactCountryCode, customer.LegalContact!.CountryCode),
            () => Assert.Equal(LegalContactFloor, customer.LegalContact!.Floor),
            () => Assert.Equal(LegalContactRoom, customer.LegalContact!.Room),
            () => Assert.Equal(LegalContactPoBox, customer.LegalContact!.PostBox),
            () => Assert.Equal(LegalContactMunicipalityCode, customer.LegalContact!.MunicipalityCode),
            () => Assert.NotNull(customer.TechnicalContact),
            () => Assert.True(customer.TechnicalContact!.Id > 0),
            () => Assert.Equal(TechnicalContactName, customer.TechnicalContact!.Name),
            () => Assert.Equal(TechnicalContactEmail, customer.TechnicalContact!.Email),
            () => Assert.False(customer.TechnicalContact!.IsProtectedAddress),
            () => Assert.Equal(TechnicalContactPhone, customer.TechnicalContact!.Phone),
            () => Assert.Equal(TechnicalContactMobile, customer.TechnicalContact!.Mobile),
            () => Assert.Equal(TechnicalContactAttention, customer.TechnicalContact!.Attention),
            () => Assert.Equal(TechnicalContactStreetCode, customer.TechnicalContact!.StreetCode),
            () => Assert.Equal(TechnicalContactStreetName, customer.TechnicalContact!.StreetName),
            () => Assert.Equal(TechnicalContactBuildingNumber, customer.TechnicalContact!.BuildingNumber),
            () => Assert.Equal(TechnicalContactPostalCode, customer.TechnicalContact!.PostCode),
            () => Assert.Equal(TechnicalContactCityName, customer.TechnicalContact!.CityName),
            () => Assert.Null(customer.TechnicalContact!.CitySubDivisionName),
            () => Assert.Equal(_technicalDarReference, customer.TechnicalContact!.DarReference),
            () => Assert.Equal(TechnicalContactCountryCode, customer.TechnicalContact!.CountryCode),
            () => Assert.Equal(TechnicalContactFloor, customer.TechnicalContact!.Floor),
            () => Assert.Equal(TechnicalContactRoom, customer.TechnicalContact!.Room),
            () => Assert.Null(customer.TechnicalContact!.PostBox),
            () => Assert.Equal(TechnicalContactMunicipalityCode, customer.TechnicalContact!.MunicipalityCode),
            () => Assert.NotNull(result.ActiveElectricalHeatingPeriods),
            () => Assert.True(result.ActiveElectricalHeatingPeriods!.Id > 0),
            () => Assert.Equal(_heatingValidFrom, result.ActiveElectricalHeatingPeriods!.ValidFrom),
            () => Assert.Equal(_heatingValidTo, result.ActiveElectricalHeatingPeriods!.ValidTo),
            () => Assert.False(result.ActiveElectricalHeatingPeriods!.IsActive),
            () => Assert.Null(result.ActiveElectricalHeatingPeriods!.TransactionType),
            () => Assert.Single(result.EnergySupplyPeriodTimeline),
            () => Assert.Equal(_energySupplierValidFrom, result.EnergySupplyPeriodTimeline.First().ValidFrom),
            () => Assert.Equal(_energySupplierValidTo, result.EnergySupplyPeriodTimeline.First().ValidTo),
            () => Assert.Single(result.ElectricalHeatingPeriods),
            () => Assert.Equal(_heatingValidFrom, result.ElectricalHeatingPeriods.First().ValidFrom),
            () => Assert.Equal(_heatingValidTo, result.ElectricalHeatingPeriods.First().ValidTo));
    }

    [Fact]
    public void MapToDto_EnergySupplierPeriod_MapsAllProperties()
    {
        // Arrange
        var legalContact = CreateLegalContactAddress();
        var technicalContact = CreateTechnicalContactAddress(isProtected: true);

        var contact1 = CreateContact(CompanyName, CompanyCvr, false, RelationType.Juridical, legalContact, technicalContact);
        var contact2 = CreateContact(SecondaryCompanyName, SecondaryCompanyCvr, true, RelationType.Technical, null, technicalContact);

        var energySupplierPeriod = new MeteringPointDtoV1.EnergySupplierPeriodDto(
            _energySupplierValidFrom,
            _energySupplierValidTo,
            _orchestrationInstanceId,
            [contact1, contact2]);

        // Act
        var result = energySupplierPeriod.MapToDto();

        // Assert
        var customer1 = result.Customers.First();
        var customer2 = result.Customers.Skip(1).First();
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.True(result.Id > 0),
            () => Assert.Equal(_energySupplierValidFrom, result.ValidFrom),
            () => Assert.Equal(_energySupplierValidTo, result.ValidTo),
            () => Assert.Equal(2, result.Customers.Count),
            () => Assert.NotNull(customer1),
            () => Assert.True(customer1.Id > 0),
            () => Assert.Equal(CompanyName, customer1.Name),
            () => Assert.Equal(CompanyCvr, customer1.Cvr),
            () => Assert.False(customer1.IsProtectedName),
            () => Assert.Equal(Clients.ElectricityMarket.v1.CustomerRelationType.Contact1, customer1.RelationType),
            () => Assert.NotNull(customer1.LegalContact),
            () => Assert.True(customer1.LegalContact!.Id > 0),
            () => Assert.Equal(LegalContactName, customer1.LegalContact!.Name),
            () => Assert.Equal(LegalContactEmail, customer1.LegalContact!.Email),
            () => Assert.False(customer1.LegalContact!.IsProtectedAddress),
            () => Assert.Equal(LegalContactPhone, customer1.LegalContact!.Phone),
            () => Assert.Equal(LegalContactMobile, customer1.LegalContact!.Mobile),
            () => Assert.Equal(LegalContactAttention, customer1.LegalContact!.Attention),
            () => Assert.Equal(LegalContactStreetCode, customer1.LegalContact!.StreetCode),
            () => Assert.Equal(LegalContactStreetName, customer1.LegalContact!.StreetName),
            () => Assert.Equal(LegalContactBuildingNumber, customer1.LegalContact!.BuildingNumber),
            () => Assert.Equal(LegalContactPostalCode, customer1.LegalContact!.PostCode),
            () => Assert.Equal(LegalContactCityName, customer1.LegalContact!.CityName),
            () => Assert.Equal(LegalContactAdditionalCityName, customer1.LegalContact!.CitySubDivisionName),
            () => Assert.Equal(_legalDarReference, customer1.LegalContact!.DarReference),
            () => Assert.Equal(LegalContactCountryCode, customer1.LegalContact!.CountryCode),
            () => Assert.Equal(LegalContactFloor, customer1.LegalContact!.Floor),
            () => Assert.Equal(LegalContactRoom, customer1.LegalContact!.Room),
            () => Assert.Equal(LegalContactPoBox, customer1.LegalContact!.PostBox),
            () => Assert.Equal(LegalContactMunicipalityCode, customer1.LegalContact!.MunicipalityCode),
            () => Assert.NotNull(customer1.TechnicalContact),
            () => Assert.True(customer1.TechnicalContact!.Id > 0),
            () => Assert.Equal(TechnicalContactName, customer1.TechnicalContact!.Name),
            () => Assert.Equal(TechnicalContactEmail, customer1.TechnicalContact!.Email),
            () => Assert.True(customer1.TechnicalContact!.IsProtectedAddress),
            () => Assert.Equal(TechnicalContactPhone, customer1.TechnicalContact!.Phone),
            () => Assert.Equal(TechnicalContactMobile, customer1.TechnicalContact!.Mobile),
            () => Assert.Equal(TechnicalContactAttention, customer1.TechnicalContact!.Attention),
            () => Assert.Equal(TechnicalContactStreetCode, customer1.TechnicalContact!.StreetCode),
            () => Assert.Equal(TechnicalContactStreetName, customer1.TechnicalContact!.StreetName),
            () => Assert.Equal(TechnicalContactBuildingNumber, customer1.TechnicalContact!.BuildingNumber),
            () => Assert.Equal(TechnicalContactPostalCode, customer1.TechnicalContact!.PostCode),
            () => Assert.Equal(TechnicalContactCityName, customer1.TechnicalContact!.CityName),
            () => Assert.Equal(TechnicalContactAdditionalCityName, customer1.TechnicalContact!.CitySubDivisionName),
            () => Assert.Equal(_technicalDarReference, customer1.TechnicalContact!.DarReference),
            () => Assert.Equal(TechnicalContactCountryCode, customer1.TechnicalContact!.CountryCode),
            () => Assert.Equal(TechnicalContactFloor, customer1.TechnicalContact!.Floor),
            () => Assert.Equal(TechnicalContactRoom, customer1.TechnicalContact!.Room),
            () => Assert.Null(customer1.TechnicalContact!.PostBox),
            () => Assert.Equal(TechnicalContactMunicipalityCode, customer1.TechnicalContact!.MunicipalityCode),
            () => Assert.NotNull(customer2),
            () => Assert.True(customer2.Id > 0),
            () => Assert.Equal(SecondaryCompanyName, customer2.Name),
            () => Assert.Equal(SecondaryCompanyCvr, customer2.Cvr),
            () => Assert.True(customer2.IsProtectedName),
            () => Assert.Equal(Clients.ElectricityMarket.v1.CustomerRelationType.Contact1, customer2.RelationType),
            () => Assert.Null(customer2.LegalContact),
            () => Assert.NotNull(customer2.TechnicalContact));
    }

    [Fact]
    public void MapToDto_ElectricalHeatingPeriod_MapsAllProperties()
    {
        // Arrange
        var electricalHeatingPeriod = new MeteringPointDtoV1.ElectricalHeatingPeriodDto(
            _heatingValidFrom,
            _heatingValidTo);

        // Act
        var result = electricalHeatingPeriod.MapToDto();

        // Assert
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.True(result.Id > 0),
            () => Assert.Equal(_heatingValidFrom, result.ValidFrom),
            () => Assert.Equal(_heatingValidTo, result.ValidTo),
            () => Assert.False(result.IsActive),
            () => Assert.Null(result.TransactionType));
    }

    private static MeteringPointDtoV1.ContactAddressDto CreateLegalContactAddress()
        => new(
            LegalContactName,
            LegalContactEmail,
            false,
            LegalContactPhone,
            LegalContactMobile,
            LegalContactAttention,
            LegalContactStreetCode,
            LegalContactStreetName,
            LegalContactBuildingNumber,
            LegalContactPostalCode,
            LegalContactCityName,
            LegalContactAdditionalCityName,
            _legalDarReference,
            LegalContactCountryCode,
            LegalContactFloor,
            LegalContactRoom,
            LegalContactPoBox,
            LegalContactMunicipalityCode);

    private static MeteringPointDtoV1.ContactAddressDto CreateTechnicalContactAddress(bool isProtected = false, string? additionalCityName = TechnicalContactAdditionalCityName, string? postOfficeBox = null)
        => new(
            TechnicalContactName,
            TechnicalContactEmail,
            isProtected,
            TechnicalContactPhone,
            TechnicalContactMobile,
            TechnicalContactAttention,
            TechnicalContactStreetCode,
            TechnicalContactStreetName,
            TechnicalContactBuildingNumber,
            TechnicalContactPostalCode,
            TechnicalContactCityName,
            additionalCityName,
            _technicalDarReference,
            TechnicalContactCountryCode,
            TechnicalContactFloor,
            TechnicalContactRoom,
            postOfficeBox,
            TechnicalContactMunicipalityCode);

    private static MeteringPointDtoV1.ContactDto CreateContact(
        string name,
        string cvr,
        bool isProtectedName,
        RelationType relationType,
        MeteringPointDtoV1.ContactAddressDto? legalContact,
        MeteringPointDtoV1.ContactAddressDto? technicalContact)
        => new(name, cvr, isProtectedName, relationType, legalContact, technicalContact);
}
