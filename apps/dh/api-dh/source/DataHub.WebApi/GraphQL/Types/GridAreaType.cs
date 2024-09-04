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
using Energinet.DataHub.WebApi.GraphQL.Enums;

namespace Energinet.DataHub.WebApi.GraphQL.Types;

public class GridAreaType : ObjectType<GridAreaDto>
{
    // This list should be replaced with data from the MarketParticipant API once available
    private readonly List<string> _includedInCalculation = [
        "003", "007", "016", "031", "042", "051", "084", "085", "131", "141", "151", "154", "233",
        "244", "245", "331", "341", "342", "344", "347", "348", "351", "357", "370", "371", "381",
        "384", "385", "396", "531", "532", "533", "543", "584", "740", "757", "791", "853", "854",
        "860", "911", "950", "951", "952", "953", "954", "960", "962", "990"];

    protected override void Configure(IObjectTypeDescriptor<GridAreaDto> descriptor)
    {
        descriptor.Name("GridAreaDto");

        descriptor
            .Field(f => f.PriceAreaCode)
            .Name("priceAreaCode")
            .Resolve(context =>
                Enum.Parse<PriceAreaCode>(context.Parent<GridAreaDto>().PriceAreaCode));

        descriptor
            .Field("displayName")
            .Type<NonNullType<StringType>>()
            .Resolve(context => context.Parent<GridAreaDto>() switch
            {
                null => string.Empty,
                var gridArea when string.IsNullOrWhiteSpace(gridArea.Name) => gridArea.Code,
                var gridArea => $"{gridArea.Code} • {gridArea.Name}",
            });

        descriptor
            .Field("includedInCalculation")
            .Resolve(context => _includedInCalculation.Contains(context.Parent<GridAreaDto>().Code));
    }
}
