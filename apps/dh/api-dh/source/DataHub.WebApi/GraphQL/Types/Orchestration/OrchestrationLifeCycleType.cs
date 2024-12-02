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

using Energinet.DataHub.ProcessManager.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.GraphQL.DataLoaders;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Orchestration;

public class OrchestrationLifeCycle : ObjectType<OrchestrationInstanceLifecycleStateDto>
{
    protected override void Configure(IObjectTypeDescriptor<OrchestrationInstanceLifecycleStateDto> descriptor)
    {
        descriptor
            .Name("OrchestrationLifeCycle")
            .BindFieldsExplicitly();

        descriptor.Field(f => f.CreatedAt);
        descriptor.Field(f => f.State);

        descriptor
            .Field("createdBy")
            .Resolve(context =>
                context.Parent<OrchestrationInstanceLifecycleStateDto>().CreatedBy switch
                {
                    UserIdentityDto user => context
                        .DataLoader<UserBatchDataLoader>()
                        .LoadAsync(user.UserId),
                    ActorIdentityDto => null,
                    _ => null,
                });
    }
}
