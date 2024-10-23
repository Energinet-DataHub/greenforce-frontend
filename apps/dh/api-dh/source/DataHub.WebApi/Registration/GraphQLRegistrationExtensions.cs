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

using Energinet.DataHub.WebApi.GraphQL.Mutation;
using Energinet.DataHub.WebApi.GraphQL.Query;
using Energinet.DataHub.WebApi.GraphQL.Scalars;
using Energinet.DataHub.WebApi.GraphQL.Subscription;
using HotChocolate.Execution.Configuration;
using NodaTime;

namespace Energinet.DataHub.WebApi.Registration;

public static class GraphQLRegistrationExtensions
{
    public static IRequestExecutorBuilder AddGraphQLServices(this IServiceCollection services)
    {
        return services
            .AddGraphQLServer()
            .AddInMemorySubscriptions()
            .AddInstrumentation()
            .AddAuthorization()
            .AddQueryType<Query>()
            .AddMutationConventions(applyToAllMutations: true)
            .AddMutationType<Mutation>()
            .AddSubscriptionType<Subscription>()
            .AddTypes()
            .AddSorting()
            .BindRuntimeType<Interval, DateRangeType>()
            .ModifyPagingOptions(options =>
            {
                options.RequirePagingBoundaries = true;
                options.MaxPageSize = 250;
                options.IncludeTotalCount = true;
            });
    }
}
