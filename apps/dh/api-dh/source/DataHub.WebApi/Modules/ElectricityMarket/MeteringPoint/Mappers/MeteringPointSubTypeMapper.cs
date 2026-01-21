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

using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class MeteringPointSubTypeMapper
{
    public static Clients.ElectricityMarket.v1.MeteringPointSubType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType subType)
    {
        return subType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Physical => Clients.ElectricityMarket.v1.MeteringPointSubType.Physical,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Virtual => Clients.ElectricityMarket.v1.MeteringPointSubType.Virtual,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Calculated => Clients.ElectricityMarket.v1.MeteringPointSubType.Calculated,
            DataHub.ElectricityMarket.Abstractions.Shared.MeteringPointSubType.Unknown => null,
        };
    }

    public static MeteringPointSubType? MapToDto(this Clients.ElectricityMarket.v1.MeteringPointSubType subType)
    {
        return subType switch
        {
            Clients.ElectricityMarket.v1.MeteringPointSubType.Physical => MeteringPointSubType.Physical,
            Clients.ElectricityMarket.v1.MeteringPointSubType.Virtual => MeteringPointSubType.Virtual,
            Clients.ElectricityMarket.v1.MeteringPointSubType.Calculated => MeteringPointSubType.Calculated,
        };
    }
}
