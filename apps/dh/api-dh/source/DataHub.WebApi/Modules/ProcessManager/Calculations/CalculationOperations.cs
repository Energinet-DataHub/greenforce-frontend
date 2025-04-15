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
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.CustomQueries.Calculations.V1.Model;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Common;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using Energinet.DataHub.WebApi.Modules.RevisionLog;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Models;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations;

public static partial class CalculationOperations
{
    [Query]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<ICalculationsQueryResultV1?> GetCalculationByIdAsync(
        Guid id,
        ICalculationsClient client,
        IRevisionLogClient revisionLogClient,
        IHttpContextAccessor httpContextAccessor)
    {
        await revisionLogClient.LogAsync(
            RevisionLogActivity.GetCalculation,
            httpContextAccessor.GetRequestUrl(),
            null,
            RevisionLogEntityType.Calculation,
            id);

        return await client.GetCalculationByIdAsync(id);
    }

    [Query]
    [UsePaging]
    [UseSorting]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<IEnumerable<ICalculationsQueryResultV1>> GetCalculationsAsync(
        CalculationsQueryInput input,
        string? filter,
        ICalculationsClient client,
        IRevisionLogClient revisionLogClient,
        IHttpContextAccessor httpContextAccessor)
    {
        await revisionLogClient.LogAsync(
            RevisionLogActivity.SearchCalculation,
            httpContextAccessor.GetRequestUrl(),
            input,
            RevisionLogEntityType.Calculation,
            null);

        if (string.IsNullOrWhiteSpace(filter))
        {
            return await client.QueryCalculationsAsync(input);
        }

        try
        {
            var calculationId = Guid.Parse(filter);
            var calculation = await client.GetCalculationByIdAsync(calculationId);
            return calculation != null ? [calculation] : Array.Empty<ICalculationsQueryResultV1>();
        }
        catch (Exception)
        {
            return [];
        }
    }

    [Query]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<ICalculationsQueryResultV1?> GetLatestCalculationAsync(
        Interval period,
        StartCalculationType calculationType,
        ICalculationsClient client,
        IRevisionLogClient revisionLogClient,
        IHttpContextAccessor httpContextAccessor)
    {
        var calculationTypeQueryParameter = calculationType switch
        {
            StartCalculationType.Aggregation => CalculationTypeQueryParameterV1.Aggregation,
            StartCalculationType.BalanceFixing => CalculationTypeQueryParameterV1.BalanceFixing,
            StartCalculationType.WholesaleFixing => CalculationTypeQueryParameterV1.WholesaleFixing,
            StartCalculationType.FirstCorrectionSettlement => CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
            StartCalculationType.SecondCorrectionSettlement => CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
            StartCalculationType.ThirdCorrectionSettlement => CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
            StartCalculationType.CapacitySettlement => CalculationTypeQueryParameterV1.CapacitySettlement,
        };

        var input = new CalculationsQueryInput
        {
            Period = period,
            CalculationTypes = [calculationTypeQueryParameter],
            State = ProcessState.Succeeded,
        };

        await revisionLogClient.LogAsync(
            RevisionLogActivity.SearchCalculation,
            httpContextAccessor.GetRequestUrl(),
            input,
            RevisionLogEntityType.Calculation,
            null);

        var calculations = await client.QueryCalculationsAsync(input);
        return calculations.FirstOrDefault();
    }

    [Mutation]
    [Authorize(Roles = new[] { "calculations:manage" })]
    public static async Task<Guid> CreateCalculationAsync(
        CreateCalculationInput input,
        ICalculationsClient client,
        ITopicEventSender sender,
        IRevisionLogClient revisionLogClient,
        IHttpContextAccessor httpContextAccessor)
    {
        await revisionLogClient.LogAsync(
            input.ScheduledAt != null ? RevisionLogActivity.ScheduleCalculation : RevisionLogActivity.StartNewCalculation,
            httpContextAccessor.GetRequestUrl(),
            input,
            RevisionLogEntityType.Calculation,
            null);

        var calculationId = await client.StartCalculationAsync(input);

        await sender.SendAsync(nameof(CreateCalculationAsync), calculationId);

        return calculationId;
    }

    [Mutation]
    [Authorize(Roles = new[] { "calculations:manage" })]
    public static async Task<bool> CancelScheduledCalculationAsync(
        Guid calculationId,
        ICalculationsClient client,
        IRevisionLogClient revisionLogClient,
        IHttpContextAccessor httpContextAccessor)
    {
        await revisionLogClient.LogAsync(
            RevisionLogActivity.CancelScheduledCalculation,
            httpContextAccessor.GetRequestUrl(),
            calculationId,
            RevisionLogEntityType.Calculation,
            calculationId);
        return await client.CancelScheduledCalculationAsync(calculationId);
    }

    [Subscription]
    [Subscribe(With = nameof(OnCalculationUpdatedAsync))]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static ICalculationsQueryResultV1 CalculationUpdated(
        [EventMessage] ICalculationsQueryResultV1 calculation) => calculation;

    private static IObservable<ICalculationsQueryResultV1> OnCalculationUpdatedAsync(
        ITopicEventReceiver eventReceiver,
        ICalculationsClient client,
        CancellationToken ct)
    {
        return Observable
            .FromAsync(() => client.GetNonTerminatedCalculationsAsync(ct))
            .SelectMany(calculations => calculations)
            .Select(calculation => calculation.GetId())
            .Merge(eventReceiver.Observe<Guid>(nameof(CreateCalculationAsync), ct))
            .SelectMany(id => Observable
                .Interval(TimeSpan.FromSeconds(10))
                .Select(_ => id)
                .StartWith(id)
                .SelectMany(id => client.GetCalculationByIdAsync(id, ct))
                .SelectMany(c => c is not null ? Observable.Return(c) : Observable.Empty<ICalculationsQueryResultV1>())
                .DistinctUntilChanged(calculation => calculation.GetLifecycle().State)
                .TakeUntil(calculation => calculation.GetLifecycle().TerminationState is not null));
    }
}
