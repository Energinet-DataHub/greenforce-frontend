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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeSeries;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<Point>]
public static partial class ChargeSeriesPointNode
{
    public static bool IsCurrent([Parent] Point point) =>
        point.FromDateTime <= DateTimeOffset.Now && point.ToDateTime > DateTimeOffset.Now;

    static partial void Configure(IObjectTypeDescriptor<Point> descriptor)
    {
        descriptor.Name("ChargeSeriesPoint");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.FromDateTime);
        descriptor.Field(f => f.ToDateTime);
        descriptor.Field(f => f.Price);
    }
}
