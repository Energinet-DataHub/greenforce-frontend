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
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Request;

public record RequestWholesaleSettlement(
    Clients.Wholesale.v3.CalculationType CalculationType,
    Interval Period,
    string? GridArea,
    string? EnergySupplierId,
    PriceType? PriceType) : IRequest
{
    public string MeteringPointTypeOrPriceTypeSortProperty
        => PriceType?.ToString() ?? string.Empty;

    public RequestWholesaleSettlementMarketRequest ToMarketRequest()
        => new()
        {
            CalculationType = CalculationType.ToEdiCalculationType(),
            StartDate = Period.Start.ToString(),
            EndDate = Period.End.ToString(),
            GridArea = GridArea,
            EnergySupplierId = EnergySupplierId,
            PriceType = PriceType,
        };
}
