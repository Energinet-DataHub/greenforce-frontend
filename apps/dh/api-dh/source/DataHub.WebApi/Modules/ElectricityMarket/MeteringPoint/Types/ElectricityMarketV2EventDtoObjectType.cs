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

using System.Text.Json;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V1;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Types;

public class ElectricityMarketV2EventDtoObjectType : ObjectType<GetMeteringPointResultDtoV1.EventDto>
{
    private static readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true,
    };

    protected override void Configure(IObjectTypeDescriptor<GetMeteringPointResultDtoV1.EventDto> descriptor)
    {
        descriptor.Name("ElectricityMarketV2EventDto");

        descriptor
            .Field(e => JsonSerializer.Serialize(
                e.Data,
                _serializerOptions))
            .Name("jsonData");
    }
}
