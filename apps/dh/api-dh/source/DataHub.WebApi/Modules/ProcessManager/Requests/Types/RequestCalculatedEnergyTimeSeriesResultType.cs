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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using NodaTime;
using MeteringPointType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.MeteringPointType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public class RequestCalculatedEnergyTimeSeriesResultType
    : ObjectType<RequestCalculatedEnergyTimeSeriesResult>
{
    protected override void Configure(
        IObjectTypeDescriptor<RequestCalculatedEnergyTimeSeriesResult> descriptor)
    {
        descriptor
            .Name("RequestCalculatedEnergyTimeSeriesResult")
            .BindFieldsExplicitly()
            .Implements<ActorRequestQueryResultType>();

        // TODO: Enums are now strings, why?
        descriptor
            .Field("calculationType")
            .Resolve(c => c.Parent<RequestCalculatedEnergyTimeSeriesResult>().ParameterValue.BusinessReason switch
            {
                "PreliminaryAggregation" => CalculationType.Aggregation,
                "BalanceFixing" => CalculationType.BalanceFixing,
                "WholesaleFixing" => CalculationType.WholesaleFixing,
                "FirstCorrection" => CalculationType.FirstCorrectionSettlement,
                "SecondCorrection" => CalculationType.SecondCorrectionSettlement,
                "ThirdCorrection" => CalculationType.ThirdCorrectionSettlement,
                _ => throw new ArgumentOutOfRangeException(),
            });

        // TODO: Enums are now strings, why?
        descriptor
            .Field("meteringPointType")
            .Resolve<MeteringPointType?>(c =>
                c.Parent<RequestCalculatedEnergyTimeSeriesResult>().ParameterValue.MeteringPointType switch
                {
                    null => null,
                    "Production" => MeteringPointType.Production,
                    "Exchange" => MeteringPointType.Exchange,
                    "NonProfiled" => MeteringPointType.NonProfiledConsumption,
                    "Flex" => MeteringPointType.FlexConsumption,
                    "Consumption" => MeteringPointType.TotalConsumption,
                    "" => MeteringPointType.TotalConsumption,
                    _ => throw new ArgumentOutOfRangeException(),
                });

        // TODO: DateTimeOffset's are now strings, why?
        descriptor
            .Field(f => new Interval(
                Instant.FromDateTimeOffset(DateTimeOffset.Parse(f.ParameterValue.PeriodStart)),
                f.ParameterValue.PeriodEnd == null ? null : Instant.FromDateTimeOffset(DateTimeOffset.Parse(f.ParameterValue.PeriodEnd))))
            .Name("period");
    }
}
