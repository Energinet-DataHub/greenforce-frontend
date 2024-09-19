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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;
using Energinet.DataHub.WebApi.GraphQL.Types.Actor;

namespace Energinet.DataHub.WebApi.GraphQL.Types.MessageArchive;

public class ArchivedMessageType : ObjectType<ArchivedMessageResult>
{
    protected override void Configure(IObjectTypeDescriptor<ArchivedMessageResult> descriptor)
    {
        descriptor.Name("ArchivedMessage");

        descriptor
            .Field(f => f.SenderNumber)
            .Name("sender")
            .Type<ActorType>()
            .Resolve(context => context.DataLoader<ActorByNumberBatchDataLoader>().LoadAsync(
                context.Parent<ArchivedMessageResult>().SenderNumber,
                context.RequestAborted));

        descriptor
            .Field(f => f.ReceiverNumber)
            .Name("receiver")
            .Type<ActorType>()
            .Resolve(context => context.DataLoader<ActorByNumberBatchDataLoader>().LoadAsync(
                context.Parent<ArchivedMessageResult>().ReceiverNumber,
                context.RequestAborted));
    }
}
