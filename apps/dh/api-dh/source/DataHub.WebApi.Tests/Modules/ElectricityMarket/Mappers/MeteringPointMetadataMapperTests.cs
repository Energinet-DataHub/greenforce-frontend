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
    public void MapToDto_MeteringPointDto_Em2_MapsAllProperties()
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
        var result = meteringPointPeriod.MapToDto(MeteringPointId);

        // Assert
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.NotEmpty(result.Id),
            () => Assert.Equal(_validFrom, result.ValidFrom),
            () => Assert.Equal(_validTo, result.ValidTo),
            () => Assert.Equal(ParentId.ToString(), result.ParentMeteringPoint),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.MeteringPointType.Consumption, result.Type),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.MeteringPointSubType.Physical, result.SubType),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.ConnectionState.Connected, result.ConnectionState),
            () => Assert.Equal(QuarterHourlyResolution, result.Resolution),
            () => Assert.Equal(GridAreaCode, result.GridAreaCode),
            () => Assert.Empty(result.OwnedBy),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.ConnectionType.Direct, result.ConnectionType),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.DisconnectionType.RemoteDisconnection, result.DisconnectionType),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.Product.EnergyActive, result.Product),
            () => Assert.True(result.ProductObligation),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.MeteringPointMeasureUnit.KWh, result.MeasureUnit),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.AssetType.WindTurbines, result.AssetType),
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
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.SettlementMethod.FlexSettled, result.SettlementMethod),
            () => Assert.False(result.ManuallyHandled),
            () => Assert.NotNull(result.InstallationAddress),
            () => Assert.NotEmpty(result.InstallationAddress!.Id),
            () => Assert.Equal(InstallationStreetCode, result.InstallationAddress!.StreetCode),
            () => Assert.Equal(InstallationStreetName, result.InstallationAddress!.StreetName),
            () => Assert.Equal(InstallationBuildingNumber, result.InstallationAddress!.BuildingNumber),
            () => Assert.Equal(InstallationCityName, result.InstallationAddress!.CityName),
            () => Assert.Equal(InstallationAdditionalCityName, result.InstallationAddress!.CitySubDivisionName),
            () => Assert.Equal(InstallationDarReference, result.InstallationAddress!.DarReference),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.WashInstructions.Washable, result.InstallationAddress!.WashInstructions),
            () => Assert.Equal(InstallationCountryCode, result.InstallationAddress!.CountryCode),
            () => Assert.Equal(InstallationFloor, result.InstallationAddress!.Floor),
            () => Assert.Equal(InstallationRoom, result.InstallationAddress!.Room),
            () => Assert.Equal(InstallationPostalCode, result.InstallationAddress!.PostCode),
            () => Assert.Equal(InstallationMunicipalityCode, result.InstallationAddress!.MunicipalityCode),
            () => Assert.Equal(InstallationRemarks, result.InstallationAddress!.LocationDescription));
    }

    [Fact]
    public void MapToDto_CommercialRelation_Em2_MapsAllProperties()
    {
        // Arrange
        var legalContactAddress = CreateLegalContactAddressEm2();
        var technicalContactAddress = CreateTechnicalContactAddressEm2();
        var legalContact = CreateContactEm2(CompanyName, CompanyCvr, false, RelationType.Juridical, legalContactAddress, null);
        var technicalContact = CreateContactEm2(CompanyNameTwo, CompanyCvrTwo, true, RelationType.Technical, null, technicalContactAddress);

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
        var commercialRelationResult = commercialRelation.MapToDto(MeteringPointId);

        // Assert
        var legalCustomerResult = commercialRelationResult.ActiveEnergySupplyPeriod!.Customers.Single(c => c.RelationType == WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact4);
        var technicalCustomerResult = commercialRelationResult.ActiveEnergySupplyPeriod!.Customers.Single(c => c.RelationType == WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact1);

        // CommercialRelation
        Assert.Multiple(
            () => Assert.NotNull(commercialRelationResult),
            () => Assert.NotEmpty(commercialRelationResult.Id),
            () => Assert.Equal(_validFrom, commercialRelationResult.StartDate),
            () => Assert.Equal(_validTo, commercialRelationResult.EndDate),
            () => Assert.Equal(EnergySupplierId, commercialRelationResult.EnergySupplier),
            // EnergySupplyPeriod
            () => Assert.NotNull(commercialRelationResult.ActiveEnergySupplyPeriod),
            () => Assert.NotEmpty(commercialRelationResult.ActiveEnergySupplyPeriod!.Id),
            () => Assert.Equal(_energySupplierValidFrom, commercialRelationResult.ActiveEnergySupplyPeriod!.ValidFrom),
            () => Assert.Equal(_energySupplierValidTo, commercialRelationResult.ActiveEnergySupplyPeriod!.ValidTo),
            () => Assert.Equal(2, commercialRelationResult.ActiveEnergySupplyPeriod.Customers.Count),
            // Legal contact
            () => Assert.Null(legalCustomerResult.TechnicalContact),
            () => Assert.NotNull(legalCustomerResult.LegalContact),
            () => Assert.NotEmpty(legalCustomerResult.Id),
            () => Assert.Equal(CompanyName, legalCustomerResult.Name),
            () => Assert.Equal(CompanyCvr, legalCustomerResult.Cvr),
            () => Assert.False(legalCustomerResult.IsProtectedName),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact4, legalCustomerResult.RelationType),
            () => Assert.NotEmpty(legalCustomerResult.LegalContact!.Id),
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
            () => Assert.NotEmpty(technicalCustomerResult.Id),
            () => Assert.Equal(CompanyNameTwo, technicalCustomerResult.Name),
            () => Assert.Equal(CompanyCvrTwo, technicalCustomerResult.Cvr),
            () => Assert.True(technicalCustomerResult.IsProtectedName),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact1, technicalCustomerResult.RelationType),
            () => Assert.NotEmpty(technicalCustomerResult.TechnicalContact!.Id),
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
            () => Assert.NotEmpty(commercialRelationResult.ActiveElectricalHeatingPeriods!.Id),
            () => Assert.Equal(_heatingValidFrom, commercialRelationResult.ActiveElectricalHeatingPeriods!.ValidFrom),
            () => Assert.Equal(_heatingValidTo, commercialRelationResult.ActiveElectricalHeatingPeriods!.ValidTo),
            () => Assert.False(commercialRelationResult.ActiveElectricalHeatingPeriods!.IsActive),
            () => Assert.Null(commercialRelationResult.ActiveElectricalHeatingPeriods!.TransactionType));
    }

    [Fact]
    public void MapToDto_EnergySupplierPeriod_Em2_GeneratesUniqueIdsForCustomerAndContacts()
    {
        // Arrange
        var legalContactAddress = CreateLegalContactAddressEm2();
        var technicalContactAddress = CreateTechnicalContactAddressEm2();
        var contact = CreateContactEm2(CompanyName, CompanyCvr, false, RelationType.Juridical, legalContactAddress, technicalContactAddress);

        var energySupplierPeriod = new MeteringPointDtoV1.EnergySupplierPeriodDto(
            _energySupplierValidFrom,
            _energySupplierValidTo,
            OrchestrationInstanceId,
            [contact]);

        var commercialRelation = new MeteringPointDtoV1.CommercialRelationDto(
            _validFrom,
            _validTo,
            EnergySupplierId,
            energySupplierPeriod,
            null,
            [energySupplierPeriod],
            []);

        // Act
        var result = commercialRelation.MapToDto(MeteringPointId);

        // Assert
        var customer = result.ActiveEnergySupplyPeriod!.Customers.First();
        var customerId = customer.Id;
        var legalContactId = customer.LegalContact?.Id;
        var technicalContactId = customer.TechnicalContact?.Id;

        Assert.Multiple(
            () => Assert.NotNull(customerId),
            () => Assert.NotNull(legalContactId),
            () => Assert.NotNull(technicalContactId),
            () => Assert.NotEqual(customerId, legalContactId),
            () => Assert.NotEqual(customerId, technicalContactId),
            () => Assert.NotEqual(legalContactId, technicalContactId));
    }

    [Fact]
    public void MapToDto_MultipleEnergySupplierPeriods_Em2_GeneratesUniqueIdsAcrossPeriods()
    {
        // Arrange
        var legalContactAddress = CreateLegalContactAddressEm2();
        var technicalContactAddress = CreateTechnicalContactAddressEm2();

        var contact1 = CreateContactEm2(CompanyName, CompanyCvr, false, RelationType.Juridical, legalContactAddress, null);
        var energySupplierPeriod1 = new MeteringPointDtoV1.EnergySupplierPeriodDto(
            _energySupplierValidFrom,
            _energySupplierValidTo,
            OrchestrationInstanceId,
            [contact1]);

        var contact2 = CreateContactEm2(CompanyNameTwo, CompanyCvrTwo, true, RelationType.Technical, null, technicalContactAddress);
        var energySupplierPeriod2 = new MeteringPointDtoV1.EnergySupplierPeriodDto(
            _validFrom,
            _validTo,
            OrchestrationInstanceId,
            [contact2]);

        var commercialRelation = new MeteringPointDtoV1.CommercialRelationDto(
            _validFrom,
            _validTo,
            EnergySupplierId,
            energySupplierPeriod1,
            null,
            [energySupplierPeriod1, energySupplierPeriod2],
            []);

        // Act
        var result = commercialRelation.MapToDto(MeteringPointId);

        var periods = result.EnergySupplyPeriodTimeline.ToList();
        var customer1 = periods[0].Customers.First();
        var customer2 = periods[1].Customers.First();

        Assert.Multiple(
            () => Assert.NotNull(customer1.Id),
            () => Assert.NotNull(customer2.Id),
            () => Assert.NotEqual(customer1.Id, customer2.Id));
    }

    [Fact]
    public void MapToDto_MeteringPointDto_Em1_MapsAllProperties()
    {
        // Arrange
        var settlementDate = new Clients.ElectricityMarket.v1.AnnualDate { Month = SettlementDateMonth, Day = SettlementDateDay };

        var meteringPointPeriod = new Clients.ElectricityMarket.v1.MeteringPointMetadataDto
        {
            Id = 77777777,
            ValidFrom = _validFrom,
            ValidTo = _validTo,
            Type = Clients.ElectricityMarket.v1.MeteringPointType.Consumption,
            SubType = Clients.ElectricityMarket.v1.MeteringPointSubType.Physical,
            ConnectionState = Clients.ElectricityMarket.v1.ConnectionState.Connected,
            ConnectionType = Clients.ElectricityMarket.v1.ConnectionType.Direct,
            DisconnectionType = Clients.ElectricityMarket.v1.DisconnectionType.RemoteDisconnection,
            Resolution = "PT15M",
            GridAreaCode = GridAreaCode,
            ParentMeteringPoint = ParentId.ToString(),
            MeterNumber = MeterNumber,
            SettlementMethod = Clients.ElectricityMarket.v1.SettlementMethod.FlexSettled,
            Product = Clients.ElectricityMarket.v1.Product.EnergyActive,
            ProductObligation = true,
            AssetType = Clients.ElectricityMarket.v1.AssetType.WindTurbines,
            Capacity = AssetCapacity.ToString(),
            MeasureUnit = Clients.ElectricityMarket.v1.MeteringPointMeasureUnit.KWh,
            PowerLimitKw = (double?)PowerLimitKw,
            PowerLimitAmp = PowerLimitAmperes,
            NetSettlementGroup = 6,
            ScheduledMeterReadingDate = settlementDate,
            ScheduledMeterReadingMonth = settlementDate.Month,
            FromGridAreaCode = FromGridAreaCode,
            ToGridAreaCode = ToGridAreaCode,
            PowerPlantGsrn = PowerPlantGsrn.ToString(),
            EnvironmentalFriendly = true,
            ManuallyHandled = true,
            OwnedBy = OwnedBy,
            InstallationAddress = new Clients.ElectricityMarket.v1.InstallationAddressDto
            {
                Id = 77778888,
                StreetCode = InstallationStreetCode,
                StreetName = InstallationStreetName,
                BuildingNumber = InstallationBuildingNumber,
                CityName = InstallationCityName,
                CitySubDivisionName = InstallationAdditionalCityName,
                DarReference = InstallationDarReference,
                WashInstructions = Clients.ElectricityMarket.v1.WashInstructions.Washable,
                Floor = InstallationFloor,
                Room = InstallationRoom,
                PostCode = InstallationPostalCode,
                MunicipalityCode = InstallationMunicipalityCode,
                CountryCode = InstallationCountryCode,
                LocationDescription = InstallationRemarks,
            },
        };

        // Act
        var result = meteringPointPeriod.MapToDto();

        // Assert
        Assert.Multiple(
            () => Assert.NotNull(result),
            () => Assert.Equal(meteringPointPeriod.Id.ToString(), result.Id),
            () => Assert.Equal(_validFrom, result.ValidFrom),
            () => Assert.Equal(_validTo, result.ValidTo),
            () => Assert.Equal(ParentId.ToString(), result.ParentMeteringPoint),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.MeteringPointType.Consumption, result.Type),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.MeteringPointSubType.Physical, result.SubType),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.ConnectionState.Connected, result.ConnectionState),
            () => Assert.Equal(QuarterHourlyResolution, result.Resolution),
            () => Assert.Equal(GridAreaCode, result.GridAreaCode),
            () => Assert.Equal(OwnedBy, result.OwnedBy),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.ConnectionType.Direct, result.ConnectionType),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.DisconnectionType.RemoteDisconnection, result.DisconnectionType),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.Product.EnergyActive, result.Product),
            () => Assert.True(result.ProductObligation),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.MeteringPointMeasureUnit.KWh, result.MeasureUnit),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.AssetType.WindTurbines, result.AssetType),
            () => Assert.True(result.EnvironmentalFriendly),
            () => Assert.Equal(AssetCapacity.ToString(), result.Capacity),
            () => Assert.Equal((double)PowerLimitKw, result.PowerLimitKw),
            () => Assert.Equal(PowerLimitAmperes, result.PowerLimitAmp),
            () => Assert.Equal(MeterNumber, result.MeterNumber),
            () => Assert.Equal(SettlementGroupNumber, result.NetSettlementGroup),
            () => Assert.Equal(settlementDate.Month, result.ScheduledMeterReadingMonth),
            () => Assert.NotNull(result.ScheduledMeterReadingDate),
            () => Assert.Equal(SettlementDateMonth, result.ScheduledMeterReadingDate!.Month),
            () => Assert.Equal(SettlementDateDay, result.ScheduledMeterReadingDate!.Day),
            () => Assert.Equal(FromGridAreaCode, result.FromGridAreaCode),
            () => Assert.Equal(ToGridAreaCode, result.ToGridAreaCode),
            () => Assert.Equal(PowerPlantGsrn.ToString(), result.PowerPlantGsrn),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.SettlementMethod.FlexSettled, result.SettlementMethod),
            () => Assert.True(result.ManuallyHandled),
            () => Assert.NotNull(result.InstallationAddress),
            () => Assert.Equal(meteringPointPeriod.InstallationAddress.Id.ToString(), result.InstallationAddress!.Id),
            () => Assert.Equal(InstallationStreetCode, result.InstallationAddress!.StreetCode),
            () => Assert.Equal(InstallationStreetName, result.InstallationAddress!.StreetName),
            () => Assert.Equal(InstallationBuildingNumber, result.InstallationAddress!.BuildingNumber),
            () => Assert.Equal(InstallationCityName, result.InstallationAddress!.CityName),
            () => Assert.Equal(InstallationAdditionalCityName, result.InstallationAddress!.CitySubDivisionName),
            () => Assert.Equal(InstallationDarReference, result.InstallationAddress!.DarReference),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.WashInstructions.Washable, result.InstallationAddress!.WashInstructions),
            () => Assert.Equal(InstallationCountryCode, result.InstallationAddress!.CountryCode),
            () => Assert.Equal(InstallationFloor, result.InstallationAddress!.Floor),
            () => Assert.Equal(InstallationRoom, result.InstallationAddress!.Room),
            () => Assert.Equal(InstallationPostalCode, result.InstallationAddress!.PostCode),
            () => Assert.Equal(InstallationMunicipalityCode, result.InstallationAddress!.MunicipalityCode),
            () => Assert.Equal(InstallationRemarks, result.InstallationAddress!.LocationDescription));
    }

    [Fact]
    public void MapToDto_CommercialRelation_Em1_MapsAllProperties()
    {
        // Arrange
        var legalContactAddress = CreateLegalContactAddressEm1();
        var technicalContactAddress = CreateTechnicalContactAddressEm1();
        var legalContact = CreateContactEm1(CompanyName, CompanyCvr, false, Clients.ElectricityMarket.v1.CustomerRelationType.Contact4, legalContactAddress, null);
        var technicalContact = CreateContactEm1(CompanyNameTwo, CompanyCvrTwo, true, Clients.ElectricityMarket.v1.CustomerRelationType.Contact1, null, technicalContactAddress);

        var energySupplierPeriod = new Clients.ElectricityMarket.v1.EnergySupplyPeriodDto
        {
            Id = 11113333,
            ValidFrom = _energySupplierValidFrom,
            ValidTo = _energySupplierValidTo,
            Customers = [legalContact, technicalContact],
        };

        var electricalHeatingPeriod = new Clients.ElectricityMarket.v1.ElectricalHeatingDto
        {
            Id = 11112222,
            ValidFrom = _heatingValidFrom,
            ValidTo = _heatingValidTo,
            IsActive = true,
            TransactionType = Clients.ElectricityMarket.v1.TransactionType.ChangeMeter,
        };

        var commercialRelation = new Clients.ElectricityMarket.v1.CommercialRelationDto
        {
            Id = 11111111,
            StartDate = _validFrom,
            EndDate = _validTo,
            EnergySupplier = EnergySupplierId,
            ActiveEnergySupplyPeriod = energySupplierPeriod,
            ActiveElectricalHeatingPeriods = electricalHeatingPeriod,
            EnergySupplyPeriodTimeline = [energySupplierPeriod],
            ElectricalHeatingPeriods = [electricalHeatingPeriod],
        };

        // Act
        var commercialRelationResult = commercialRelation.MapToDto();

        // Assert
        var legalCustomerResult = commercialRelationResult.ActiveEnergySupplyPeriod!.Customers.Single(c => c.RelationType == WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact4);
        var technicalCustomerResult = commercialRelationResult.ActiveEnergySupplyPeriod!.Customers.Single(c => c.RelationType == WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact1);

        // CommercialRelation
        Assert.Multiple(
            () => Assert.NotNull(commercialRelationResult),
            () => Assert.Equal(commercialRelation.Id.ToString(), commercialRelationResult.Id),
            () => Assert.Equal(_validFrom, commercialRelationResult.StartDate),
            () => Assert.Equal(_validTo, commercialRelationResult.EndDate),
            () => Assert.Equal(EnergySupplierId, commercialRelationResult.EnergySupplier),
            // EnergySupplyPeriod
            () => Assert.NotNull(commercialRelationResult.ActiveEnergySupplyPeriod),
            () => Assert.Equal(energySupplierPeriod.Id.ToString(), commercialRelationResult.ActiveEnergySupplyPeriod!.Id),
            () => Assert.Equal(_energySupplierValidFrom, commercialRelationResult.ActiveEnergySupplyPeriod!.ValidFrom),
            () => Assert.Equal(_energySupplierValidTo, commercialRelationResult.ActiveEnergySupplyPeriod!.ValidTo),
            () => Assert.Equal(2, commercialRelationResult.ActiveEnergySupplyPeriod.Customers.Count),
            // Legal contact
            () => Assert.Null(legalCustomerResult.TechnicalContact),
            () => Assert.NotNull(legalCustomerResult.LegalContact),
            () => Assert.Equal(legalContact.Id.ToString(), legalCustomerResult.Id),
            () => Assert.Equal(CompanyName, legalCustomerResult.Name),
            () => Assert.Equal(CompanyCvr, legalCustomerResult.Cvr),
            () => Assert.False(legalCustomerResult.IsProtectedName),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact4, legalCustomerResult.RelationType),
            () => Assert.Equal(legalContact.LegalContact!.Id.ToString(), legalCustomerResult.LegalContact!.Id),
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
            () => Assert.Equal(technicalContact.Id.ToString(), technicalCustomerResult.Id),
            () => Assert.Equal(CompanyNameTwo, technicalCustomerResult.Name),
            () => Assert.Equal(CompanyCvrTwo, technicalCustomerResult.Cvr),
            () => Assert.True(technicalCustomerResult.IsProtectedName),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.CustomerRelationType.Contact1, technicalCustomerResult.RelationType),
            () => Assert.Equal(technicalContact.TechnicalContact!.Id.ToString(), technicalCustomerResult.TechnicalContact!.Id),
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
            () => Assert.Equal(electricalHeatingPeriod.Id.ToString(), commercialRelationResult.ActiveElectricalHeatingPeriods!.Id),
            () => Assert.Equal(_heatingValidFrom, commercialRelationResult.ActiveElectricalHeatingPeriods!.ValidFrom),
            () => Assert.Equal(_heatingValidTo, commercialRelationResult.ActiveElectricalHeatingPeriods!.ValidTo),
            () => Assert.True(commercialRelationResult.ActiveElectricalHeatingPeriods!.IsActive),
            () => Assert.Equal(WebApi.Modules.ElectricityMarket.MeteringPoint.Models.TransactionType.ChangeMeter, commercialRelationResult.ActiveElectricalHeatingPeriods!.TransactionType));
    }
}
