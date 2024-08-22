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
            .BindFieldsExplicitly()
            .Name("Calculation")
            .Description("An immutable calculation.");

        descriptor
            .Field(f => f.CalculationId)
            .Name("id");

        descriptor
            .Field(f => f.CalculationType);

        descriptor
            .Ignore(f => f.PeriodStart)
            .Ignore(f => f.PeriodEnd)
            .Field(f => new Interval(Instant.FromDateTimeOffset(f.PeriodStart), Instant.FromDateTimeOffset(f.PeriodEnd)))
            .Name("period");

        descriptor
            .Field(f => f.ExecutionTimeStart ?? f.ScheduledAt)
            .Name("executionTimeStart");

        descriptor
            .Field(f => f.CompletedTime)
            .Name("executionTimeEnd");

        descriptor
            .Field(f => f.CreatedByUserId)
            .Name("createdByUserName")
            .ResolveWith<WholesaleResolvers>(c => c.GetCreatedByUserNameAsync(default!, default!));

        descriptor
           .Field(f => f.GridAreaCodes)
           .Name("gridAreas")
           .ResolveWith<WholesaleResolvers>(c => c.GetGridAreasAsync(default!, default!));

        descriptor
            .Field(f => f.OrchestrationState)
            .Name("state");

        descriptor
            .Field("statusType")
            .Resolve(context => context.Parent<CalculationDto>().OrchestrationState switch
            {
                CalculationOrchestrationState.Scheduled => ProcessStatus.Neutral,
                CalculationOrchestrationState.Canceled => ProcessStatus.Neutral,
                CalculationOrchestrationState.Started => ProcessStatus.Info,
                CalculationOrchestrationState.Calculating => ProcessStatus.Info,
                CalculationOrchestrationState.CalculationFailed => ProcessStatus.Danger,
                CalculationOrchestrationState.Calculated => ProcessStatus.Info,
                CalculationOrchestrationState.ActorMessagesEnqueuing => ProcessStatus.Info,
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => ProcessStatus.Danger,
                CalculationOrchestrationState.ActorMessagesEnqueued => ProcessStatus.Info,
                CalculationOrchestrationState.Completed => ProcessStatus.Success,
            });

        descriptor
            .Field("currentStep")
            .Resolve(context => GetProgressStep(context.Parent<CalculationDto>().OrchestrationState));

        descriptor
            .Field("progress")
            .Type<NonNullType<ListType<NonNullType<ObjectType<CalculationProgress>>>>>()
            .Resolve(context =>
            {
                var state = context.Parent<CalculationDto>().OrchestrationState;
                return new List<CalculationProgress>
                {
                    new()
                    {
                        Step = CalculationProgressStep.Schedule,
                        Status = GetScheduleProgressStatus(state),
                    },
                    new()
                    {
                        Step = CalculationProgressStep.Calculate,
                        Status = GetCalculateProgressStatus(state),
                    },
                    new()
                    {
                        Step = CalculationProgressStep.ActorMessageEnqueue,
                        Status = GetActorMessageEnqueueProgressStatus(state),
                    },
                };
            });
    }

    /// <summary>
    /// Map one of the many orchestration states to a corresponding progress step.
    /// </summary>
    /// <param name="state">The orchestration state of the calculatio.n</param>
    /// <returns>The progress step the orchestration state belongs to.</returns>
    private static CalculationProgressStep GetProgressStep(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => CalculationProgressStep.Schedule,
            CalculationOrchestrationState.Canceled => CalculationProgressStep.Schedule,
            CalculationOrchestrationState.Started => CalculationProgressStep.Calculate,
            CalculationOrchestrationState.Calculating => CalculationProgressStep.Calculate,
            CalculationOrchestrationState.CalculationFailed => CalculationProgressStep.Calculate,
            CalculationOrchestrationState.Calculated => CalculationProgressStep.Calculate,
            CalculationOrchestrationState.ActorMessagesEnqueuing => CalculationProgressStep.ActorMessageEnqueue,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => CalculationProgressStep.ActorMessageEnqueue,
            CalculationOrchestrationState.ActorMessagesEnqueued => CalculationProgressStep.ActorMessageEnqueue,
            CalculationOrchestrationState.Completed => CalculationProgressStep.ActorMessageEnqueue,
        };

    /// <summary>
    /// Get the progress status of the schedule step based on the orchestration state.
    /// </summary>
    /// <param name="state">The orchestration state of the calculation.</param>
    /// <returns>The progress status of the schedule step.</returns>
    private static ProgressStatus GetScheduleProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => ProgressStatus.Pending,
            CalculationOrchestrationState.Canceled => ProgressStatus.Canceled,
            CalculationOrchestrationState.Started => ProgressStatus.Completed,
            CalculationOrchestrationState.Calculating => ProgressStatus.Completed,
            CalculationOrchestrationState.CalculationFailed => ProgressStatus.Completed,
            CalculationOrchestrationState.Calculated => ProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuing => ProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => ProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueued => ProgressStatus.Completed,
            CalculationOrchestrationState.Completed => ProgressStatus.Completed,
        };

    /// <summary>
    /// Get the progress status of the calculate step based on the orchestration state.
    /// </summary>
    /// <param name="state">The orchestration state of the calculation.</param>
    /// <returns>The progress status of the calculate step.</returns>
    private static ProgressStatus GetCalculateProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => ProgressStatus.Pending,
            CalculationOrchestrationState.Canceled => ProgressStatus.Pending,
            CalculationOrchestrationState.Started => ProgressStatus.Executing,
            CalculationOrchestrationState.Calculating => ProgressStatus.Executing,
            CalculationOrchestrationState.CalculationFailed => ProgressStatus.Failed,
            CalculationOrchestrationState.Calculated => ProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuing => ProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => ProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueued => ProgressStatus.Completed,
            CalculationOrchestrationState.Completed => ProgressStatus.Completed,
        };

    /// <summary>
    /// Get the progress status of the actor message enqueue step based on the orchestration state.
    /// </summary>
    /// <param name="state">The orchestration state of the calculation.</param>
    /// <returns>The progress status of the actor message enqueue step.</returns>
    private static ProgressStatus GetActorMessageEnqueueProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => ProgressStatus.Pending,
            CalculationOrchestrationState.Canceled => ProgressStatus.Pending,
            CalculationOrchestrationState.Started => ProgressStatus.Pending,
            CalculationOrchestrationState.Calculating => ProgressStatus.Pending,
            CalculationOrchestrationState.CalculationFailed => ProgressStatus.Pending,
            CalculationOrchestrationState.Calculated => ProgressStatus.Pending,
            CalculationOrchestrationState.ActorMessagesEnqueuing => ProgressStatus.Executing,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => ProgressStatus.Failed,
            CalculationOrchestrationState.ActorMessagesEnqueued => ProgressStatus.Completed,
            CalculationOrchestrationState.Completed => ProgressStatus.Completed,
        };
}
