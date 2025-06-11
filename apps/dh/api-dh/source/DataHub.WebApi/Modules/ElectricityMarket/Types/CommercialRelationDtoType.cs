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
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using MarketParticipant_EicFunction = Energinet.DataHub.WebApi.Clients.MarketParticipant.v1.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Types;

[ObjectType<CommercialRelationDto>]
public static partial class CommercialRelationDtoType
{
    public static bool HadElectricalHeating([Parent] CommercialRelationDto commercialRelation) =>
        commercialRelation.ActiveElectricalHeatingPeriods == null && commercialRelation.ElectricalHeatingPeriods.Count > 0;

    public static bool HaveElectricalHeating([Parent] CommercialRelationDto commercialRelation) =>
        commercialRelation.ActiveElectricalHeatingPeriods != null;

    public static DateTimeOffset? ElectricalHeatingStartDate([Parent] CommercialRelationDto commercialRelation) =>
        commercialRelation.ElectricalHeatingPeriods
            .Where(x => x.ValidFrom < DateTimeOffset.UtcNow && x.ValidTo == DateTimeOffset.MaxValue)
            .FirstOrDefault()
            ?.ValidFrom;

    public static async Task<ActorNameDto?> GetEnergySupplierNameAsync(
        [Parent] CommercialRelationDto commercialRelation,
        IActorNameByMarketRoleDataLoader dataLoader) =>
        await dataLoader.LoadAsync((commercialRelation?.EnergySupplier ?? string.Empty, MarketParticipant_EicFunction.EnergySupplier));
}
