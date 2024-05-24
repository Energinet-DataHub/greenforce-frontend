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
using EdiB2CWebAppCalculationType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.CalculationType;
using MeteringPointType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.MeteringPointType;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    public async Task<bool> CreateAggregatedMeasureDataRequestAsync(
        EdiB2CWebAppCalculationType calculationType,
        MeteringPointType? meteringPointType,
        string startDate,
        string? endDate,
        string? gridArea,
        string? energySupplierId,
        string? balanceResponsibleId,
        CancellationToken cancellationToken,
        [Service] IEdiB2CWebAppClient_V1 client)
    {
        await client.RequestAggregatedMeasureDataAsync(
                "1.0",
                new RequestAggregatedMeasureDataMarketRequest()
                {
                    CalculationType = calculationType,
                    MeteringPointType = meteringPointType!.Value,
                    StartDate = startDate,
                    EndDate = endDate,
                    GridArea = gridArea,
                    EnergySupplierId = energySupplierId,
                    BalanceResponsibleId = balanceResponsibleId,
                },
                cancellationToken)
            .ConfigureAwait(false);
        return true;
    }

    public async Task<bool> CreateWholesaleSettlementRequestAsync(
        EdiB2CWebAppCalculationType calculationType,
        Interval period,
        string? gridArea,
        string? energySupplierId,
        string? chargeOwner,
        string? resolution,
        RequestWholesaleSettlementChargeType[] chargeTypes,
        CancellationToken cancellationToken,
        [Service] IEdiB2CWebAppClient_V1 client)
    {
        await client.RequestWholesaleSettlementAsync(
                "1.0",
                new RequestWholesaleSettlementMarketRequest()
                {
                    CalculationType = calculationType,
                    StartDate = period.Start.ToString(),
                    EndDate = period.End.ToString(),
                    GridArea = gridArea,
                    EnergySupplierId = energySupplierId,
                    ChargeOwner = chargeOwner,
                    Resolution = resolution,
                    ChargeTypes = chargeTypes,
                },
                cancellationToken)
            .ConfigureAwait(false);
        return true;
    }
}
