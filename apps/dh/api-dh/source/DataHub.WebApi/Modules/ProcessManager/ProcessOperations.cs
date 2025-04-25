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

using System.Reactive.Linq;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Client;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager;

public static class ProcessOperations
{
    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })] // TODO: Make dev role
    public static async Task<IEnumerable<OrchestrationInstanceTypedDto>> GetProcessesAsync(
        ICalculationsClient calculationsClient,
        CalculationsQueryInput input,
        CancellationToken ct,
        string? filter,
        IRequestsClient requestsClient)
    {
        // TODO: Replace these with a general query for all processes
        // TODO: Filter these somehow (to prevent performance issues)
        var calculations = calculationsClient.QueryCalculationsAsync(input, ct);
        var requests = requestsClient.GetRequestsAsync(ct);
        var orchestrations = (await calculations)
            .Cast<OrchestrationInstanceTypedDto>()
            .Concat((await requests).Cast<OrchestrationInstanceTypedDto>());

        if (string.IsNullOrWhiteSpace(filter))
        {
            return orchestrations;
        }

        return orchestrations.Where(x => x.Id.ToString().Contains(filter.Trim()));
    }

    [Query]
    public static async Task<OrchestrationInstanceTypedDto> GetProcessByIdAsync(
        Guid id,
        ICalculationsClient calculationsClient,
        IRequestsClient requestsClient)
    {
        // TODO: replace this with a api call for a single process
        var request = (await requestsClient.GetRequestsAsync())
            .Cast<OrchestrationInstanceTypedDto>()
            .Where(x => x.Id == id)
            .FirstOrDefault();

        if (request != null)
        {
            return request;
        }

        var calculation = await calculationsClient.GetCalculationByIdAsync(id);

        if (calculation != null)
        {
            return (OrchestrationInstanceTypedDto)calculation;
        }

        throw new Exception("Process not found");
    }
}
