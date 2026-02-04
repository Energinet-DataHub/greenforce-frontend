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

using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Helpers;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

/// <summary>
/// Exposes methods to map EM1 and EM2 `MeteringPoint` models (DTOs) to a common `MeteringPoint` representation used by the BFF and UI.
/// </summary>
public static class MeteringPointMetadataMapper
{
    public static MeteringPointMetadataDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.MeteringPointPeriodDto meteringPoint, string meteringPointId)
    {
        return new MeteringPointMetadataDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, meteringPoint.ValidFrom, meteringPoint.ValidTo),
            ValidFrom = meteringPoint.ValidFrom,
            ValidTo = meteringPoint.ValidTo,
            ParentMeteringPoint = meteringPoint.ParentMeteringPointId?.ToString(),
            Type = meteringPoint.Type.MapToDto(),
            SubType = meteringPoint.SubType.MapToDto(),
            ConnectionState = meteringPoint.ConnectionState.MapToDto(),
            Resolution = meteringPoint.TimeResolution.MapToDto(),
            GridAreaCode = meteringPoint.GridAreaId,
            OwnedBy = string.Empty,
            ConnectionType = meteringPoint.ConnectionType?.MapToDto(),
            DisconnectionType = meteringPoint.DisconnectionType?.MapToDto(),
            Product = meteringPoint.Product.MapToDto(),
            ProductObligation = meteringPoint.ProductObligation,
            MeasureUnit = meteringPoint.EnergyUnit.MapToDto(),
            AssetType = meteringPoint.AssetType?.MapToDto(),
            EnvironmentalFriendly = null,
            Capacity = meteringPoint.AssetCapacity.ToString(),
            PowerLimitKw = (double?)meteringPoint.PowerLimitKw,
            PowerLimitAmp = meteringPoint.PowerLimitAmperes,
            MeterNumber = meteringPoint.MeterId,
            NetSettlementGroup = meteringPoint.SettlementGroup?.MapToDto(),
            ScheduledMeterReadingMonth = null,
            ScheduledMeterReadingDate = meteringPoint.SettlementDate is not null ? new AnnualDate { Month = meteringPoint.SettlementDate.Month, Day = meteringPoint.SettlementDate.Day } : null,
            FromGridAreaCode = meteringPoint.FromGridAreaId,
            ToGridAreaCode = meteringPoint.ToGridAreaId,
            PowerPlantGsrn = meteringPoint.PowerPlantGsrn?.ToString(),
            SettlementMethod = meteringPoint.SettlementMethod?.MapToDto(),
            InstallationAddress = meteringPoint.InstallationAddress?.MapToDto(meteringPointId),
            ManuallyHandled = false,
        };
    }

    public static MeteringPointMetadataDto MapToDto(this Clients.ElectricityMarket.v1.MeteringPointMetadataDto meteringPoint)
    {
        return new MeteringPointMetadataDto
        {
            Id = meteringPoint.Id.ToString(),
            ValidFrom = meteringPoint.ValidFrom,
            ValidTo = meteringPoint.ValidTo,
            ParentMeteringPoint = meteringPoint.ParentMeteringPoint,
            Type = meteringPoint.Type.MapToDto(),
            SubType = meteringPoint.SubType?.MapToDto(),
            ConnectionState = meteringPoint.ConnectionState?.MapToDto(),
            Resolution = meteringPoint.Resolution,
            GridAreaCode = meteringPoint.GridAreaCode,
            OwnedBy = meteringPoint.OwnedBy,
            ConnectionType = meteringPoint.ConnectionType?.MapToDto(),
            DisconnectionType = meteringPoint.DisconnectionType?.MapToDto(),
            Product = meteringPoint.Product?.MapToDto(),
            ProductObligation = meteringPoint.ProductObligation,
            MeasureUnit = meteringPoint.MeasureUnit.MapToDto(),
            AssetType = meteringPoint.AssetType?.MapToDto(),
            EnvironmentalFriendly = meteringPoint.EnvironmentalFriendly,
            Capacity = meteringPoint.Capacity,
            PowerLimitKw = meteringPoint.PowerLimitKw,
            MeterNumber = meteringPoint.MeterNumber,
            NetSettlementGroup = meteringPoint.NetSettlementGroup,
            ScheduledMeterReadingMonth = meteringPoint.ScheduledMeterReadingMonth,
            ScheduledMeterReadingDate = meteringPoint.ScheduledMeterReadingDate is not null ? new AnnualDate { Month = meteringPoint.ScheduledMeterReadingDate.Month, Day = meteringPoint.ScheduledMeterReadingDate.Day } : null,
            FromGridAreaCode = meteringPoint.FromGridAreaCode,
            ToGridAreaCode = meteringPoint.ToGridAreaCode,
            PowerPlantGsrn = meteringPoint.PowerPlantGsrn?.ToString(),
            SettlementMethod = meteringPoint.SettlementMethod?.MapToDto(),
            InstallationAddress = meteringPoint.InstallationAddress?.MapToDto(),
            ManuallyHandled = meteringPoint.ManuallyHandled,
            PowerLimitAmp = meteringPoint.PowerLimitAmp,
        };
    }

    public static CommercialRelationDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.CommercialRelationDto commercialRelation, string meteringPointId)
    {
        return new CommercialRelationDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, commercialRelation.ValidFrom, commercialRelation.ValidTo),
            EnergySupplier = commercialRelation.EnergySupplierId,
            StartDate = commercialRelation.ValidFrom,
            EndDate = commercialRelation.ValidTo,
            ActiveEnergySupplyPeriod = commercialRelation.ActiveEnergySupplyPeriod?.MapToDto(meteringPointId),
            EnergySupplyPeriodTimeline = [.. commercialRelation.EnergySupplierPeriods.Select(e => e.MapToDto(meteringPointId))],
            ActiveElectricalHeatingPeriods = commercialRelation.ActiveElectricalHeatingPeriod?.MapToDto(meteringPointId),
            ElectricalHeatingPeriods = [.. commercialRelation.ElectricalHeatingPeriods.Select(e => e.MapToDto(meteringPointId))],
        };
    }

    public static CommercialRelationDto MapToDto(this Clients.ElectricityMarket.v1.CommercialRelationDto commercialRelation)
    {
        return new CommercialRelationDto
        {
            Id = commercialRelation.Id.ToString(),
            EnergySupplier = commercialRelation.EnergySupplier,
            StartDate = commercialRelation.StartDate,
            EndDate = commercialRelation.EndDate,
            ActiveEnergySupplyPeriod = commercialRelation.ActiveEnergySupplyPeriod?.MapToDto(),
            EnergySupplyPeriodTimeline = [.. commercialRelation.EnergySupplyPeriodTimeline.Select(e => e.MapToDto())],
            ActiveElectricalHeatingPeriods = commercialRelation.ActiveElectricalHeatingPeriods?.MapToDto(),
            ElectricalHeatingPeriods = [.. commercialRelation.ElectricalHeatingPeriods.Select(e => e.MapToDto())],
        };
    }

    private static EnergySupplyPeriodDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.EnergySupplierPeriodDto energySupplierPeriod, string meteringPointId)
    {
        var encodedId = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, energySupplierPeriod.ValidFrom, energySupplierPeriod.ValidTo);
        return new EnergySupplyPeriodDto
        {
            Id = encodedId,
            ValidFrom = energySupplierPeriod.ValidFrom,
            ValidTo = energySupplierPeriod.ValidTo,
            Customers = [.. energySupplierPeriod.Contacts.Select((c, index) => c.MapToDto(encodedId, index + 1))],
        };
    }

    private static EnergySupplyPeriodDto MapToDto(this Clients.ElectricityMarket.v1.EnergySupplyPeriodDto energySupplierPeriod)
    {
        return new EnergySupplyPeriodDto
        {
            Id = energySupplierPeriod.Id.ToString(),
            ValidFrom = energySupplierPeriod.ValidFrom,
            ValidTo = energySupplierPeriod.ValidTo,
            Customers = [.. energySupplierPeriod.Customers.Select(c => c.MapToDto())],
        };
    }

    private static ElectricalHeatingDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ElectricalHeatingPeriodDto electricalHeatingPeriod, string meteringPointId)
    {
        return new ElectricalHeatingDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, electricalHeatingPeriod.ValidFrom, electricalHeatingPeriod.ValidTo),
            ValidFrom = electricalHeatingPeriod.ValidFrom,
            ValidTo = electricalHeatingPeriod.ValidTo,
            IsActive = false, // TODO: We don't have this value from the backend yet
            TransactionType = null, // TODO: We don't have this value from the backend yet
        };
    }

    private static ElectricalHeatingDto MapToDto(this Clients.ElectricityMarket.v1.ElectricalHeatingDto electricalHeatingPeriod)
    {
        return new ElectricalHeatingDto
        {
            Id = electricalHeatingPeriod.Id.ToString(),
            ValidFrom = electricalHeatingPeriod.ValidFrom,
            ValidTo = electricalHeatingPeriod.ValidTo,
            IsActive = electricalHeatingPeriod.IsActive,
            TransactionType = electricalHeatingPeriod.TransactionType?.MapToDto(),
        };
    }

    private static CustomerDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ContactDto contactDto, string meteringPointId, int index)
    {
        return new CustomerDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, "Cus" + index),
            Name = contactDto.Name ?? string.Empty,
            Cvr = contactDto.Cvr,
            IsProtectedName = contactDto.IsProtectedName,
            RelationType = contactDto.RelationType.MapToDto(),
            LegalContact = contactDto.LegalContact?.MapToDto(meteringPointId, $"legal-{index}"),
            TechnicalContact = contactDto.TechnicalContact?.MapToDto(meteringPointId, $"technical-{index}"),
        };
    }

    private static CustomerDto MapToDto(this Clients.ElectricityMarket.v1.CustomerDto customerDto)
    {
        return new CustomerDto
        {
            Id = customerDto.Id.ToString(),
            Name = customerDto.Name,
            Cvr = customerDto.Cvr,
            IsProtectedName = customerDto.IsProtectedName,
            RelationType = customerDto.RelationType.MapToDto(),
            LegalContact = customerDto.LegalContact?.MapToDto(),
            TechnicalContact = customerDto.TechnicalContact?.MapToDto(),
        };
    }

    private static CustomerContactDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ContactAddressDto contactDto, string meteringPointId, string index)
    {
        return new CustomerContactDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, "CusCon" + index),
            Name = contactDto.Name,
            Email = contactDto.Email,
            IsProtectedAddress = contactDto.IsProtected,
            Phone = contactDto.Phone,
            Mobile = contactDto.Mobile,
            Attention = contactDto.Attention,
            StreetCode = contactDto.StreetCode,
            StreetName = contactDto.StreetName,
            BuildingNumber = contactDto.BuildingNumber,
            PostCode = contactDto.PostalCode,
            CityName = contactDto.CityName,
            CitySubDivisionName = contactDto.AdditionalCityName,
            DarReference = contactDto.DarReference,
            CountryCode = contactDto.CountryCode,
            Floor = contactDto.Floor,
            Room = contactDto.Room,
            PostBox = contactDto.PoBox,
            MunicipalityCode = contactDto.MunicipalityCode,
        };
    }

    private static CustomerContactDto MapToDto(this Clients.ElectricityMarket.v1.CustomerContactDto customerContactDto)
    {
        return new CustomerContactDto
        {
            Id = customerContactDto.Id.ToString(),
            Name = customerContactDto.Name,
            Email = customerContactDto.Email,
            IsProtectedAddress = customerContactDto.IsProtectedAddress,
            Phone = customerContactDto.Phone,
            Mobile = customerContactDto.Mobile,
            Attention = customerContactDto.Attention,
            StreetCode = customerContactDto.StreetCode,
            StreetName = customerContactDto.StreetName,
            BuildingNumber = customerContactDto.BuildingNumber,
            PostCode = customerContactDto.PostCode,
            CityName = customerContactDto.CityName,
            CitySubDivisionName = customerContactDto.CitySubDivisionName,
            DarReference = customerContactDto.DarReference,
            CountryCode = customerContactDto.CountryCode,
            Floor = customerContactDto.Floor,
            Room = customerContactDto.Room,
            PostBox = customerContactDto.PostBox,
            MunicipalityCode = customerContactDto.MunicipalityCode,
        };
    }

    private static InstallationAddressDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.InstallationAddressDto installationAddress, string meteringPointId)
    {
        return new InstallationAddressDto
        {
            Id = IdentifierEncoder.EncodeMeteringPointId(meteringPointId, "InsAdr"),
            StreetCode = installationAddress.StreetCode,
            StreetName = installationAddress.StreetName ?? string.Empty,
            BuildingNumber = installationAddress.BuildingNumber ?? string.Empty,
            CityName = installationAddress.CityName ?? string.Empty,
            CitySubDivisionName = installationAddress.AdditionalCityName,
            DarReference = installationAddress.DarReference,
            WashInstructions = installationAddress.IsActualAddress == true ? WashInstructions.Washable : WashInstructions.NotWashable,
            CountryCode = installationAddress.CountryCode ?? string.Empty,
            Floor = installationAddress.Floor,
            Room = installationAddress.SuiteNumber,
            PostCode = installationAddress.PostalCode ?? string.Empty,
            MunicipalityCode = installationAddress.MunicipalityCode,
            LocationDescription = installationAddress.Remarks,
        };
    }

    private static InstallationAddressDto MapToDto(this Clients.ElectricityMarket.v1.InstallationAddressDto installationAddress)
    {
        return new InstallationAddressDto
        {
            Id = installationAddress.Id.ToString(),
            StreetCode = installationAddress.StreetCode,
            StreetName = installationAddress.StreetName,
            BuildingNumber = installationAddress.BuildingNumber,
            CityName = installationAddress.CityName,
            CitySubDivisionName = installationAddress.CitySubDivisionName,
            DarReference = installationAddress.DarReference,
            WashInstructions = installationAddress.WashInstructions == Clients.ElectricityMarket.v1.WashInstructions.NotWashable ? WashInstructions.NotWashable : WashInstructions.Washable,
            CountryCode = installationAddress.CountryCode,
            Floor = installationAddress.Floor,
            Room = installationAddress.Room,
            PostCode = installationAddress.PostCode,
            MunicipalityCode = installationAddress.MunicipalityCode,
            LocationDescription = installationAddress.LocationDescription,
        };
    }
}
