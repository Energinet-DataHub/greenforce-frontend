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

using System;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Mappers;

public class MeteringPointMapperTests
{
    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.SteamTurbineWithBackPressureMode, AssetType.SteamTurbineWithBackPressureMode)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.GasTurbine, AssetType.GasTurbine)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombinedCycle, AssetType.CombinedCycle)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineGas, AssetType.CombustionEngineGas)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.SteamTurbineWithCondensationSteam, AssetType.SteamTurbineWithCondensationSteam)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.Boiler, AssetType.Boiler)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.StirlingEngine, AssetType.StirlingEngine)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PermanentConnectedElectricalEnergyStorageFacilities, AssetType.PermanentConnectedElectricalEnergyStorageFacilities)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities, AssetType.TemporarilyConnectedElectricalEnergyStorageFacilities)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.FuelCells, AssetType.FuelCells)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PhotoVoltaicCells, AssetType.PhotoVoltaicCells)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.WindTurbines, AssetType.WindTurbines)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.HydroelectricPower, AssetType.HydroelectricPower)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.WavePower, AssetType.WavePower)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.MixedProduction, AssetType.MixedProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.ProductionWithElectricalEnergyStorageFacilities, AssetType.ProductionWithElectricalEnergyStorageFacilities)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.PowerToX, AssetType.PowerToX)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.RegenerativeDemandFacility, AssetType.RegenerativeDemandFacility)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineDiesel, AssetType.CombustionEngineDiesel)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.CombustionEngineBio, AssetType.CombustionEngineBio)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.NoTechnology, AssetType.NoTechnology)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.UnknownTechnology, AssetType.UnknownTechnology)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.AssetType.Unknown, null)]
    public void MapToDto_AssetTypeMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.AssetType actual, AssetType? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Connected, ConnectionState.Connected)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Disconnected, ConnectionState.Disconnected)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.New, ConnectionState.New)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.ClosedDown, ConnectionState.ClosedDown)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Unknown, null)]
    public void MapToDto_ConnectionStateMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState actual, ConnectionState? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Direct, ConnectionType.Direct)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Installation, ConnectionType.Installation)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Unknown, null)]
    public void MapToDto_ConnectionTypeMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType actual, ConnectionType? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Remote, DisconnectionType.RemoteDisconnection)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Manual, DisconnectionType.ManualDisconnection)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Unknown, null)]
    public void MapToDto_DisconnectionTypeMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType actual, DisconnectionType? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Ampere, MeteringPointMeasureUnit.Ampere)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Stk, MeteringPointMeasureUnit.STK)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KVArh, MeteringPointMeasureUnit.KVArh)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KWh, MeteringPointMeasureUnit.KWh)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.KW, MeteringPointMeasureUnit.KW)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MW, MeteringPointMeasureUnit.MW)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MWh, MeteringPointMeasureUnit.MWh)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Tonne, MeteringPointMeasureUnit.Tonne)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.MVAr, MeteringPointMeasureUnit.MVAr)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.DanishTariffCode, MeteringPointMeasureUnit.DanishTariffCode)]
    public void MapToDto_EnergyUnitMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit actual, MeteringPointMeasureUnit expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Fact]
    public void MapToDto_EnergyUnitMapper_ThrowsForUnknown()
    {
        Assert.Throws<InvalidOperationException>(() => DataHub.ElectricityMarket.Abstractions.Shared.EnergyUnit.Unknown.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Physical, MeteringPointSubType.Physical)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Virtual, MeteringPointSubType.Virtual)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Calculated, MeteringPointSubType.Calculated)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Unknown, null)]
    public void MapToDto_MeteringPointSubTypeMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType actual, MeteringPointSubType? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Consumption, MeteringPointType.Consumption)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Production, MeteringPointType.Production)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Exchange, MeteringPointType.Exchange)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.VEProduction, MeteringPointType.VEProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Analysis, MeteringPointType.Analysis)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NotUsed, MeteringPointType.NotUsed)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SurplusProductionGroup6, MeteringPointType.SurplusProductionGroup6)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetProduction, MeteringPointType.NetProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.SupplyToGrid, MeteringPointType.SupplyToGrid)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ConsumptionFromGrid, MeteringPointType.ConsumptionFromGrid)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.WholesaleServicesOrInformation, MeteringPointType.WholesaleServicesOrInformation)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OwnProduction, MeteringPointType.OwnProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetFromGrid, MeteringPointType.NetFromGrid)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetToGrid, MeteringPointType.NetToGrid)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.TotalConsumption, MeteringPointType.TotalConsumption)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetLossCorrection, MeteringPointType.NetLossCorrection)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ElectricalHeating, MeteringPointType.ElectricalHeating)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.NetConsumption, MeteringPointType.NetConsumption)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherConsumption, MeteringPointType.OtherConsumption)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.OtherProduction, MeteringPointType.OtherProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CapacitySettlement, MeteringPointType.CapacitySettlement)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ExchangeReactiveEnergy, MeteringPointType.ExchangeReactiveEnergy)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetProduction, MeteringPointType.CollectiveNetProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.CollectiveNetConsumption, MeteringPointType.CollectiveNetConsumption)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedDownregulation, MeteringPointType.ActivatedDownregulation)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActivatedUpregulation, MeteringPointType.ActivatedUpregulation)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualConsumption, MeteringPointType.ActualConsumption)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.ActualProduction, MeteringPointType.ActualProduction)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.InternalUse, MeteringPointType.InternalUse)]
    public void MapToDto_MeteringPointTypeMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType actual, MeteringPointType expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Fact]
    public void MapToDto_MeteringPointTypeMapper_ThrowsForUnknown()
    {
        Assert.Throws<InvalidOperationException>(() => DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointType.Unknown.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.EnergyActive, Product.EnergyActive)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.EnergyReactive, Product.EnergyReactive)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.PowerActive, Product.PowerActive)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.PowerReactive, Product.PowerReactive)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.Tariff, Product.Tariff)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.FuelQuantity, Product.FuelQuantity)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.Product.Unknown, null)]
    public void MapToDto_ProductMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.Product actual, Product? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Technical, CustomerRelationType.Contact1)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Juridical, CustomerRelationType.Contact4)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Secondary, CustomerRelationType.Secondary)]
    public void MapToDto_RelationTypeMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.RelationType actual, CustomerRelationType expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Fact]
    public void MapToDto_RelationTypeMapper_ThrowsForUnknown()
    {
        Assert.Throws<InvalidOperationException>(() => DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Unknown.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.One, 1)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Two, 2)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Three, 3)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Four, 4)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Five, 5)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Six, 6)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.NinetyNine, 99)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.None, 0)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup.Unknown, null)]
    public void MapToDto_SettlementGroupMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.SettlementGroup actual, int? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.FlexSettled, SettlementMethod.FlexSettled)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.Profiled, SettlementMethod.Profiled)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.NonProfiled, SettlementMethod.NonProfiled)]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.Unknown, null)]
    public void MapToDto_SettlementMethodMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod actual, SettlementMethod? expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Theory]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.QuarterHourly, "PT15M")]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.Hourly, "PT1H")]
    [InlineData(DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.Monthly, "P1M")]
    public void MapToDto_TimeResolutionMapper_ReturnsCorrectMapping(DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution actual, string expected)
    {
        Assert.Equal(expected, actual.MapToDto());
    }

    [Fact]
    public void MapToDto_TimeResolutionMapper_ThrowsForUnknown()
    {
        Assert.Throws<InvalidOperationException>(() => DataHub.ElectricityMarket.Abstractions.Shared.TimeResolution.Unknown.MapToDto());
    }
}
