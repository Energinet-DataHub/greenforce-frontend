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
            .Field(f => f.IsInternalCalculation ? CalculationExecutionType.Internal : CalculationExecutionType.External)
            .Name("executionType");

        descriptor
            .Field("statusType")
            .Resolve(context => context.Parent<CalculationDto>().OrchestrationState switch
            {
                CalculationOrchestrationState.Scheduled => UIProcessStatus.Neutral,
                CalculationOrchestrationState.Canceled => UIProcessStatus.Neutral,
                CalculationOrchestrationState.Started => UIProcessStatus.Info,
                CalculationOrchestrationState.Calculating => UIProcessStatus.Info,
                CalculationOrchestrationState.CalculationFailed => UIProcessStatus.Danger,
                CalculationOrchestrationState.Calculated => UIProcessStatus.Info,
                CalculationOrchestrationState.ActorMessagesEnqueuing => UIProcessStatus.Info,
                CalculationOrchestrationState.ActorMessagesEnqueuingFailed => UIProcessStatus.Danger,
                CalculationOrchestrationState.ActorMessagesEnqueued => UIProcessStatus.Info,
                CalculationOrchestrationState.Completed => UIProcessStatus.Success,
            });

        descriptor
            .Field("currentStep")
            .Resolve(context => GetProgressStep(context.Parent<CalculationDto>()));

        descriptor
            .Field("progress")
            .Type<NonNullType<ListType<NonNullType<ObjectType<CalculationProgress>>>>>()
            .Resolve(context =>
            {
                var calculation = context.Parent<CalculationDto>();
                var state = calculation.OrchestrationState;

                var scheduleStep = new CalculationProgress()
                {
                    Step = CalculationProgressStep.Schedule,
                    Status = GetScheduleProgressStatus(state),
                };

                var calculateStep = new CalculationProgress()
                {
                    Step = CalculationProgressStep.Calculate,
                    Status = GetCalculateProgressStatus(state),
                };

                var actorMessageEnqueueStep = new CalculationProgress()
                {
                    Step = CalculationProgressStep.ActorMessageEnqueue,
                    Status = GetActorMessageEnqueueProgressStatus(state),
                };

                return calculation.IsInternalCalculation
                    ? new List<CalculationProgress> { scheduleStep, calculateStep }
                    : [scheduleStep, calculateStep, actorMessageEnqueueStep];
            });
    }

    /// <summary>
    /// Get the current progress step from a calculation.
    /// </summary>
    /// <param name="calculation">The calculation to get progress step from.</param>
    /// <returns>The progress step the orchestration state belongs to.</returns>
    private static CalculationProgressStep GetProgressStep(CalculationDto calculation) =>
        calculation.OrchestrationState switch
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
            CalculationOrchestrationState.Completed when calculation.IsInternalCalculation => CalculationProgressStep.Calculate,
            CalculationOrchestrationState.Completed => CalculationProgressStep.ActorMessageEnqueue,
        };

    /// <summary>
    /// Get the progress status of the schedule step based on the orchestration state.
    /// </summary>
    /// <param name="state">The orchestration state of the calculation.</param>
    /// <returns>The progress status of the schedule step.</returns>
    private static UIProgressStatus GetScheduleProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => UIProgressStatus.Pending,
            CalculationOrchestrationState.Canceled => UIProgressStatus.Canceled,
            CalculationOrchestrationState.Started => UIProgressStatus.Completed,
            CalculationOrchestrationState.Calculating => UIProgressStatus.Completed,
            CalculationOrchestrationState.CalculationFailed => UIProgressStatus.Completed,
            CalculationOrchestrationState.Calculated => UIProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuing => UIProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => UIProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueued => UIProgressStatus.Completed,
            CalculationOrchestrationState.Completed => UIProgressStatus.Completed,
        };

    /// <summary>
    /// Get the progress status of the calculate step based on the orchestration state.
    /// </summary>
    /// <param name="state">The orchestration state of the calculation.</param>
    /// <returns>The progress status of the calculate step.</returns>
    private static UIProgressStatus GetCalculateProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => UIProgressStatus.Pending,
            CalculationOrchestrationState.Canceled => UIProgressStatus.Pending,
            CalculationOrchestrationState.Started => UIProgressStatus.Executing,
            CalculationOrchestrationState.Calculating => UIProgressStatus.Executing,
            CalculationOrchestrationState.CalculationFailed => UIProgressStatus.Failed,
            CalculationOrchestrationState.Calculated => UIProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuing => UIProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => UIProgressStatus.Completed,
            CalculationOrchestrationState.ActorMessagesEnqueued => UIProgressStatus.Completed,
            CalculationOrchestrationState.Completed => UIProgressStatus.Completed,
        };

    /// <summary>
    /// Get the progress status of the actor message enqueue step based on the orchestration state.
    /// </summary>
    /// <param name="state">The orchestration state of the calculation.</param>
    /// <returns>The progress status of the actor message enqueue step.</returns>
    private static UIProgressStatus GetActorMessageEnqueueProgressStatus(CalculationOrchestrationState state) =>
        state switch
        {
            CalculationOrchestrationState.Scheduled => UIProgressStatus.Pending,
            CalculationOrchestrationState.Canceled => UIProgressStatus.Pending,
            CalculationOrchestrationState.Started => UIProgressStatus.Pending,
            CalculationOrchestrationState.Calculating => UIProgressStatus.Pending,
            CalculationOrchestrationState.CalculationFailed => UIProgressStatus.Pending,
            CalculationOrchestrationState.Calculated => UIProgressStatus.Pending,
            CalculationOrchestrationState.ActorMessagesEnqueuing => UIProgressStatus.Executing,
            CalculationOrchestrationState.ActorMessagesEnqueuingFailed => UIProgressStatus.Failed,
            CalculationOrchestrationState.ActorMessagesEnqueued => UIProgressStatus.Completed,
            CalculationOrchestrationState.Completed => UIProgressStatus.Completed,
        };
}
