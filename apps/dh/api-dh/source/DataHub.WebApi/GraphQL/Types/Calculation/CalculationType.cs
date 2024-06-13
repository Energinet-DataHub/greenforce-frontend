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
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Resolvers;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Calculation;

public class CalculationType : ObjectType<CalculationDto>
{
    protected override void Configure(IObjectTypeDescriptor<CalculationDto> descriptor)
    {
        descriptor
            .Name("Calculation")
            .Description("An immutable calculation.");

        descriptor
            .Field(x => x.CalculationId)
            .Name("id");

        descriptor
            .Ignore(x => x.PeriodStart)
            .Ignore(x => x.PeriodEnd)
            .Field(f => new Interval(Instant.FromDateTimeOffset(f.PeriodStart), Instant.FromDateTimeOffset(f.PeriodEnd)))
            .Name("period");

        descriptor
            .Field(f => f.CreatedByUserId)
            .Name("createdByUserName")
            .ResolveWith<WholesaleResolvers>(c => c.GetCreatedByUserNameAsync(default!, default!));

        descriptor
           .Field(f => f.GridAreaCodes)
           .Name("gridAreas")
           .ResolveWith<WholesaleResolvers>(c => c.GetGridAreasAsync(default!, default!));

        descriptor
            .Field("statusType")
            .Resolve(context => context.Parent<CalculationDto>().ExecutionState switch
            {
                CalculationState.Pending => ProcessStatus.Warning,
                CalculationState.Completed => ProcessStatus.Success,
                CalculationState.Failed => ProcessStatus.Danger,
                CalculationState.Executing => ProcessStatus.Info,
                _ => ProcessStatus.Info,
            });

        descriptor
            .Field("progress")
            .Resolve(context =>
            {
                var state = context.Parent<CalculationDto>().OrchestrationState;
                return new List<CalculationProgress>
                {
                    new(CalculationProgressStep.Schedule, GetScheduleProgressStatus(state)),
                    new(CalculationProgressStep.Calculate, GetCalculateProgressStatus(state)),
                    new(CalculationProgressStep.ActorMessageEnqueue, GetActorMessageEnqueueProgressStatus(state)),
                };
            });
    }

    private static CalculationProgressStatus GetScheduleProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => CalculationProgressStatus.Pending,
            CalculationOrchestrationState.Calculating => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.CalculationFailed => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.Calculated => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuing => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueued => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.Completed => CalculationProgressStatus.Completed,
        };

    private static CalculationProgressStatus GetCalculateProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => CalculationProgressStatus.Pending,
            CalculationOrchestrationState.Calculating => CalculationProgressStatus.Executing,
            CalculationOrchestrationState.CalculationFailed => CalculationProgressStatus.Failed,
            CalculationOrchestrationState.Calculated => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuing => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueued => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.Completed => CalculationProgressStatus.Completed,
        };

    private static CalculationProgressStatus GetActorMessageEnqueueProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => CalculationProgressStatus.Pending,
            CalculationOrchestrationState.Calculating => CalculationProgressStatus.Pending,
            CalculationOrchestrationState.CalculationFailed => CalculationProgressStatus.Pending,
            CalculationOrchestrationState.Calculated => CalculationProgressStatus.Pending,
            CalculationOrchestrationState.ActorMessagesEnqueuing => CalculationProgressStatus.Executing,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => CalculationProgressStatus.Failed,
            CalculationOrchestrationState.ActorMessagesEnqueued => CalculationProgressStatus.Completed,
            CalculationOrchestrationState.Completed => CalculationProgressStatus.Completed,
        };
}
