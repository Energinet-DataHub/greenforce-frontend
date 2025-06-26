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
using Energinet.DataHub.WebApi.Modules.Common.Extensions;
using Energinet.DataHub.WebApi.Modules.Common.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Extensions;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Models;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

namespace Energinet.DataHub.WebApi.Modules.Processes.Calculations;

public static partial class CalculationOperations
{
    [Query]
    [UseRevisionLog]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<ICalculationsQueryResultV1?> GetCalculationByIdAsync(
        Guid id,
        ICalculationsClient client,
        IHttpContextAccessor httpContextAccessor) =>
        await client.GetCalculationByIdAsync(id);

    [Query]
    [UsePaging]
    [UseSorting]
    [UseRevisionLog]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<IEnumerable<ICalculationsQueryResultV1>> GetCalculationsAsync(
        CalculationsQueryInput input,
        string? filter,
        ICalculationsClient client,
        IHttpContextAccessor httpContextAccessor)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return await client.QueryCalculationsAsync(input);
        }

        if (Guid.TryParse(filter, out var calculationId))
        {
            var calculation = await client.GetCalculationByIdAsync(calculationId);
            if (calculation is not null)
            {
                return [calculation];
            }
        }

        return [];
    }

    [Query]
    [UseRevisionLog]
    [Authorize(Roles = new[] { "calculations:view", "calculations:manage" })]
    public static async Task<ICalculationsQueryResultV1?> GetLatestCalculationAsync(
        StartCalculationType calculationType,
        PeriodInput period,
        ICalculationsClient client,
        IHttpContextAccessor httpContextAccessor) =>
        await client.GetLatestCalculationAsync(calculationType, period);

    [Mutation]
    [UseRevisionLog]
    [Authorize(Roles = new[] { "calculations:manage" })]
    public static async Task<Guid> CreateCalculationAsync(
        CreateCalculationInput input,
        ICalculationsClient client,
        ITopicEventSender sender,
        IHttpContextAccessor httpContextAccessor)
    {
        var calculationId = await client.StartCalculationAsync(input);
        await sender.SendAsync(nameof(CreateCalculationAsync), calculationId);
        return calculationId;
    }

    [Mutation]
    [UseRevisionLog]
    [Authorize(Roles = new[] { "calculations:manage" })]
    public static async Task<bool> CancelScheduledCalculationAsync(
        Guid id,
        ICalculationsClient client,
        IHttpContextAccessor httpContextAccessor) =>
        await client.CancelScheduledCalculationAsync(id);

    [Subscription]
    [Subscribe(With = nameof(OnCalculationUpdatedAsync))]
    [UseRevisionLog]
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
