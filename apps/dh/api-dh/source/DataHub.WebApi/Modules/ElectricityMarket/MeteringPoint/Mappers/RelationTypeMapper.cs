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

public static class RelationTypeMapper
{
    public static Clients.ElectricityMarket.v1.CustomerRelationType MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.RelationType relationType)
    {
        return relationType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Technical => Clients.ElectricityMarket.v1.CustomerRelationType.Contact1,
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Juridical => Clients.ElectricityMarket.v1.CustomerRelationType.Contact4,
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Secondary => Clients.ElectricityMarket.v1.CustomerRelationType.Secondary,
            DataHub.ElectricityMarket.Abstractions.Shared.RelationType.Unknown => throw new InvalidOperationException("Invalid RelationType"),
        };
    }

    public static CustomerRelationType MapToDto(this Clients.ElectricityMarket.v1.CustomerRelationType relationType)
    {
        return relationType switch
        {
            Clients.ElectricityMarket.v1.CustomerRelationType.Contact1 => CustomerRelationType.Contact1,
            Clients.ElectricityMarket.v1.CustomerRelationType.Contact4 => CustomerRelationType.Contact4,
            Clients.ElectricityMarket.v1.CustomerRelationType.Secondary => CustomerRelationType.Secondary,
        };
    }
}
