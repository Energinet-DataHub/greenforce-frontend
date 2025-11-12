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
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v3;
using Energinet.DataHub.Measurements.Client;
using Energinet.DataHub.Measurements.Client.Authorization;
using Energinet.DataHub.Measurements.Client.Mappers;
using Energinet.DataHub.Reports.Client;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Common.Scalars;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Client;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Client;
using Energinet.DataHub.WebApi.Modules.SettlementReports.Client;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types.NodaTime;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using Moq;
using IHttpClientFactory = System.Net.Http.IHttpClientFactory;

namespace Energinet.DataHub.WebApi.Tests.TestServices;

public class GraphQLTestService
{
    public GraphQLTestService()
    {
        FeatureManagerMock = new Mock<IFeatureManager>();
        CalculationsClientMock = new Mock<ICalculationsClient>();
        RequestsClientMock = new Mock<IRequestsClient>();
        SettlementReportClientMock = new Mock<ISettlementReportClient>();
        MeasurementsReportClientMock = new Mock<IMeasurementsReportClient>();
        MarketParticipantClientV1Mock = new Mock<IMarketParticipantClient_V1>();
        GridAreasClientMock = new Mock<IGridAreasClient>();
        EdiB2CWebAppClientV1Mock = new Mock<IEdiB2CWebAppClient_V1>();
        EdiB2CWebAppClientV3Mock = new Mock<IEdiB2CWebAppClient_V3>();
        RevisionLogClientMock = new Mock<IRevisionLogClient>();
        MeasurementsClientMock = new Mock<IMeasurementsClient>();
        HttpContextAccessorMock = new Mock<IHttpContextAccessor>();
        MeasurementsApiHttpClientFactoryMock = new Mock<IMeasurementsApiHttpClientFactory>();
        AuthorizedHttpClientFactoryMock = new Mock<AuthorizedHttpClientFactory>();
        MeasurementsResponseMapperMock = new Mock<IMeasurementsResponseMapper>();
        AuthorizationServiceMock = new Mock<IAuthorizationService>();
        HttpClientFactoryMock = new Mock<IHttpClientFactory>();
        ChargesClientMock = new Mock<IChargesClient>();

        Services = new ServiceCollection()
            .AddLogging()
            .AddAuthorization()
            .AddGraphQLServer(disableDefaultSecurity: true)
            .AddInMemorySubscriptions()
            .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true)
            .AddMutationConventions(applyToAllMutations: true)
            .AddTypes()
            .AddModules()
            .AddAuthorization()
            .AddSorting()
            .ModifyOptions(options =>
            {
                options.EnableOneOf = true;
                options.StripLeadingIFromInterface = true;
            })
            .ModifyPagingOptions(options =>
            {
                options.RequirePagingBoundaries = true;
                options.MaxPageSize = 250;
                options.IncludeTotalCount = true;
            })
            .AddType<LocalDateType>()
            .BindRuntimeType<NodaTime.Interval, DateRangeType>()
            .BindRuntimeType<NodaTime.YearMonth, YearMonthType>()
            .BindRuntimeType<long, LongType>()
            .Services
            .AddSingleton<IConfiguration>(new ConfigurationRoot([]))
            .AddSingleton<ISettlementReportsClient, SettlementReportsClient>()
            .AddSingleton(FeatureManagerMock.Object)
            .AddSingleton(CalculationsClientMock.Object)
            .AddSingleton(RequestsClientMock.Object)
            .AddSingleton(SettlementReportClientMock.Object)
            .AddSingleton(MeasurementsReportClientMock.Object)
            .AddSingleton(MarketParticipantClientV1Mock.Object)
            .AddSingleton(GridAreasClientMock.Object)
            .AddSingleton(EdiB2CWebAppClientV1Mock.Object)
            .AddSingleton(EdiB2CWebAppClientV3Mock.Object)
            .AddSingleton(GridAreasClientMock.Object)
            .AddSingleton(RevisionLogClientMock.Object)
            .AddSingleton(MeasurementsClientMock.Object)
            .AddSingleton(HttpContextAccessorMock.Object)
            .AddSingleton(HttpClientFactoryMock.Object)
            .AddSingleton(MeasurementsApiHttpClientFactoryMock.Object)
            .AddSingleton(AuthorizationServiceMock.Object)
            .AddSingleton(MeasurementsResponseMapperMock.Object)
            .AddSingleton(ChargesClientMock.Object)
            .AddSingleton(
                sp => new RequestExecutorProxy(
                    sp.GetRequiredService<IRequestExecutorResolver>(),
                    Schema.DefaultName));
    }

    public Mock<IFeatureManager> FeatureManagerMock { get; set; }

    public Mock<ICalculationsClient> CalculationsClientMock { get; set; }

    public Mock<IChargesClient> ChargesClientMock { get; set; }

    public Mock<IRequestsClient> RequestsClientMock { get; set; }

    public Mock<AuthorizedHttpClientFactory> AuthorizedHttpClientFactoryMock { get; set; }

    public Mock<IHttpClientFactory> HttpClientFactoryMock { get; set; }

    public Mock<ISettlementReportClient> SettlementReportClientMock { get; set; }

    public Mock<IMeasurementsReportClient> MeasurementsReportClientMock { get; set; }

    public Mock<IMarketParticipantClient_V1> MarketParticipantClientV1Mock { get; set; }

    public Mock<IGridAreasClient> GridAreasClientMock { get; set; }

    public Mock<IEdiB2CWebAppClient_V1> EdiB2CWebAppClientV1Mock { get; set; }

    public Mock<IEdiB2CWebAppClient_V3> EdiB2CWebAppClientV3Mock { get; set; }

    public Mock<IRevisionLogClient> RevisionLogClientMock { get; set; }

    public Mock<IMeasurementsClient> MeasurementsClientMock { get; set; }

    public Mock<IHttpContextAccessor> HttpContextAccessorMock { get; set; }

    public Mock<IMeasurementsApiHttpClientFactory> MeasurementsApiHttpClientFactoryMock { get; set; }

    public Mock<IAuthorizationService> AuthorizationServiceMock { get; set; }

    public Mock<IMeasurementsResponseMapper> MeasurementsResponseMapperMock { get; set; }

    public IServiceCollection Services { get; set; }

    public async Task<IExecutionResult> ExecuteRequestAsync(
        Action<OperationRequestBuilder> configureRequest,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var services = Services.BuildServiceProvider();
            var executor = services.GetRequiredService<RequestExecutorProxy>();
            var scope = services.CreateAsyncScope();
            var requestBuilder = new OperationRequestBuilder();
            requestBuilder.SetServices(scope.ServiceProvider);
            configureRequest(requestBuilder);
            var request = requestBuilder.Build();
            var result = await executor.ExecuteAsync(request, cancellationToken);
            result.RegisterForCleanup(scope.DisposeAsync);
            return result;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error executing GraphQL request", ex);
        }
    }

    public async Task<HotChocolate.ISchema> GetSchemaAsync() =>
        await Services
            .BuildServiceProvider()
            .GetRequiredService<RequestExecutorProxy>()
            .GetSchemaAsync(default);
}
