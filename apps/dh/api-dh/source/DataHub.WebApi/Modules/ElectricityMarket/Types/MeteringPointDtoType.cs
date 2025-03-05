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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Extensions;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Types;

[ObjectType<MeteringPointDto>]
public static partial class MeteringPointDtoType
{
    public static string MeteringPointId([Parent] MeteringPointDto meteringPoint) => meteringPoint.Identification;

    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] MeteringPointDto meteringPointPeriod,
        MarketParticipant.GridAreas.IGridAreaByCodeDataLoader dataLoader) =>
            await dataLoader.LoadAsync(meteringPointPeriod.Metadata.GridAreaCode);

    public static async Task<GridAreaDto?> GetFromGridAreaAsync(
        [Parent] MeteringPointDto meteringPointPeriod,
        MarketParticipant.GridAreas.IGridAreaByCodeDataLoader dataLoader)
    {
        if (meteringPointPeriod.Metadata.FromGridAreaCode == null)
        {
            return null;
        }

        return await dataLoader.LoadAsync(meteringPointPeriod.Metadata.FromGridAreaCode);
    }

    public static async Task<GridAreaDto?> GetToGridAreaAsync(
        [Parent] MeteringPointDto meteringPointPeriod,
        MarketParticipant.GridAreas.IGridAreaByCodeDataLoader dataLoader)
    {
        if (meteringPointPeriod.Metadata.ToGridAreaCode == null)
        {
            return null;
        }

        return await dataLoader.LoadAsync(meteringPointPeriod.Metadata.ToGridAreaCode);
    }

    static partial void Configure(
        IObjectTypeDescriptor<MeteringPointDto> descriptor)
    {
        descriptor
            .Field(f => f.Metadata.GridAreaCode)
            .Ignore();

        descriptor
            .Field(f => f.Metadata.FromGridAreaCode)
            .Ignore();

        descriptor
            .Field(f => f.Metadata.ToGridAreaCode)
            .Ignore();
    }
}
