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
            });

        descriptor
            .Field("progress")
            .Type<NonNullType<ListType<NonNullType<ObjectType<CalculationProgress>>>>>()
            .Resolve(context =>
            {
                var state = context.Parent<CalculationDto>().OrchestrationState;
                return new List<CalculationProgress>
                {
                    GetCalculationProgress(CalculationProgressStep.Schedule, state),
                    GetCalculationProgress(CalculationProgressStep.Calculate, state),
                    GetCalculationProgress(CalculationProgressStep.ActorMessageEnqueue, state),
                };
            });
    }

    private static CalculationProgress GetCalculationProgress(
        CalculationProgressStep step,
        CalculationOrchestrationState state) =>
        step switch
        {
            CalculationProgressStep.Schedule => state switch {
                CalculationOrchestrationState.Scheduled => new(step, ProgressStatus.Pending, true),
                CalculationOrchestrationState.Calculating => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.CalculationFailed => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.Calculated => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.ActorMessagesEnqueuing => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.ActorMessagesEnqueued => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.Completed => new(step, ProgressStatus.Completed, false),
            },
            CalculationProgressStep.Calculate => state switch {
                CalculationOrchestrationState.Scheduled => new(step, ProgressStatus.Pending, false),
                CalculationOrchestrationState.Calculating => new(step, ProgressStatus.Executing, true),
                CalculationOrchestrationState.CalculationFailed => new(step, ProgressStatus.Failed, true),
                CalculationOrchestrationState.Calculated => new(step, ProgressStatus.Completed, true),
                CalculationOrchestrationState.ActorMessagesEnqueuing => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.ActorMessagesEnqueued => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => new(step, ProgressStatus.Completed, false),
                CalculationOrchestrationState.Completed => new(step, ProgressStatus.Completed, false),
            },
            CalculationProgressStep.ActorMessageEnqueue => state switch {
                CalculationOrchestrationState.Scheduled => new(step, ProgressStatus.Pending, false),
                CalculationOrchestrationState.Calculating => new(step, ProgressStatus.Pending, false),
                CalculationOrchestrationState.CalculationFailed => new(step, ProgressStatus.Pending, false),
                CalculationOrchestrationState.Calculated => new(step, ProgressStatus.Pending, false),
                CalculationOrchestrationState.ActorMessagesEnqueuing => new(step, ProgressStatus.Executing, true),
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => new(step, ProgressStatus.Failed, true),
                CalculationOrchestrationState.ActorMessagesEnqueued => new(step, ProgressStatus.Completed, true),
                CalculationOrchestrationState.Completed => new(step, ProgressStatus.Completed, true),
            },
        };
}
