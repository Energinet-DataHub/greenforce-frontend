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
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class WholesaleSettlementReportControllerTests(WebApiFactory factory)
        : WebApiTestBase(factory)
    {
        private Mock<IWholesaleClient_V3> WholesaleClientV3Mock { get; } = new();

        [Fact]
        public async Task CreateAsync_ReturnsOk()
        {
            // arrange
            var calculationId = Guid.NewGuid();
            const string gridAreaCode = "123";

            WholesaleClientV3Mock.Setup(x => x.GetSettlementReportAsStreamAsync(calculationId, gridAreaCode, CancellationToken.None))
                .ReturnsAsync(new FileResponse(0, null, new MemoryStream(), null, null));

            // act
            var actual = await Client.GetAsync($"/v1/WholesaleSettlementReport?calculationId={calculationId}&gridAreaCode={gridAreaCode}");

            // assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        protected override void ConfigureMocks(IServiceCollection services)
        {
            services.AddSingleton(WholesaleClientV3Mock.Object);
        }
    }
}
