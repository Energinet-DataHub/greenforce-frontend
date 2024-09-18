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
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Extensions;
using Energinet.DataHub.WebApi.GraphQL.Types.Calculation;
using HotChocolate.Subscriptions;

namespace Energinet.DataHub.WebApi.GraphQL.Subscription;

public class Subscription
{
    public IObservable<CalculationDto> OnCalculationUpdatedAsync(
        [Service] ITopicEventReceiver eventReceiver,
        [Service] IWholesaleClient_V3 client,
        CancellationToken cancellationToken)
    {
        var calculationIdStream = eventReceiver
          .Observe<Guid>(nameof(Mutation.Mutation.CreateCalculationAsync), cancellationToken);

        // Filter the list of states to only include those that are in progress
        var input = new CalculationQueryInput()
        {
            States = Enum.GetValues<CalculationOrchestrationState>().Where(IsInProgress).ToArray(),
        };

        return Observable
            .FromAsync(() => client.QueryCalculationsAsync(input))
            .SelectMany(calculations => calculations)
            .Select(calculation => calculation.CalculationId)
            .Merge(calculationIdStream)
            .SelectMany(id => Observable
                .Interval(TimeSpan.FromSeconds(10))
                .Select(_ => id)
                .StartWith(id)
                .SelectMany(client.GetCalculationAsync)
                .DistinctUntilChanged(calculation => calculation.OrchestrationState)
                .TakeUntil(calculation => !IsInProgress(calculation.OrchestrationState)));
    }

    [Subscribe(With = nameof(OnCalculationUpdatedAsync))]
    public CalculationDto CalculationUpdated([EventMessage] CalculationDto calculation) =>
        calculation;

    public bool IsInProgress(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => true,
            CalculationOrchestrationState.Canceled => false,
            CalculationOrchestrationState.Started => true,
            CalculationOrchestrationState.Calculating => true,
            CalculationOrchestrationState.CalculationFailed => false,
            CalculationOrchestrationState.Calculated => true,
            CalculationOrchestrationState.ActorMessagesEnqueuing => true,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => false,
            CalculationOrchestrationState.ActorMessagesEnqueued => false,
            CalculationOrchestrationState.Completed => false,
        };
}
