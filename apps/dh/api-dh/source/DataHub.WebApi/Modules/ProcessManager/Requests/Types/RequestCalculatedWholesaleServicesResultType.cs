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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_023_027.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.BRS_028.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using NodaTime;
using PriceType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.PriceType;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public class RequestCalculatedWholesaleServicesResultType
    : ObjectType<RequestCalculatedWholesaleServicesResult>
{
    protected override void Configure(
        IObjectTypeDescriptor<RequestCalculatedWholesaleServicesResult> descriptor)
    {
        descriptor
            .Name("RequestCalculatedWholesaleServicesResult")
            .BindFieldsExplicitly()
            .Implements<ActorRequestQueryResultType>();

        // TODO: Enums are now strings, why?
        descriptor
            .Field("calculationType")
            .Resolve(c => c.Parent<RequestCalculatedWholesaleServicesResult>().ParameterValue.BusinessReason switch
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
            .Field("priceType")
            .Resolve(c => c.Parent<RequestCalculatedWholesaleServicesResult>()
                .ParameterValue
                .ChargeTypes?
                .Select<RequestCalculatedWholesaleServicesInputV1.ChargeTypeInput, PriceType?>(chargeTypeInput =>
                    chargeTypeInput.ChargeType is not null
                        ? Enum.Parse<PriceType>(chargeTypeInput.ChargeType)
                        : null)
                .FirstOrDefault());

        // TODO: Why are the period properties string?
        descriptor
            .Field(f => new Interval(
                Instant.FromDateTimeOffset(DateTimeOffset.Parse(f.ParameterValue.PeriodStart)),
                f.ParameterValue.PeriodEnd == null ? null : Instant.FromDateTimeOffset(DateTimeOffset.Parse(f.ParameterValue.PeriodEnd))))
            .Name("period");
    }
}
