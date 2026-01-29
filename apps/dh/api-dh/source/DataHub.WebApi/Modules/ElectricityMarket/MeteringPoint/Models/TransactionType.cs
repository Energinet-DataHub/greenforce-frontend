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
namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

public enum TransactionType
{
    ChangeSupplier = 0,
    EndSupply = 1,
    IncorrectSupplierChange = 2,
    MasterDataSent = 3,
    AttachChild = 4,
    DettachChild = 5,
    EnergiSupplierMoveIn = 6,
    EnergiSupplierMoveOut = 7,
    TransactionTypeIncMove = 8,
    IncorrectMoveIn = 9,
    ElectricalHeatingOn = 10,
    ElectricalHeatingOff = 11,
    ChangeSupplierShort = 12,
    ManualChangeSupplier = 13,
    ManualCorrections = 14,
    CreateMeteringPoint = 15,
    CreateSpecialMeteringPoint = 16,
    RegisterMeterIdentifier = 17,
    AddedByDataMigration = 18,
    DeliveryTermination = 19,
    SendingHistoricalAnnualConsumptionToElectricitySupplier = 20,
    ManualWebPasswordGeneration = 21,
    ManualUpdateOfWebAccessCode = 22,
    MaintenanceOfSettlementMasterData = 23,
    GridAccessProviderMoveIn = 24,
    GridAccessProviderMoveOut = 25,
    SendingCustomerMasterData = 26,
    RequestForMasterData = 27,
    RequestForMasterDataNotOwner = 28,
    RequestForMeasurementData = 29,
    RequestForSettlementMasterData = 30,
    SubmitExpectedAnnualConsumptionEnergySupplier = 31,
    SubmitExpectedAnnualConsumptionGridAccessProvider = 32,
    SubmitCounterReadingEnergySupplier = 33,
    SubmitCounterReadingGridAccessProvider = 34,
    RequestForServiceFromGridAccessProvider = 35,
    Unsubscribe = 36,
    StopTariff = 37,
    DismantlingOfMeter = 38,
    UpdateSpecialMeteringPoint = 39,
    UpdateHistoricMeteringPoint = 40,
    ChangeMeter = 41,
    ChangeInPurchaseObligation = 42,
    DisplayingCumulativeDataNotOwner = 43,
    ViewingMoves = 44,
    DisplayingMeasurementPoint = 45,
    DisplayingMeasurementPointNotOwner = 46,
    DisplayingMeasurementDataNotOwner = 47,
    InterruptionAndReopeningOfMeasurementPoint = 48,
    ConnectingMeasuringPoint = 49,
    ChangeBalanceResponsiblePartyConsumption = 50,
    ChangeBalanceResponsiblePartyProduction = 51,
    MergerOfNetworkAreas = 52,
    MassCorrection = 53,
    ChangeOfPaymentMethod = 54,
    DecommissioningMeasuringPoint = 55,
    CancellationOfConsumptionStatementMarketProcess = 56,
    CancellationOfConsumptionStatementReadingDate = 57,
    ConsumptionStatementMeasuringPoint = 58,
    HistoricalTransactionCorrection = 59,
    StartCancellationOfSupplierChange = 60,
    ConsumptionStatementCancelsNotMarketProcess = 61,
    ConsumptionStatementCancelsMarketProcess = 62,
    CreateHistoricalMeteringPoint = 63,
    EmptyTransaction = 64,
}
