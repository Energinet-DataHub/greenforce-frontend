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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Charges;

[ObjectType<ChargeLinkPeriodDto>]
public static partial class ChargeLinkPeriodDtoType
{
    static partial void Configure(IObjectTypeDescriptor<ChargeLinkPeriodDto> descriptor)
    {
        descriptor.Name("ChargeLinkPeriod");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => new Interval(f.From, f.To)).Name("period");
        descriptor.Field(f => f.Factor).Name("amount");
        descriptor.Field(f => f.GetHashCode()).Name("id");
        // TODO: missing an id to cache on
    }
}
