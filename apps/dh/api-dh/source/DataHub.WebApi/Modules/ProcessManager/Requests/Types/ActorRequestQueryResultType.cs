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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Components.Abstractions.ValueObjects;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using Energinet.DataHub.WebApi.GraphQL.Scalars;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public class ActorRequestQueryResultType : InterfaceType<IActorRequestQueryResult>
{
    protected override void Configure(
        IInterfaceTypeDescriptor<IActorRequestQueryResult> descriptor)
    {
        descriptor.Implements<OrchestrationInstanceType<IInputParameterDto>>();

        descriptor
            .Field("calculationType")
            .Resolve(c =>
            {
                var parent = c.Parent<IActorRequestQueryResult>();

                var businessReason = parent switch
                {
                    RequestCalculatedEnergyTimeSeriesResult energyResult =>
                        energyResult.ParameterValue.BusinessReason,
                    RequestCalculatedWholesaleServicesResult wholesaleResult =>
                        wholesaleResult.ParameterValue.BusinessReason,
                    _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult"),
                };

                var settlementVersion = parent switch
                {
                    RequestCalculatedEnergyTimeSeriesResult energyResult =>
                        energyResult.ParameterValue.SettlementVersion,
                    RequestCalculatedWholesaleServicesResult wholesaleResult =>
                        wholesaleResult.ParameterValue.SettlementVersion,
                    _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult"),
                };

                return businessReason switch
                {
                    nameof(BusinessReason.PreliminaryAggregation) => "AGGREGATION",
                    nameof(BusinessReason.BalanceFixing) => "BALANCE_FIXING",
                    nameof(BusinessReason.WholesaleFixing) => "WHOLESALE_FIXING",
                    nameof(BusinessReason.Correction) => settlementVersion switch
                    {
                        nameof(SettlementVersion.FirstCorrection) => "FIRST_CORRECTION_SETTLEMENT",
                        nameof(SettlementVersion.SecondCorrection) => "SECOND_CORRECTION_SETTLEMENT",
                        nameof(SettlementVersion.ThirdCorrection) => "THIRD_CORRECTION_SETTLEMENT",
                        null => "LATEST_CORRECTION",
                        _ => "UNKNOWN",
                    },
                    _ => "UNKNOWN",
                };
            });

        descriptor
            .Field("period")
            .Type<DateRangeType>()
            .Resolve(c =>
            {
                var parent = c.Parent<IActorRequestQueryResult>();

                var maybePeriodStart = parent switch
                {
                    RequestCalculatedEnergyTimeSeriesResult energyResult =>
                        energyResult.ParameterValue.PeriodStart,
                    RequestCalculatedWholesaleServicesResult wholesaleResult =>
                        wholesaleResult.ParameterValue.PeriodStart,
                    _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult"),
                };

                var maybePeriodEnd = parent switch
                {
                    RequestCalculatedEnergyTimeSeriesResult energyResult =>
                        energyResult.ParameterValue.PeriodEnd,
                    RequestCalculatedWholesaleServicesResult wholesaleResult =>
                        wholesaleResult.ParameterValue.PeriodEnd,
                    _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult"),
                };

                // Bail out if the period start is not a valid date
                if (!DateTimeOffset.TryParse(maybePeriodStart, out var periodStart)) return null;
                var hasPeriodEnd = DateTimeOffset.TryParse(maybePeriodEnd, out var periodEnd);

                // Bail out if the period end comes before period start
                if (hasPeriodEnd && periodStart > periodEnd) return null;

                return new Interval(
                    Instant.FromDateTimeOffset(periodStart),
                    hasPeriodEnd ? Instant.FromDateTimeOffset(periodEnd) : null);
            });
    }
}
