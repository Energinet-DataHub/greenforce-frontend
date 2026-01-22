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

public static class DisconnectionTypeMapper
{
    public static Clients.ElectricityMarket.v1.DisconnectionType? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType disconnectionType)
    {
        return disconnectionType switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Remote => Clients.ElectricityMarket.v1.DisconnectionType.RemoteDisconnection,
            DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Manual => Clients.ElectricityMarket.v1.DisconnectionType.ManualDisconnection,
            DataHub.ElectricityMarket.Abstractions.Shared.DisconnectionType.Unknown => null,
        };
    }

    public static DisconnectionType? MapToDto(this Clients.ElectricityMarket.v1.DisconnectionType disconnectionType)
    {
        return disconnectionType switch
        {
            Clients.ElectricityMarket.v1.DisconnectionType.RemoteDisconnection => DisconnectionType.RemoteDisconnection,
            Clients.ElectricityMarket.v1.DisconnectionType.ManualDisconnection => DisconnectionType.ManualDisconnection,
        };
    }
}
