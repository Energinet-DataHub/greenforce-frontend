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
using Energinet.DataHub.WebApi.GraphQL.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.GridArea;

public class GridAreaDtoType : ObjectType<GridAreaDto>
{
    protected override void Configure(IObjectTypeDescriptor<GridAreaDto> descriptor)
    {
        descriptor.Name("GridAreaDto");

        descriptor
            .Field(f => f.PriceAreaCode)
            .Name("priceAreaCode")
            .ResolveWith<GridAreaResolvers>(c => c.ParsePriceAreaCode(default!));

        descriptor
            .Field("displayName")
            .Type<NonNullType<StringType>>()
            .ResolveWith<GridAreaResolvers>(c => c.DisplayName(default!));

        descriptor
            .Field("status")
            .ResolveWith<GridAreaResolvers>(c => c.CalculateGridAreaStatus(default!));

        descriptor
            .Field("includedInCalculation")
            .Resolve((context) => new[]
                {
                    GridAreaType.Transmission,
                    GridAreaType.Distribution,
                    GridAreaType.GridLossDK,
                    GridAreaType.Other,
                    GridAreaType.GridLossAbroad,
                }.Contains(context.Parent<GridAreaDto>().Type) && context.Parent<GridAreaDto>().Code != "312");

        /*
            Og så har vi et for meget - det er net 312, UDGÅET 2.4.2024 - Vestjyske Net 60 KV (Må først inaktiveres 1.3.2027) • GLN 5790000375318, som er helt specelt.
            Det er et net, som er af typen Distribution, og det er aktivt, selvom det kun skal med i vores beregninger frem til 1. januar 2024.
            Problematikken med dette net er, at det er nedlagt pr. 1. januar 2024, men netvirksomheden skal stadig kunne modtage vores korrektionsafregninger 3 år tilbage i tid fra1. januar 2024,
            så derfor kunne det ikke stå som Udløbet, som andre nedlagte net. De kan stå som udløbet, fordi de er fusioneret ind i andre net, og det er 312 ikke.
        */
    }
}
