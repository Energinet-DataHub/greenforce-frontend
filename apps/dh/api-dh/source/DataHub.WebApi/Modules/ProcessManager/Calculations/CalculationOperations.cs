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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.WebApi.Modules.Common;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations;

public static partial class CalculationOperations
{
    [Query]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static Task<IOrchestrationInstanceTypedDto<ICalculation>> GetCalculationByIdAsync(
        Guid id,
        ICalculationsClient client) => client.GetCalculationByIdAsync(id);

    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<IEnumerable<IOrchestrationInstanceTypedDto<ICalculation>>> GetCalculationsAsync(
        CalculationsQueryInput input,
        string? filter,
        ICalculationsClient client)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return await client.QueryCalculationsAsync(input);
        }

        try
        {
            var calculationId = Guid.Parse(filter);
            var calculation = await client.GetCalculationByIdAsync(calculationId);
            return [calculation];
        }
        catch (Exception)
        {
            return [];
        }
    }

    [Query]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation>?> GetLatestCalculationAsync(
        Interval period,
        WholesaleAndEnergyCalculationType calculationType,
        ICalculationsClient client)
    {
        var input = new CalculationsQueryInput
        {
            Period = period,
            CalculationTypes = [calculationType.FromWholesaleAndEnergyCalculationType()],
            State = ProcessState.Succeeded,
        };

        var calculations = await client.QueryCalculationsAsync(input);
        return calculations.FirstOrDefault() switch
        {
            OrchestrationInstanceTypedDto<WholesaleAndEnergyCalculation> latestCalculation =>
                latestCalculation,
            _ => null,
        };
    }

    [Mutation]
    [Authorize(Roles = new[] { "calculations:manage" })]
    public static async Task<Guid> CreateCalculationAsync(
        CalculationExecutionType executionType,
        Interval period,
        string[] gridAreaCodes,
        WholesaleAndEnergyCalculationType calculationType,
        DateTimeOffset? scheduledAt,
        ICalculationsClient client,
        ITopicEventSender sender)
    {
        // NOTE: Temporary solution until this is moved into the process manager
        var processManagerCalculationType = calculationType
            .FromWholesaleAndEnergyCalculationType()
            .Unsafe_ToProcessManagerCalculationType();

        var calculationId = await client.StartCalculationAsync(
            scheduledAt,
            new CalculationInputV1(
                CalculationType: processManagerCalculationType,
                GridAreaCodes: gridAreaCodes,
                PeriodStartDate: period.Start.ToDateTimeOffset(),
                PeriodEndDate: period.End.ToDateTimeOffset(),
                IsInternalCalculation: executionType == CalculationExecutionType.Internal));

        await sender.SendAsync(nameof(CreateCalculationAsync), calculationId);
        return calculationId;
    }

    [Mutation]
    [Authorize(Roles = new[] { "calculations:manage" })]
    public static async Task<bool> CancelScheduledCalculationAsync(
        Guid calculationId,
        ICalculationsClient client) => await client.CancelScheduledCalculationAsync(calculationId);

    [Subscription]
    [Subscribe(With = nameof(OnCalculationUpdatedAsync))]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static IOrchestrationInstanceTypedDto<ICalculation> CalculationUpdated(
        [EventMessage] IOrchestrationInstanceTypedDto<ICalculation> calculation) => calculation;

    private static IObservable<IOrchestrationInstanceTypedDto<ICalculation>> OnCalculationUpdatedAsync(
        ITopicEventReceiver eventReceiver,
        ICalculationsClient client,
        CancellationToken ct)
    {
        // TODO: This needs to only search for calculations that are in progress
        var input = new CalculationsQueryInput() { };
        return Observable
            .FromAsync(() => client.QueryCalculationsAsync(input))
            .SelectMany(calculations => calculations)
            .Select(calculation => calculation.Id)
            .Merge(eventReceiver.Observe<Guid>(nameof(CreateCalculationAsync), ct))
            .SelectMany(id => Observable
                .Interval(TimeSpan.FromSeconds(10))
                .Select(_ => id)
                .StartWith(id)
                .SelectMany(client.GetCalculationByIdAsync)
                .DistinctUntilChanged(calculation => calculation.Lifecycle.State)
                .TakeUntil(calculation => calculation.Lifecycle.TerminationState is not null));
    }
}
