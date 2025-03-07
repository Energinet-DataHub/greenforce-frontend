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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Types;

[ObjectType<ProcessDelegation>]
public static partial class MessageDelegationType
{
    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] ProcessDelegation result,
        GridAreas.IGridAreaByIdDataLoader dataLoader,
        CancellationToken ct) =>
        await dataLoader.LoadAsync(result.GridAreaId, ct).ConfigureAwait(false);

    public static async Task<ActorDto?> GetDelegatedByAsync(
        [Parent] ProcessDelegation actor,
        IActorByIdDataLoader dataLoader,
        CancellationToken ct) =>
        await dataLoader.LoadAsync(actor.DelegatedBy, ct).ConfigureAwait(false);

    public static async Task<ActorDto?> GetDelegatedToAsync(
        [Parent] ProcessDelegation actor,
        IActorByIdDataLoader dataLoader,
        CancellationToken ct) =>
        await dataLoader.LoadAsync(actor.DelegatedTo, ct).ConfigureAwait(false);

    static partial void Configure(IObjectTypeDescriptor<ProcessDelegation> descriptor)
    {
        descriptor
            .Name("MessageDelegationType")
            .BindFieldsExplicitly();

        descriptor
            .Field(f => f.PeriodId);

        descriptor
            .Field(f => f.Id);

        descriptor
            .Field(f => f.Process);

        descriptor
            .Field(f => f.ValidPeriod);

        descriptor
            .Field("status")
            .Resolve((ctx) => ctx.Parent<ProcessDelegation>().Status());
    }
}
