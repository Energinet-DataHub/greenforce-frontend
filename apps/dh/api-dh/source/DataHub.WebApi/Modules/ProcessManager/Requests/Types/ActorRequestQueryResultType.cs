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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026_028.CustomQueries;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Extensions;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Types;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

public class ActorRequestQueryResultType : InterfaceType<IActorRequestQueryResult>
{
    protected override void Configure(
        IInterfaceTypeDescriptor<IActorRequestQueryResult> descriptor)
    {
        descriptor.Implements<OrchestrationInstanceType<IInputParameterDto>>();

        descriptor
            .Field("messageId")
            .Resolve(c => c.Parent<IActorRequestQueryResult>().GetMessageId());

        descriptor
            .Field("calculationType")
            .Resolve(c => c.Parent<IActorRequestQueryResult>().GetCalculationType());

        descriptor
            .Field("period")
            .Resolve(c => c.Parent<IActorRequestQueryResult>().GetPeriod());

        descriptor
            .Field("requestedBy")
            .Resolve(c =>
            {
                var parent = c.Parent<IActorRequestQueryResult>();
                var actorNumber = parent.GetRequestedByActorNumber();
                var actorRole = parent.GetRequestedByActorRole();
                if (actorNumber is null || actorRole is null) return Task.FromResult<ActorDto?>(null);
                var success = Enum.TryParse<EicFunction>(actorRole, out var eicFunction);
                if (!success) return Task.FromResult<ActorDto?>(null);
                return c.DataLoader<IActorByNumberAndRoleDataLoader>().LoadAsync(
                    (actorNumber, eicFunction),
                    c.RequestAborted);
            });
    }
}
