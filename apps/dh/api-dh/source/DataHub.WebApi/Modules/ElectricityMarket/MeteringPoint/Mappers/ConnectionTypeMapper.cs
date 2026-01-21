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

public static class ConnectionTypeMapper
{
    public static Clients.ElectricityMarket.v1.ConnectionType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType connectionType)
    {
        return connectionType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Direct => Clients.ElectricityMarket.v1.ConnectionType.Direct,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Installation => Clients.ElectricityMarket.v1.ConnectionType.Installation,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionType.Unknown => null,
        };
    }

    public static ConnectionType? MapToDto(this Clients.ElectricityMarket.v1.ConnectionType connectionType)
    {
        return connectionType switch
        {
            Clients.ElectricityMarket.v1.ConnectionType.Direct => ConnectionType.Direct,
            Clients.ElectricityMarket.v1.ConnectionType.Installation => ConnectionType.Installation,
        };
    }
}
