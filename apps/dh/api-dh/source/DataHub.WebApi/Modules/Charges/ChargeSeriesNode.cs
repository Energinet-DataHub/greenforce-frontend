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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeSeries;
using Energinet.DataHub.Charges.Client;
using HotChocolate.Authorization;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeSeriesDto>]
public static partial class ChargeSeriesNode
{
    [Query]
    [Authorize(Roles = new[] { "charges:view" })]
    public static async Task<IEnumerable<ChargeSeriesDto>> GetChargeSeriesAsync(
        Guid chargeId,
        Interval interval,
        [Service] IChargesClient client,
        CancellationToken cancellationToken)
    {
        var series = await client.GetChargeSeriesAsync(
            new ChargeSeriesSearchCriteriaDto(
                ChargeId: chargeId,
                FromDateTimeUtc: interval.Start.ToDateTimeOffset(),
                ToDateTimeUtc: interval.End.ToDateTimeOffset(),
                SortColumnName: ChargeSeriesSortColumnName.FromDateTime,
                IsDescending: true,
                Skip: 0,
                Take: 99999999));

        return series.Value ?? [];
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeSeriesDto> descriptor)
    {
        descriptor.Name("ChargeSeries");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Points);
        descriptor.Field(f => f.TotalAmount);
    }
}
