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

using System;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Mutation;
using Energinet.DataHub.WebApi.GraphQL.Query;
using Energinet.DataHub.WebApi.GraphQL.Scalars;
using HotChocolate;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace Energinet.DataHub.WebApi.Tests.TestServices;

public class GraphQLTestService
{
    public GraphQLTestService()
    {
        WholesaleClientV3Mock = new Mock<IWholesaleClient_V3>();
        MarketParticipantClientV1Mock = new Mock<IMarketParticipantClient_V1>();
        HttpContextAccessorMock = new Mock<IHttpContextAccessor>();

        Services = new ServiceCollection()
            .AddGraphQLServer()
            .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true)
            .AddQueryType<Query>()
            .AddMutationConventions(applyToAllMutations: true)
            .AddMutationType<Mutation>()
            .AddTypes()
            .AddSorting()
            .BindRuntimeType<NodaTime.Interval, DateRangeType>()
            .Services
            .AddSingleton(WholesaleClientV3Mock.Object)
            .AddSingleton(MarketParticipantClientV1Mock.Object)
            .AddSingleton(HttpContextAccessorMock.Object)
            .AddSingleton(
                sp => new RequestExecutorProxy(
                    sp.GetRequiredService<IRequestExecutorResolver>(),
                    Schema.DefaultName))
            .BuildServiceProvider();

        Executor = Services.GetRequiredService<RequestExecutorProxy>();
    }

    public Mock<IWholesaleClient_V3> WholesaleClientV3Mock { get; set; }

    public Mock<IMarketParticipantClient_V1> MarketParticipantClientV1Mock { get; set; }

    public Mock<IHttpContextAccessor> HttpContextAccessorMock { get; set; }

    public IServiceProvider Services { get; set; }

    public RequestExecutorProxy Executor { get; set; }

    public async Task<IExecutionResult> ExecuteRequestAsync(
        Action<IQueryRequestBuilder> configureRequest,
        CancellationToken cancellationToken = default)
    {
        var scope = Services.CreateAsyncScope();
        var requestBuilder = new QueryRequestBuilder();
        requestBuilder.SetServices(scope.ServiceProvider);
        configureRequest(requestBuilder);
        var request = requestBuilder.Create();
        var result = await Executor.ExecuteAsync(request, cancellationToken);
        result.RegisterForCleanup(scope.DisposeAsync);
        return result;
    }
}
