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

        var isAggregatedMeasureDataRequest = requestCalculationDataType switch
        {
            RequestCalculationDataType.AllEnergy => true,
            RequestCalculationDataType.Production => true,
            RequestCalculationDataType.FlexConsumption => true,
            RequestCalculationDataType.TotalConsumption => true,
            RequestCalculationDataType.NonProfiledConsumption => true,
            RequestCalculationDataType.Exchange => true,
            RequestCalculationDataType.TariffSubscriptionAndFee => false,
            RequestCalculationDataType.Tariff => false,
            RequestCalculationDataType.Subscription => false,
            RequestCalculationDataType.Fee => false,
            RequestCalculationDataType.MonthlyTariff => false,
            RequestCalculationDataType.MonthlySubscription => false,
            RequestCalculationDataType.MonthlyFee => false,
            RequestCalculationDataType.MonthlyTariffSubscriptionAndFee => false,
        };

        MeteringPointType? meteringPointType = requestCalculationDataType switch
        {
            RequestCalculationDataType.AllEnergy => null,
            RequestCalculationDataType.Production => MeteringPointType.Production,
            RequestCalculationDataType.FlexConsumption => MeteringPointType.FlexConsumption,
            RequestCalculationDataType.TotalConsumption => MeteringPointType.TotalConsumption,
            RequestCalculationDataType.NonProfiledConsumption => MeteringPointType.NonProfiledConsumption,
            RequestCalculationDataType.Exchange => MeteringPointType.Exchange,
            RequestCalculationDataType.TariffSubscriptionAndFee => null,
            RequestCalculationDataType.Tariff => null,
            RequestCalculationDataType.Subscription => null,
            RequestCalculationDataType.Fee => null,
            RequestCalculationDataType.MonthlyTariff => null,
            RequestCalculationDataType.MonthlySubscription => null,
            RequestCalculationDataType.MonthlyFee => null,
            RequestCalculationDataType.MonthlyTariffSubscriptionAndFee => null,
        };

        PriceType? priceType = requestCalculationDataType switch
        {
            RequestCalculationDataType.AllEnergy => null,
            RequestCalculationDataType.Production => null,
            RequestCalculationDataType.FlexConsumption => null,
            RequestCalculationDataType.TotalConsumption => null,
            RequestCalculationDataType.NonProfiledConsumption => null,
            RequestCalculationDataType.Exchange => null,
            RequestCalculationDataType.TariffSubscriptionAndFee => PriceType.TariffSubscriptionAndFee,
            RequestCalculationDataType.Tariff => PriceType.Tariff,
            RequestCalculationDataType.Subscription => PriceType.Subscription,
            RequestCalculationDataType.Fee => PriceType.Fee,
            RequestCalculationDataType.MonthlyTariff => PriceType.MonthlyTariff,
            RequestCalculationDataType.MonthlySubscription => PriceType.MonthlySubscription,
            RequestCalculationDataType.MonthlyFee => PriceType.MonthlyFee,
            RequestCalculationDataType.MonthlyTariffSubscriptionAndFee => PriceType.MonthlyTariffSubscriptionAndFee,
        };

        if (isAggregatedMeasureDataRequest)
        {
             await client.RequestAggregatedMeasureDataAsync(
                "1.0",
                new RequestAggregatedMeasureDataMarketRequest()
                {
                    CalculationType = ediCalculationType,
                    MeteringPointType = meteringPointType,
                    StartDate = period.Start.ToString(),
                    EndDate = period.End.ToString(),
                    GridArea = gridArea,
                    EnergySupplierId = energySupplierId,
                    BalanceResponsibleId = balanceResponsibleId,
                },
                cancellationToken);
        }
        else
        {
            await client.RequestWholesaleSettlementAsync(
                "1.0",
                new RequestWholesaleSettlementMarketRequest()
                {
                    CalculationType = ediCalculationType,
                    StartDate = period.Start.ToString(),
                    EndDate = period.End.ToString(),
                    GridArea = gridArea,
                    EnergySupplierId = energySupplierId,
                    PriceType = priceType,
                },
                cancellationToken);
        }

        return true;
    }
}
