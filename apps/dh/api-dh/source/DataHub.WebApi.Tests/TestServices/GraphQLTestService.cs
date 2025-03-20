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
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.GraphQL.Mutation;
using Energinet.DataHub.WebApi.GraphQL.Query;
using Energinet.DataHub.WebApi.GraphQL.Scalars;
using Energinet.DataHub.WebApi.GraphQL.Subscription;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Client;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types.NodaTime;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using Moq;

namespace Energinet.DataHub.WebApi.Tests.TestServices;

public class GraphQLTestService
{
    public GraphQLTestService()
    {
        FeatureManagerMock = new Mock<IFeatureManager>();
        CalculationsClientMock = new Mock<ICalculationsClient>();
        RequestsClientMock = new Mock<IRequestsClient>();
        WholesaleClientV3Mock = new Mock<IWholesaleClient_V3>();
        SettlementReportsClientMock = new Mock<ISettlementReportsClient>();
        MarketParticipantClientV1Mock = new Mock<IMarketParticipantClient_V1>();
        GridAreasClientMock = new Mock<IGridAreasClient>();
        HttpContextAccessorMock = new Mock<IHttpContextAccessor>();

        Services = new ServiceCollection()
            .AddLogging()
            .AddAuthorization()
            .AddGraphQLServer(disableDefaultSecurity: true)
            .AddInMemorySubscriptions()
            .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true)
            .AddQueryType<Query>()
            .AddMutationConventions(applyToAllMutations: true)
            .AddMutationType<Mutation>()
            .AddSubscriptionType<Subscription>()
            .AddTypes()
            .AddModules()
            .AddAuthorization()
            .AddSorting()
            .ModifyOptions(options =>
            {
                options.EnableOneOf = true;
                options.StripLeadingIFromInterface = true;
            })
            .AddType<LocalDateType>()
            .BindRuntimeType<NodaTime.Interval, DateRangeType>()
            .Services
            .AddSingleton<IConfiguration>(new ConfigurationRoot([]))
            .AddSingleton(FeatureManagerMock.Object)
            .AddSingleton(CalculationsClientMock.Object)
            .AddSingleton(RequestsClientMock.Object)
            .AddSingleton(WholesaleClientV3Mock.Object)
            .AddSingleton(SettlementReportsClientMock.Object)
            .AddSingleton(MarketParticipantClientV1Mock.Object)
            .AddSingleton(GridAreasClientMock.Object)
            .AddSingleton(HttpContextAccessorMock.Object)
            .AddSingleton(
                sp => new RequestExecutorProxy(
                    sp.GetRequiredService<IRequestExecutorResolver>(),
                    Schema.DefaultName))
            .BuildServiceProvider();

        Executor = Services.GetRequiredService<RequestExecutorProxy>();
    }

    public Mock<IFeatureManager> FeatureManagerMock { get; set; }

    public Mock<ICalculationsClient> CalculationsClientMock { get; set; }

    public Mock<IRequestsClient> RequestsClientMock { get; set; }

    public Mock<IWholesaleClient_V3> WholesaleClientV3Mock { get; set; }

    public Mock<ISettlementReportsClient> SettlementReportsClientMock { get; set; }

    public Mock<IMarketParticipantClient_V1> MarketParticipantClientV1Mock { get; set; }

    public Mock<IGridAreasClient> GridAreasClientMock { get; set; }

    public Mock<IHttpContextAccessor> HttpContextAccessorMock { get; set; }

    public IServiceProvider Services { get; set; }

    public RequestExecutorProxy Executor { get; set; }

    public async Task<IExecutionResult> ExecuteRequestAsync(
        Action<OperationRequestBuilder> configureRequest,
        CancellationToken cancellationToken = default)
    {
        var scope = Services.CreateAsyncScope();
        var requestBuilder = new OperationRequestBuilder();
        requestBuilder.SetServices(scope.ServiceProvider);
        configureRequest(requestBuilder);
        var request = requestBuilder.Build();
        var result = await Executor.ExecuteAsync(request, cancellationToken);
        result.RegisterForCleanup(scope.DisposeAsync);
        return result;
    }
}
