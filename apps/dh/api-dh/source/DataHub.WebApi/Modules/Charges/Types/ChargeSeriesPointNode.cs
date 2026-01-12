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
using Energinet.DataHub.WebApi.Modules.Charges.Models;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Charges.Types;

[ObjectType<ChargeSeriesPointDto>]
public static partial class ChargeSeriesPointNode
{
    static partial void Configure(IObjectTypeDescriptor<ChargeSeriesPointDto> descriptor)
    {
        descriptor.Name("ChargeSeriesPoint");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Price);
        descriptor.Field("hasChanged").Resolve(() => false);
        descriptor.Field(f => new Interval(f.From, f.To)).Name("period");
        descriptor
            .Field(f => new[] { new ChargeSeriesPointChange(f.Price, true, null) })
            .Name("changes")
            .Type<NonNullType<ListType<NonNullType<ObjectType<ChargeSeriesPointChange>>>>>();
    }
}
