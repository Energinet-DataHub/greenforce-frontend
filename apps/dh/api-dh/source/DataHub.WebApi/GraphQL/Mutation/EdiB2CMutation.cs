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
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    public async Task<bool> RequestCalculationAsync(
        Clients.Wholesale.v3.CalculationType calculationType,
        Interval period,
        string gridArea,
        MeteringPointType? meteringPointType,
        string? energySupplierId,
        string? balanceResponsibleId,
        PriceType? priceType,
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

        switch (ediCalculationType)
        {
            case CalculationType.PreliminaryAggregation:
            case CalculationType.BalanceFixing:
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
                break;
            case CalculationType.WholesaleFixing:
            case CalculationType.FirstCorrection:
            case CalculationType.SecondCorrection:
            case CalculationType.ThirdCorrection:
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
                break;
        }

        return true;
    }
}
