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

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeLinkPeriodChange>]
public static partial class ChargeLinkPeriodChangeNode
{
    public static DateTimeOffset GetCreated([Parent] ChargeLinkPeriodChange change)
        => change.Current.Created.ToDateTimeOffset();

    public static DateTimeOffset? GetStopDate([Parent] ChargeLinkPeriodChange change)
        => change.Current.To?.ToDateTimeOffset();

    public static int GetFactor([Parent] ChargeLinkPeriodChange change)
        => change.Current.Factor;

    public static int? GetPreviousFactor([Parent] ChargeLinkPeriodChange change)
        => change.Previous?.Factor;

    public static string GetOrchestrationInstanceId([Parent] ChargeLinkPeriodChange change)
        => change.Current.OrchestrationInstanceId;

    public static ChargeLinkPeriodChangeType GetChangeType([Parent] ChargeLinkPeriodChange change)
    {
        if (change.Previous is null) return ChargeLinkPeriodChangeType.Started;
        if (change.Current.From == change.Current.To) return ChargeLinkPeriodChangeType.Cancelled;
        if (change.Previous.From == change.Previous.To) return ChargeLinkPeriodChangeType.Started;
        if (change.Current.Factor != change.Previous.Factor) return ChargeLinkPeriodChangeType.Edited;
        return ChargeLinkPeriodChangeType.Stopped;
    }

    static partial void Configure(IObjectTypeDescriptor<ChargeLinkPeriodChange> descriptor)
    {
        descriptor.BindFieldsExplicitly();
    }
}
