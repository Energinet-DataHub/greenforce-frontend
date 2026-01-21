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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class MeteringPointMetadataMapper
{
    public static MeteringPointMetadataDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.MeteringPointPeriodDto meteringPoint)
    {
        return new MeteringPointMetadataDto
        {
            Id = NextLong(),
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
            MeterNumber = meteringPoint.MeterId,
            NetSettlementGroup = meteringPoint.SettlementGroup?.MapToDto(),
            ScheduledMeterReadingMonth = null,
            ScheduledMeterReadingDate = meteringPoint.SettlementDate is not null ? new AnnualDate { Month = meteringPoint.SettlementDate.Month, Day = meteringPoint.SettlementDate.Day } : null,
            FromGridAreaCode = meteringPoint.FromGridAreaId,
            ToGridAreaCode = meteringPoint.ToGridAreaId,
            PowerPlantGsrn = meteringPoint.PowerPlantGsrn?.ToString(),
            SettlementMethod = meteringPoint.SettlementMethod?.MapToDto(),
            InstallationAddress = meteringPoint.InstallationAddress?.MapToDto(),
            ManuallyHandled = false,
        };
    }

    public static CommercialRelationDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.CommercialRelationDto commercialRelation)
    {
        return new CommercialRelationDto
        {
            Id = NextLong(),
            EnergySupplier = commercialRelation.EnergySupplierId,
            StartDate = commercialRelation.ValidFrom,
            EndDate = commercialRelation.ValidTo,
            ActiveEnergySupplyPeriod = commercialRelation.ActiveEnergySupplyPeriod?.MapToDto(),
            EnergySupplyPeriodTimeline = [.. commercialRelation.EnergySupplierPeriods.Select(e => e.MapToDto())],
            ActiveElectricalHeatingPeriods = commercialRelation.ActiveElectricalHeatingPeriod?.MapToDto(),
            ElectricalHeatingPeriods = [.. commercialRelation.ElectricalHeatingPeriods.Select(e => e.MapToDto())],
        };
    }

    public static long NextLong()
    {
        var random = new Random(Guid.NewGuid().GetHashCode());
        return random.NextLong(1000000, long.MaxValue);
    }

    private static EnergySupplyPeriodDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.EnergySupplierPeriodDto energySupplierPeriod)
    {
        return new EnergySupplyPeriodDto
        {
            Id = NextLong(),
            ValidFrom = energySupplierPeriod.ValidFrom,
            ValidTo = energySupplierPeriod.ValidTo,
            Customers = [.. energySupplierPeriod.Contacts.Select(c => c.MapToDto())],
        };
    }

    private static ElectricalHeatingDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ElectricalHeatingPeriodDto electricalHeatingPeriod)
    {
        return new ElectricalHeatingDto
        {
            Id = NextLong(),
            ValidFrom = electricalHeatingPeriod.ValidFrom,
            ValidTo = electricalHeatingPeriod.ValidTo,
            IsActive = false, // TODO: We don't have this value from the backend yet
            TransactionType = null, // TODO: We don't have this value from the backend yet
        };
    }

    private static CustomerDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ContactDto contactDto)
    {
        return new CustomerDto
        {
            Id = NextLong(),
            Name = contactDto.Name ?? string.Empty,
            Cvr = contactDto.Cvr,
            IsProtectedName = contactDto.IsProtectedName,
            RelationType = contactDto.RelationType.MapToDto(),
            LegalContact = contactDto.LegalContact?.MapToDto(),
            TechnicalContact = contactDto.TechnicalContact?.MapToDto(),
        };
    }

    private static CustomerContactDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ContactAddressDto contactDto)
    {
        return new CustomerContactDto
        {
            Id = NextLong(),
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

    private static InstallationAddressDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.InstallationAddressDto installationAddress)
    {
        return new InstallationAddressDto
        {
            Id = NextLong(),
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

    private static long NextLong(this Random random, long min, long max)
    {
        if (max <= min)
        {
            throw new ArgumentOutOfRangeException("max", "max must be > min!");
        }

        var unsignedRange = (ulong)(max - min);

        ulong ulongRand;
        do
        {
            var buf = new byte[8];
            random.NextBytes(buf);
            ulongRand = (ulong)BitConverter.ToInt64(buf, 0);
        }
        while (ulongRand > ulong.MaxValue - (((ulong.MaxValue % unsignedRange) + 1) % unsignedRange));

        return (long)(ulongRand % unsignedRange) + min;
    }
}
