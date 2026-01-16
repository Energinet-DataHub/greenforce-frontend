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

    public static EnergySupplyPeriodDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.EnergySupplierPeriodDto energySupplierPeriod)
    {
        return new EnergySupplyPeriodDto
        {
            Id = NextLong(),
            ValidFrom = energySupplierPeriod.ValidFrom,
            ValidTo = energySupplierPeriod.ValidTo,
            Customers = [.. energySupplierPeriod.Contacts.Select(c => c.MapToDto())],
        };
    }

    public static ElectricalHeatingDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ElectricalHeatingPeriodDto electricalHeatingPeriod)
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

    public static CustomerDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ContactDto contactDto)
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

    public static CustomerContactDto MapToDto(this DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1.MeteringPointDtoV1.ContactAddressDto contactDto)
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

    public static long NextLong()
    {
        var random = new Random(Guid.NewGuid().GetHashCode());
        return random.NextLong(1000000, long.MaxValue);
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

    private static MeteringPointType MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType type)
    {
        return type switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Consumption => MeteringPointType.Consumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Production => MeteringPointType.Production,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Exchange => MeteringPointType.Exchange,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.VEProduction => MeteringPointType.VEProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Analysis => MeteringPointType.Analysis,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NotUsed => MeteringPointType.NotUsed,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SurplusProductionGroup6 => MeteringPointType.SurplusProductionGroup6,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetProduction => MeteringPointType.NetProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SupplyToGrid => MeteringPointType.SupplyToGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ConsumptionFromGrid => MeteringPointType.ConsumptionFromGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.WholesaleServicesOrInformation => MeteringPointType.WholesaleServicesOrInformation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OwnProduction => MeteringPointType.OwnProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetFromGrid => MeteringPointType.NetFromGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetToGrid => MeteringPointType.NetToGrid,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.TotalConsumption => MeteringPointType.TotalConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetLossCorrection => MeteringPointType.NetLossCorrection,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ElectricalHeating => MeteringPointType.ElectricalHeating,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetConsumption => MeteringPointType.NetConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherConsumption => MeteringPointType.OtherConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherProduction => MeteringPointType.OtherProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CapacitySettlement => MeteringPointType.CapacitySettlement,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ExchangeReactiveEnergy => MeteringPointType.ExchangeReactiveEnergy,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetProduction => MeteringPointType.CollectiveNetProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetConsumption => MeteringPointType.CollectiveNetConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedDownregulation => MeteringPointType.ActivatedDownregulation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedUpregulation => MeteringPointType.ActivatedUpregulation,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualConsumption => MeteringPointType.ActualConsumption,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualProduction => MeteringPointType.ActualProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.InternalUse => MeteringPointType.InternalUse,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Unknown => throw new InvalidOperationException("Invalid MeteringPointType"),
        };
    }

    private static MeteringPointSubType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType subType)
    {
        return subType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Physical => MeteringPointSubType.Physical,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Virtual => MeteringPointSubType.Virtual,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Calculated => MeteringPointSubType.Calculated,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Unknown => null,
        };
    }

    private static ConnectionState? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState connectionState)
    {
        return connectionState switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.New => ConnectionState.New,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Connected => ConnectionState.Connected,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Disconnected => ConnectionState.Disconnected,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.ClosedDown => ConnectionState.ClosedDown,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Unknown => null,
        };
    }

    private static string MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution timeResolution)
    {
        return timeResolution switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.QuarterHourly => "PT15M",
            DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.Hourly => "PT1H",
            DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.Monthly => "P1M",
            DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.Unknown => throw new InvalidOperationException("Invalid TimeResolution"),
        };
    }

    private static ConnectionType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType connectionType)
    {
        return connectionType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Direct => ConnectionType.Direct,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Installation => ConnectionType.Installation,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Unknown => null,
        };
    }

    private static DisconnectionType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType disconnectionType)
    {
        return disconnectionType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Remote => DisconnectionType.RemoteDisconnection,
            DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Manual => DisconnectionType.ManualDisconnection,
            DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Unknown => null,
        };
    }

    private static Product? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.Product product)
    {
        return product switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.Product.PowerActive => Product.PowerActive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.PowerReactive => Product.PowerReactive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.EnergyActive => Product.EnergyActive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.EnergyReactive => Product.EnergyReactive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.Tariff => Product.Tariff,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.FuelQuantity => Product.FuelQuantity,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.Unknown => null,
        };
    }

    private static MeteringPointMeasureUnit MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit energyUnit)
    {
        return energyUnit switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Ampere => MeteringPointMeasureUnit.Ampere,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Stk => MeteringPointMeasureUnit.STK,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KVArh => MeteringPointMeasureUnit.KVArh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KWh => MeteringPointMeasureUnit.KWh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KW => MeteringPointMeasureUnit.KW,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MW => MeteringPointMeasureUnit.MW,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MWh => MeteringPointMeasureUnit.MWh,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Tonne => MeteringPointMeasureUnit.Tonne,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MVAr => MeteringPointMeasureUnit.MVAr,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.DanishTariffCode => MeteringPointMeasureUnit.DanishTariffCode,
            DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Unknown => throw new InvalidOperationException("Invalid EnergyUnit"),
        };
    }

    private static AssetType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.AssetType assetType)
    {
        return assetType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.SteamTurbineWithBackPressureMode => AssetType.SteamTurbineWithBackPressureMode,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.GasTurbine => AssetType.GasTurbine,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombinedCycle => AssetType.CombinedCycle,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineGas => AssetType.CombustionEngineGas,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.SteamTurbineWithCondensationSteam => AssetType.SteamTurbineWithCondensationSteam,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.Boiler => AssetType.Boiler,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.StirlingEngine => AssetType.StirlingEngine,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PermanentConnectedElectricalEnergyStorageFacilities => AssetType.PermanentConnectedElectricalEnergyStorageFacilities,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities => AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.FuelCells => AssetType.FuelCells,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PhotoVoltaicCells => AssetType.PhotoVoltaicCells,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.WindTurbines => AssetType.WindTurbines,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.HydroelectricPower => AssetType.HydroelectricPower,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.WavePower => AssetType.WavePower,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.MixedProduction => AssetType.MixedProduction,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.ProductionWithElectricalEnergyStorageFacilities => AssetType.ProductionWithElectricalEnergyStorageFacilities,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PowerToX => AssetType.PowerToX,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.RegenerativeDemandFacility => AssetType.RegenerativeDemandFacility,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineDiesel => AssetType.CombustionEngineDiesel,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineBio => AssetType.CombustionEngineBio,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.NoTechnology => AssetType.NoTechnology,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.UnknownTechnology => AssetType.UnknownTechnology,
            DataHub.ElectricityMarket.Abstractions.Shared.AssetType.Unknown => null,
        };
    }

    private static int? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup settlementGroup)
    {
        return settlementGroup switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.One => 1,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Two => 2,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Three => 3,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Four => 4,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Five => 5,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Six => 6,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.NinetyNine => 99,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.None => 0,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Unknown => null,
        };
    }

    private static SettlementMethod? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod settlementMethod)
    {
        return settlementMethod switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.FlexSettled => SettlementMethod.FlexSettled,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.Profiled => SettlementMethod.Profiled,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.NonProfiled => SettlementMethod.NonProfiled,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.Unknown => null,
        };
    }

    private static CustomerRelationType MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.RelationType relationType)
    {
        return relationType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Technical => CustomerRelationType.Contact1,
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Juridical => CustomerRelationType.Contact4,
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Secondary => CustomerRelationType.Secondary,
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Unknown => throw new InvalidOperationException("Invalid RelationType"),
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
