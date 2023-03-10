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

using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.Charges.Clients.Charges;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MeteringPoints.Client.Abstractions;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class ControllerTestsBase :
        WebApiTestBase<BffWebApiFixture>,
        IClassFixture<BffWebApiFixture>,
        IClassFixture<WebApiFactory>,
        IAsyncLifetime
    {
        protected HttpClient BffClient { get; }

        protected Mock<IWholesaleClient_V2> WholesaleClient_V2Mock { get; }

        protected Mock<IWholesaleClient_V2_1> WholesaleClient_V2_1Mock { get; }

        protected Mock<IWholesaleClient_V3> WholesaleClient_V3Mock { get; }

        protected Mock<IMeteringPointClient> MeteringPointClientMock { get; }

        protected Mock<IMarketParticipantClient> MarketParticipantClientMock { get; }

        protected Mock<IChargesClient> ChargeClientMock { get; }

        protected ControllerTestsBase(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
             : base(bffWebApiFixture, testOutputHelper)
        {
            WholesaleClient_V2Mock = new Mock<IWholesaleClient_V2>();
            WholesaleClient_V2_1Mock = new Mock<IWholesaleClient_V2_1>();
            WholesaleClient_V3Mock = new Mock<IWholesaleClient_V3>();
            MarketParticipantClientMock = new Mock<IMarketParticipantClient>();
            MeteringPointClientMock = new Mock<IMeteringPointClient>();
            ChargeClientMock = new Mock<IChargesClient>();

            BffClient = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddTransient(_ => WholesaleClient_V2Mock.Object);
                    services.AddTransient(_ => WholesaleClient_V2_1Mock.Object);
                    services.AddTransient(_ => WholesaleClient_V3Mock.Object);
                    services.AddTransient(_ => MeteringPointClientMock.Object);
                    services.AddTransient(_ => MarketParticipantClientMock.Object);
                    services.AddTransient(_ => ChargeClientMock.Object);
                });
            })
            .CreateClient();
        }

        public Task InitializeAsync()
        {
            BffClient.DefaultRequestHeaders.Add("Authorization", $"Bearer xxx");
            return Task.CompletedTask;
        }

        public Task DisposeAsync()
        {
            BffClient.Dispose();
            return Task.CompletedTask;
        }
    }
}
