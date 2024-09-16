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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    public async Task<bool> RequestCalculationAsync(
        Clients.Wholesale.v3.CalculationType calculationType,
        Interval period,
        RequestCalculationDataType requestCalculationDataType,
        string? gridArea,
        string? energySupplierId,
        string? balanceResponsibleId,
        [Service] IEdiB2CWebAppClient_V1 client,
        CancellationToken cancellationToken)
    {
        var ediCalculationType = calculationType switch {
            Clients.Wholesale.v3.CalculationType.Aggregation => CalculationType.PreliminaryAggregation,
            Clients.Wholesale.v3.CalculationType.BalanceFixing => CalculationType.BalanceFixing,
            Clients.Wholesale.v3.CalculationType.WholesaleFixing => CalculationType.WholesaleFixing,
            Clients.Wholesale.v3.CalculationType.FirstCorrectionSettlement => CalculationType.FirstCorrection,
            Clients.Wholesale.v3.CalculationType.SecondCorrectionSettlement => CalculationType.SecondCorrection,
            Clients.Wholesale.v3.CalculationType.ThirdCorrectionSettlement => CalculationType.ThirdCorrection,
        };

        switch (requestCalculationDataType)
        {
            case RequestCalculationDataType.AllEnergy:
            case RequestCalculationDataType.Production:
            case RequestCalculationDataType.FlexConsumption:
            case RequestCalculationDataType.TotalConsumption:
            case RequestCalculationDataType.NonProfiledConsumption:
            case RequestCalculationDataType.Exchange:
                await client.RequestAggregatedMeasureDataAsync(
                    "1.0",
                    new RequestAggregatedMeasureDataMarketRequest()
                    {
                        CalculationType = ediCalculationType,
                        StartDate = period.Start.ToString(),
                        EndDate = period.End.ToString(),
                        GridArea = gridArea,
                        EnergySupplierId = energySupplierId,
                        BalanceResponsibleId = balanceResponsibleId,
                        MeteringPointType = requestCalculationDataType switch
                        {
                            RequestCalculationDataType.AllEnergy => null,
                            RequestCalculationDataType.Production => MeteringPointType.Production,
                            RequestCalculationDataType.FlexConsumption => MeteringPointType.FlexConsumption,
                            RequestCalculationDataType.TotalConsumption => MeteringPointType.TotalConsumption,
                            RequestCalculationDataType.NonProfiledConsumption => MeteringPointType.NonProfiledConsumption,
                            RequestCalculationDataType.Exchange => MeteringPointType.Exchange,
                            RequestCalculationDataType.TariffSubscriptionAndFee or
                            RequestCalculationDataType.Tariff or
                            RequestCalculationDataType.Subscription or
                            RequestCalculationDataType.Fee or
                            RequestCalculationDataType.MonthlyTariff or
                            RequestCalculationDataType.MonthlySubscription or
                            RequestCalculationDataType.MonthlyFee or
                            RequestCalculationDataType.MonthlyTariffSubscriptionAndFee =>
                                throw new ArgumentException("Invalid metering point type", nameof(requestCalculationDataType)),
                        },
                    },
                    cancellationToken);
                return true;
            case RequestCalculationDataType.TariffSubscriptionAndFee:
            case RequestCalculationDataType.Tariff:
            case RequestCalculationDataType.Subscription:
            case RequestCalculationDataType.Fee:
            case RequestCalculationDataType.MonthlyTariff:
            case RequestCalculationDataType.MonthlySubscription:
            case RequestCalculationDataType.MonthlyFee:
            case RequestCalculationDataType.MonthlyTariffSubscriptionAndFee:
                await client.RequestWholesaleSettlementAsync(
                    "1.0",
                    new RequestWholesaleSettlementMarketRequest()
                    {
                        CalculationType = ediCalculationType,
                        StartDate = period.Start.ToString(),
                        EndDate = period.End.ToString(),
                        GridArea = gridArea,
                        EnergySupplierId = energySupplierId,
                        PriceType = requestCalculationDataType switch
                        {
                            RequestCalculationDataType.TariffSubscriptionAndFee => PriceType.TariffSubscriptionAndFee,
                            RequestCalculationDataType.Tariff => PriceType.Tariff,
                            RequestCalculationDataType.Subscription => PriceType.Subscription,
                            RequestCalculationDataType.Fee => PriceType.Fee,
                            RequestCalculationDataType.MonthlyTariff => PriceType.MonthlyTariff,
                            RequestCalculationDataType.MonthlySubscription => PriceType.MonthlySubscription,
                            RequestCalculationDataType.MonthlyFee => PriceType.MonthlyFee,
                            RequestCalculationDataType.MonthlyTariffSubscriptionAndFee => PriceType.MonthlyTariffSubscriptionAndFee,
                            RequestCalculationDataType.AllEnergy or
                            RequestCalculationDataType.Production or
                            RequestCalculationDataType.FlexConsumption or
                            RequestCalculationDataType.TotalConsumption or
                            RequestCalculationDataType.NonProfiledConsumption or
                            RequestCalculationDataType.Exchange =>
                                throw new ArgumentException("Invalid price type", nameof(requestCalculationDataType)),
                        },
                    },
                    cancellationToken);
                return true;
        }

        return false;
    }
}
