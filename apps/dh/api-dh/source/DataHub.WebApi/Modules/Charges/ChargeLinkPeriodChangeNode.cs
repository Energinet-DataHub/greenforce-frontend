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

using Energinet.DataHub.WebApi.Modules.Charges.Models;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeLinkPeriodChange>]
public static partial class ChargeLinkPeriodChangeNode
{
    public static DateTimeOffset GetCreated([Parent] ChargeLinkPeriodChange change)
        => change.CurrentPeriod.Created.ToDateTimeOffset();

    public static int GetFactor([Parent] ChargeLinkPeriodChange change)
        => change.CurrentPeriod.Factor;

    public static int? GetPreviousFactor([Parent] ChargeLinkPeriodChange change)
        => change.PreviousPeriod?.Factor;

    public static string GetOrchestrationInstanceId([Parent] ChargeLinkPeriodChange change)
        => change.CurrentPeriod.OrchestrationInstanceId;

    public static DateTimeOffset GetEffectiveDate([Parent] ChargeLinkPeriodChange change)
        => change.CurrentPeriod.To is not null && change.ChangeType == ChargeLinkPeriodChangeType.Stopped
            ? change.CurrentPeriod.To.Value.ToDateTimeOffset()
            : change.CurrentPeriod.From.ToDateTimeOffset();

    static partial void Configure(IObjectTypeDescriptor<ChargeLinkPeriodChange> descriptor)
    {
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.ChangeType);
    }
}
