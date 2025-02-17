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
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Extensions;

public static class ActorRequestQueryResultExtensions
{
    public static OrchestrationInstanceLifecycleDto GetLifecycle(
        this IActorRequestQueryResult result)
    {
        var orchestrationInstance = (IOrchestrationInstanceTypedDto<IInputParameterDto>)result;
        return orchestrationInstance.Lifecycle;
    }

    public static string GetCalculationType(
        this IActorRequestQueryResult result) => result switch
        {
            RequestCalculatedEnergyTimeSeriesResult request => request.ParameterValue.BusinessReason,
            RequestCalculatedWholesaleServicesResult request => request.ParameterValue.BusinessReason,
            _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult type"),
        };

    public static string GetPeriodStart(
        this IActorRequestQueryResult result) => result switch
        {
            RequestCalculatedEnergyTimeSeriesResult request => request.ParameterValue.PeriodStart,
            RequestCalculatedWholesaleServicesResult request => request.ParameterValue.PeriodStart,
            _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult type"),
        };

    public static string? GetMeteringPointTypeOrPriceTypeSortProperty(
        this IActorRequestQueryResult result) => result switch
        {
            RequestCalculatedEnergyTimeSeriesResult request =>
                request.ParameterValue.MeteringPointType,
            RequestCalculatedWholesaleServicesResult request =>
                string.Join(
                    ", ",
                    request.ParameterValue.ChargeTypes?.Select(x => x.ChargeType).FirstOrDefault()),
            _ => throw new InvalidOperationException("Unknown ActorRequestQueryResult type"),
        };
}
