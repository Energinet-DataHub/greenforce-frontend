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

public static class ConnectionStateMapper
{
    public static Clients.ElectricityMarket.v1.ConnectionState? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState connectionState)
    {
        return connectionState switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.New => Clients.ElectricityMarket.v1.ConnectionState.New,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Connected => Clients.ElectricityMarket.v1.ConnectionState.Connected,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Disconnected => Clients.ElectricityMarket.v1.ConnectionState.Disconnected,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.ClosedDown => Clients.ElectricityMarket.v1.ConnectionState.ClosedDown,
            DataHub.ElectricityMarket.Abstractions.Shared.ConnectionState.Unknown => null, // TODO: cabol - Should this map to NotUsed?
        };
    }

    public static ConnectionState? MapToDto(this Clients.ElectricityMarket.v1.ConnectionState connectionState)
    {
        return connectionState switch
        {
            Clients.ElectricityMarket.v1.ConnectionState.NotUsed => ConnectionState.NotUsed,
            Clients.ElectricityMarket.v1.ConnectionState.New => ConnectionState.New,
            Clients.ElectricityMarket.v1.ConnectionState.Connected => ConnectionState.Connected,
            Clients.ElectricityMarket.v1.ConnectionState.Disconnected => ConnectionState.Disconnected,
            Clients.ElectricityMarket.v1.ConnectionState.ClosedDown => ConnectionState.ClosedDown,
        };
    }
}
