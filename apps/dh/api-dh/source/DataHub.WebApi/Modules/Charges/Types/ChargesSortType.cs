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
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Organization.Types;

public sealed class ChargesSortType : SortInputType<ChargeDto>
{
    protected override void Configure(ISortInputTypeDescriptor<ChargeDto> descriptor)
    {
        descriptor.Name("ChargesSortInput");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.ChargeId).Name("id");
        descriptor.Field(f => f.ChargeName).Name("name");
        descriptor.Field(f => f.ChargeType).Name("type");
        descriptor.Field(f => f.ChargeOwner).Name("owner");
        descriptor.Field(f => f.Status);
    }
}
