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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Esett.Types;

[ObjectType<BalanceResponsibleResult>]
public static partial class BalanceResponsibleType
{
    private static readonly string _controllerName = "EsettExchange";

    public static string? GetStorageDocumentUrl(
        [Parent] BalanceResponsibleResult result,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] LinkGenerator linkGenerator) =>
            linkGenerator.GetUriByAction(
                httpContextAccessor.HttpContext!,
                "StorageDocument",
                _controllerName,
                new { documentId = result.Id });

    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] BalanceResponsibleResult result,
        IGridAreaByCodeDataLoader dataLoader) =>
        await dataLoader.LoadAsync(result.GridArea).ConfigureAwait(false);

    public static async Task<string?> GetEnergySupplierNameAsync(
        [Parent] BalanceResponsibleResult result,
        IActorNameByMarketRoleDataLoader dataLoader) =>
           (await dataLoader.LoadAsync((result.Supplier, EicFunction.EnergySupplier)))?.Value;

    public static async Task<string?> GetBalanceResponsibleNameAsync(
        [Parent] BalanceResponsibleResult result,
        IActorNameByMarketRoleDataLoader dataLoader) =>
            (await dataLoader.LoadAsync((result.BalanceResponsible, EicFunction.BalanceResponsibleParty)))?.Value;

    static partial void Configure(
        IObjectTypeDescriptor<BalanceResponsibleResult> descriptor)
    {
        descriptor.Name("BalanceResponsible");

        descriptor
            .Field(f => f.ValidFromDate)
            .Name("validPeriod")
            .Resolve((context) =>
            {
                var balanceResponsible = context.Parent<BalanceResponsibleResult>();
                return new Interval(Instant.FromDateTimeOffset(balanceResponsible.ValidFromDate), balanceResponsible.ValidToDate.HasValue ? Instant.FromDateTimeOffset(balanceResponsible.ValidToDate.Value) : null);
            });

        descriptor.Ignore(f => f.ValidToDate);
    }
}
