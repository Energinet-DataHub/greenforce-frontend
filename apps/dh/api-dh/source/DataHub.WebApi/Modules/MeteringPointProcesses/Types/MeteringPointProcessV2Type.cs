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
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Types;
using Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Client;
using Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Models;

namespace Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Types;

/// <summary>
/// Temporary V2 GraphQL interface for metering point processes while the existing object type is migrated.
/// </summary>
public sealed class MeteringPointProcessV2Type : InterfaceType<IMeteringPointProcess>
{
    /// <inheritdoc />
    protected override void Configure(IInterfaceTypeDescriptor<IMeteringPointProcess> descriptor)
    {
        descriptor
            .Name("MeteringPointProcessV2")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.TransactionId);
        descriptor.Field(f => f.BusinessReason);
        descriptor.Field(f => f.CreatedAt);
        descriptor.Field(f => f.CutoffDate);
        descriptor.Field(f => f.State);
        descriptor.Field(f => f.CancellationTimestamp);

        descriptor
            .Field("initiator")
            .Resolve((ctx, ct) => GetInitiatorAsync(
                ctx.Parent<IMeteringPointProcess>().Process,
                ctx.DataLoader<IMarketParticipantByNumberAndRoleDataLoader>(),
                ct));

        descriptor
            .Field("initiatorRole")
            .Resolve(ctx => GetInitiatorRole(ctx.Parent<IMeteringPointProcess>().Process));

        descriptor
            .Field("cancelledByProcess")
            .Type<MeteringPointProcessV2Type>()
            .Resolve((ctx, ct) => GetCancelledByProcessAsync(
                ctx.Parent<IMeteringPointProcess>().Process,
                ctx.Service<IMeteringPointProcessesClient>(),
                ct));

        descriptor
            .Field("steps")
            .Type<NonNullType<ListType<NonNullType<ObjectType<MeteringPointProcessStep>>>>>()
            .Resolve(ctx => MessageArchive.MeteringPointProcessNode.GetSteps(
                ctx.Parent<IMeteringPointProcess>().Process));

        descriptor
            .Field("availableActions")
            .Type<ListType<NonNullType<EnumType<MeteringPointProcessAction>>>>();
    }

    private static async Task<ActorDto?> GetInitiatorAsync(
        MeteringPointProcess process,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(process.ActorNumber)) return null;
        if (!Enum.TryParse<EicFunction>(process.ActorRole, out var role)) return null;
        return await dataLoader.LoadAsync((process.ActorNumber, role), cancellationToken);
    }

    private static EicFunction? GetInitiatorRole(MeteringPointProcess process) =>
        Enum.TryParse<EicFunction>(process.ActorRole, out var role) ? role : null;

    private static async Task<IMeteringPointProcess?> GetCancelledByProcessAsync(
        MeteringPointProcess process,
        IMeteringPointProcessesClient client,
        CancellationToken cancellationToken) =>
        await client.GetCancelledByProcessAsync(process, cancellationToken).ConfigureAwait(false);
}
