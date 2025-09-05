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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Extensions;
using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Types;

public sealed class GridAreaSortType : SortInputType<GridAreaOverviewItemDto>
{
    protected override void Configure(ISortInputTypeDescriptor<GridAreaOverviewItemDto> descriptor)
    {
        descriptor.Name("GridAreaSortInput");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Actor()).Name("actor");
        descriptor.Field(f => f.Code);
        descriptor.Field(f => f.OrganizationName).Name("organization");
        descriptor.Field(f => f.PriceAreaCode).Name("priceArea");
        descriptor.Field(f => f.Type);
        descriptor.Field(f => f.Status()).Name("status");
    }
}
