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

using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class TransactionTypeMapper
{
    public static TransactionType MapToDto(this Clients.ElectricityMarket.v1.TransactionType transactionType)
    {
        return transactionType switch
        {
            Clients.ElectricityMarket.v1.TransactionType.ChangeSupplier => TransactionType.ChangeSupplier,
            Clients.ElectricityMarket.v1.TransactionType.EndSupply => TransactionType.EndSupply,
            Clients.ElectricityMarket.v1.TransactionType.IncorrectSupplierChange => TransactionType.IncorrectSupplierChange,
            Clients.ElectricityMarket.v1.TransactionType.MasterDataSent => TransactionType.MasterDataSent,
            Clients.ElectricityMarket.v1.TransactionType.AttachChild => TransactionType.AttachChild,
            Clients.ElectricityMarket.v1.TransactionType.DettachChild => TransactionType.DettachChild,
            Clients.ElectricityMarket.v1.TransactionType.EnergiSupplierMoveIn => TransactionType.EnergiSupplierMoveIn,
            Clients.ElectricityMarket.v1.TransactionType.EnergiSupplierMoveOut => TransactionType.EnergiSupplierMoveOut,
            Clients.ElectricityMarket.v1.TransactionType.TransactionTypeIncMove => TransactionType.TransactionTypeIncMove,
            Clients.ElectricityMarket.v1.TransactionType.IncorrectMoveIn => TransactionType.IncorrectMoveIn,
            Clients.ElectricityMarket.v1.TransactionType.ElectricalHeatingOn => TransactionType.ElectricalHeatingOn,
            Clients.ElectricityMarket.v1.TransactionType.ElectricalHeatingOff => TransactionType.ElectricalHeatingOff,
            Clients.ElectricityMarket.v1.TransactionType.ChangeSupplierShort => TransactionType.ChangeSupplierShort,
            Clients.ElectricityMarket.v1.TransactionType.ManualChangeSupplier => TransactionType.ManualChangeSupplier,
            Clients.ElectricityMarket.v1.TransactionType.ManualCorrections => TransactionType.ManualCorrections,
            Clients.ElectricityMarket.v1.TransactionType.CreateMeteringPoint => TransactionType.CreateMeteringPoint,
            Clients.ElectricityMarket.v1.TransactionType.CreateSpecialMeteringPoint => TransactionType.CreateSpecialMeteringPoint,
            Clients.ElectricityMarket.v1.TransactionType.RegisterMeterIdentifier => TransactionType.RegisterMeterIdentifier,
            Clients.ElectricityMarket.v1.TransactionType.AddedByDataMigration => TransactionType.AddedByDataMigration,
            Clients.ElectricityMarket.v1.TransactionType.DeliveryTermination => TransactionType.DeliveryTermination,
            Clients.ElectricityMarket.v1.TransactionType.SendingHistoricalAnnualConsumptionToElectricitySupplier => TransactionType.SendingHistoricalAnnualConsumptionToElectricitySupplier,
            Clients.ElectricityMarket.v1.TransactionType.ManualWebPasswordGeneration => TransactionType.ManualWebPasswordGeneration,
            Clients.ElectricityMarket.v1.TransactionType.ManualUpdateOfWebAccessCode => TransactionType.ManualUpdateOfWebAccessCode,
            Clients.ElectricityMarket.v1.TransactionType.MaintenanceOfSettlementMasterData => TransactionType.MaintenanceOfSettlementMasterData,
            Clients.ElectricityMarket.v1.TransactionType.GridAccessProviderMoveIn => TransactionType.GridAccessProviderMoveIn,
            Clients.ElectricityMarket.v1.TransactionType.GridAccessProviderMoveOut => TransactionType.GridAccessProviderMoveOut,
            Clients.ElectricityMarket.v1.TransactionType.SendingCustomerMasterData => TransactionType.SendingCustomerMasterData,
            Clients.ElectricityMarket.v1.TransactionType.RequestForMasterData => TransactionType.RequestForMasterData,
            Clients.ElectricityMarket.v1.TransactionType.RequestForMasterDataNotOwner => TransactionType.RequestForMasterDataNotOwner,
            Clients.ElectricityMarket.v1.TransactionType.RequestForMeasurementData => TransactionType.RequestForMeasurementData,
            Clients.ElectricityMarket.v1.TransactionType.RequestForSettlementMasterData => TransactionType.RequestForSettlementMasterData,
            Clients.ElectricityMarket.v1.TransactionType.SubmitExpectedAnnualConsumptionEnergySupplier => TransactionType.SubmitExpectedAnnualConsumptionEnergySupplier,
            Clients.ElectricityMarket.v1.TransactionType.SubmitExpectedAnnualConsumptionGridAccessProvider => TransactionType.SubmitExpectedAnnualConsumptionGridAccessProvider,
            Clients.ElectricityMarket.v1.TransactionType.SubmitCounterReadingEnergySupplier => TransactionType.SubmitCounterReadingEnergySupplier,
            Clients.ElectricityMarket.v1.TransactionType.SubmitCounterReadingGridAccessProvider => TransactionType.SubmitCounterReadingGridAccessProvider,
            Clients.ElectricityMarket.v1.TransactionType.RequestForServiceFromGridAccessProvider => TransactionType.RequestForServiceFromGridAccessProvider,
            Clients.ElectricityMarket.v1.TransactionType.Unsubscribe => TransactionType.Unsubscribe,
            Clients.ElectricityMarket.v1.TransactionType.StopTariff => TransactionType.StopTariff,
            Clients.ElectricityMarket.v1.TransactionType.DismantlingOfMeter => TransactionType.DismantlingOfMeter,
            Clients.ElectricityMarket.v1.TransactionType.UpdateSpecialMeteringPoint => TransactionType.UpdateSpecialMeteringPoint,
            Clients.ElectricityMarket.v1.TransactionType.UpdateHistoricMeteringPoint => TransactionType.UpdateHistoricMeteringPoint,
            Clients.ElectricityMarket.v1.TransactionType.ChangeMeter => TransactionType.ChangeMeter,
            Clients.ElectricityMarket.v1.TransactionType.ChangeInPurchaseObligation => TransactionType.ChangeInPurchaseObligation,
            Clients.ElectricityMarket.v1.TransactionType.DisplayingCumulativeDataNotOwner => TransactionType.DisplayingCumulativeDataNotOwner,
            Clients.ElectricityMarket.v1.TransactionType.ViewingMoves => TransactionType.ViewingMoves,
            Clients.ElectricityMarket.v1.TransactionType.DisplayingMeasurementPoint => TransactionType.DisplayingMeasurementPoint,
            Clients.ElectricityMarket.v1.TransactionType.DisplayingMeasurementPointNotOwner => TransactionType.DisplayingMeasurementPointNotOwner,
            Clients.ElectricityMarket.v1.TransactionType.DisplayingMeasurementDataNotOwner => TransactionType.DisplayingMeasurementDataNotOwner,
            Clients.ElectricityMarket.v1.TransactionType.InterruptionAndReopeningOfMeasurementPoint => TransactionType.InterruptionAndReopeningOfMeasurementPoint,
            Clients.ElectricityMarket.v1.TransactionType.ConnectingMeasuringPoint => TransactionType.ConnectingMeasuringPoint,
            Clients.ElectricityMarket.v1.TransactionType.ChangeBalanceResponsiblePartyConsumption => TransactionType.ChangeBalanceResponsiblePartyConsumption,
            Clients.ElectricityMarket.v1.TransactionType.ChangeBalanceResponsiblePartyProduction => TransactionType.ChangeBalanceResponsiblePartyProduction,
            Clients.ElectricityMarket.v1.TransactionType.MergerOfNetworkAreas => TransactionType.MergerOfNetworkAreas,
            Clients.ElectricityMarket.v1.TransactionType.MassCorrection => TransactionType.MassCorrection,
            Clients.ElectricityMarket.v1.TransactionType.ChangeOfPaymentMethod => TransactionType.ChangeOfPaymentMethod,
            Clients.ElectricityMarket.v1.TransactionType.DecommissioningMeasuringPoint => TransactionType.DecommissioningMeasuringPoint,
            Clients.ElectricityMarket.v1.TransactionType.CancellationOfConsumptionStatementMarketProcess => TransactionType.CancellationOfConsumptionStatementMarketProcess,
            Clients.ElectricityMarket.v1.TransactionType.CancellationOfConsumptionStatementReadingDate => TransactionType.CancellationOfConsumptionStatementReadingDate,
            Clients.ElectricityMarket.v1.TransactionType.ConsumptionStatementMeasuringPoint => TransactionType.ConsumptionStatementMeasuringPoint,
            Clients.ElectricityMarket.v1.TransactionType.HistoricalTransactionCorrection => TransactionType.HistoricalTransactionCorrection,
            Clients.ElectricityMarket.v1.TransactionType.StartCancellationOfSupplierChange => TransactionType.StartCancellationOfSupplierChange,
            Clients.ElectricityMarket.v1.TransactionType.ConsumptionStatementCancelsNotMarketProcess => TransactionType.ConsumptionStatementCancelsNotMarketProcess,
            Clients.ElectricityMarket.v1.TransactionType.ConsumptionStatementCancelsMarketProcess => TransactionType.ConsumptionStatementCancelsMarketProcess,
            Clients.ElectricityMarket.v1.TransactionType.CreateHistoricalMeteringPoint => TransactionType.CreateHistoricalMeteringPoint,
            Clients.ElectricityMarket.v1.TransactionType.EmptyTransaction => TransactionType.EmptyTransaction,
        };
    }
}
