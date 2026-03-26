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

public static class SettlementMethodMapper
{
    public static SettlementMethod? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod settlementMethod)
    {
        return settlementMethod switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.FlexSettled => SettlementMethod.FlexSettled,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.Profiled => SettlementMethod.Profiled,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.NonProfiled => SettlementMethod.NonProfiled,
            DataHub.ElectricityMarket.Abstractions.Shared.SettlementMethod.Unknown => null,
        };
    }

    public static SettlementMethod? MapToDto(this Clients.ElectricityMarket.v1.SettlementMethod settlementMethod)
    {
        return settlementMethod switch
        {
            Clients.ElectricityMarket.v1.SettlementMethod.FlexSettled => SettlementMethod.FlexSettled,
            Clients.ElectricityMarket.v1.SettlementMethod.Profiled => SettlementMethod.Profiled,
            Clients.ElectricityMarket.v1.SettlementMethod.NonProfiled => SettlementMethod.NonProfiled,
        };
    }
}
