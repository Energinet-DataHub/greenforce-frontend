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

using System;
using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;
using HotChocolate.Types;

namespace Energinet.DataHub.WebApi.GraphQL;

public class ImbalancePrice : ObjectType<ImbalancePriceDto>
{
    protected override void Configure(IObjectTypeDescriptor<ImbalancePriceDto> descriptor)
    {
        descriptor.Name("ImbalancePrice");
        descriptor.Description("Imbalance price");

        descriptor.Field(x => x.PriceAreaCode)
            .Name("priceAreaCode")
            .Description("Imbalance price period")
            .Resolve(context =>
                {
                    return context.Parent<ImbalancePriceDto>().PriceAreaCode switch
                    {
                        PriceAreaCode.AreaCode1 => Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto.PriceAreaCode.Dk1,
                        PriceAreaCode.AreaCode2 => Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto.PriceAreaCode.Dk2,
                        _ => throw new ArgumentOutOfRangeException(nameof(ImbalancePriceDto.PriceAreaCode)),
                };
            });
    }
}
