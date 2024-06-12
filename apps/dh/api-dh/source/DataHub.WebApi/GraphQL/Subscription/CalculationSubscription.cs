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
    public IObservable<CalculationDto> OnCalculationProgressAsync(
        [Service] ITopicEventReceiver eventReceiver,
        [Service] IWholesaleClient_V3 client,
        CancellationToken cancellationToken)
    {
        var calculationIdStream = eventReceiver
            .Observe<Guid>(nameof(Mutation.Mutation.CreateCalculationAsync), cancellationToken);

        var input = new CalculationQueryInput
            { ExecutionStates = [CalculationState.Pending, CalculationState.Executing] };

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
                .DistinctUntilChanged(calculation => calculation.ExecutionState)
                .TakeUntil((calculation) => calculation.ExecutionState switch
                {
                    CalculationState.Pending => false,
                    CalculationState.Executing => false,
                    _ => true,
                }));
    }

    [Subscribe(With = nameof(OnCalculationProgressAsync))]
    public CalculationDto CalculationProgress([EventMessage] CalculationDto calculation) =>
        calculation;
}
