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

using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<CalculationDto> GetCalculationByIdAsync(
        Guid id,
        [Service] IWholesaleClient_V3 client) =>
        await client.GetCalculationAsync(id);

    [UsePaging]
    [UseSorting]
    public async Task<IEnumerable<CalculationDto>> GetCalculationsAsync(
        CalculationQueryInput input,
        string? filter,
        [Service] IWholesaleClient_V3 client)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return await client.QueryCalculationsAsync(input);
        }

        var calculation = Guid.TryParse(filter, out var id)
            ? await client.GetCalculationAsync(id)
            : null;

        return calculation is not null ? [calculation] : [];
    }

    [GraphQLDeprecated("Use `latestCalculation` instead")]
    public async Task<CalculationDto?> GetLatestBalanceFixingAsync(
        Interval period,
        [Service] IWholesaleClient_V3 client)
    {
        var input = new CalculationQueryInput
        {
            Period = period,
            CalculationTypes = [Clients.Wholesale.v3.CalculationType.BalanceFixing],
            States = [CalculationOrchestrationState.Completed],
        };

        var calculations = await client.QueryCalculationsAsync(input);
        return calculations.FirstOrDefault();
    }

    public async Task<CalculationDto?> GetLatestCalculationAsync(
        Interval period,
        Clients.Wholesale.v3.CalculationType calculationType,
        [Service] IWholesaleClient_V3 client)
    {
        var input = new CalculationQueryInput
        {
            Period = period,
            CalculationTypes = [calculationType],
            States = [CalculationOrchestrationState.Completed],
        };

        var calculations = await client.QueryCalculationsAsync(input);
        return calculations.FirstOrDefault();
    }
}
