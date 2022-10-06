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
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public abstract class ControllerTestsBase<TDomainClient> :
        WebApiTestBase<BffWebApiFixture>,
        IClassFixture<BffWebApiFixture>,
        IClassFixture<WebApiFactory>,
        IAsyncLifetime
        where TDomainClient : class
    {
        protected Mock<TDomainClient> DomainClientMock { get; }

        protected HttpClient BffClient { get; }

        protected ControllerTestsBase(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
             : base(bffWebApiFixture, testOutputHelper)
        {
            DomainClientMock = new Mock<TDomainClient>();
            BffClient = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddTransient(_ => DomainClientMock.Object);
                });
            })
            .CreateClient();

            factory.ReconfigureJwtTokenValidatorMock(isValid: true);
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
