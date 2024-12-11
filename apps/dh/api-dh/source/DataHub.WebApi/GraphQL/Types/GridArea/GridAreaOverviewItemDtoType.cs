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

using System.Text.RegularExpressions;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.GraphQL.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.GridArea;

public class GridAreaOverviewItemDtoType : ObjectType<GridAreaOverviewItemDto>
{
    protected override void Configure(IObjectTypeDescriptor<GridAreaOverviewItemDto> descriptor)
    {
        descriptor
            .Field(f => f.PriceAreaCode)
            .Name("priceAreaCode")
            .ResolveWith<GridAreaResolvers>(c => c.ParsePriceAreaCode(default!));

        descriptor
            .Field("displayName")
            .Type<NonNullType<StringType>>()
            .ResolveWith<GridAreaResolvers>(c => c.DisplayName(default!));

        descriptor
            .Field("actor")
            .Resolve((context) =>
            {
                var gridArea = context.Parent<GridAreaOverviewItemDto>();
                var actorNumber = gridArea.ActorNumber;
                var actorName = gridArea.ActorName;

                var glnRegex = new Regex("^[0-9]+$");

                if (string.IsNullOrEmpty(actorName) || string.IsNullOrEmpty(actorNumber))
                {
                    return string.Empty;
                }

                return $"{actorName} • {(glnRegex.IsMatch(actorNumber) ? "GLN" : "EIC")} {actorNumber}";
            });

        descriptor
           .Field("status")
           .ResolveWith<GridAreaResolvers>(c => c.CalculateGridAreaStatus(default!));

        descriptor
            .Field("auditLog")
            .Type<NonNullType<ListType<NonNullType<ObjectType<GridAreaAuditedChangeAuditLogDto>>>>>()
            .Resolve((context) =>
            {
                var gridArea = context.Parent<GridAreaOverviewItemDto>();
                var marketParticipantService = context.Service<IMarketParticipantClient_V1>();
                return marketParticipantService.GridAreaAuditAsync(gridArea.Id);
            });
    }
}
