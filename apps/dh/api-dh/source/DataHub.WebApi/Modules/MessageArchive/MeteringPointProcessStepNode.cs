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
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Client;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive;

[ObjectType<MeteringPointProcessStep>]
public static partial class MeteringPointProcessStepNode
{
    public static async Task<ActorDto?> GetActorAsync(
        [Parent] MeteringPointProcessStep step,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader) =>
        Enum.TryParse<EicFunction>(step.ActorRole, out var role)
            ? await dataLoader.LoadAsync((step.ActorNumber, role))
            : null;

    public static async Task<ArchivedMessage?> GetMessageAsync(
        [Parent] MeteringPointProcessStep step,
        [Service] IArchivedMessageClient client)
    {
        if (step.MessageId == null)
        {
            return null;
        }

        var result = await client.GetArchivedMessagesByIdAsync(
            step.MessageId,
            includeRelated: false,
            first: 1,
            after: null,
            last: null,
            before: null,
            order: null);

        return result.Edges != null && result.Edges.Count > 0
            ? result.Edges[0].Node
            : null;
    }

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcessStep> descriptor)
    {
        descriptor.Name("MeteringPointProcessStep");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.Step);
        descriptor.Field(f => f.Comment);
        descriptor.Field(f => f.CompletedAt);
        descriptor.Field(f => f.DueDate);
        descriptor.Field(f => f.State);
        descriptor.Field(f => f.MessageId);
    }
}
