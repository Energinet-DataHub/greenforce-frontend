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
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;
using BatchDtoV3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchDto;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class WholesaleControllerTests : ControllerTestsBase
    {
        public WholesaleControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        private const string BaseUrl = "/v1/wholesalebatch";
        private const string GridAreaCode = "805";

        [Theory]
        [InlineAutoMoqData]
        public async Task CreateAsync_ReturnsOk(BatchRequestDto requestDto)
        {
            // Arrange
            MockMarketParticipantClient();
            WholesaleClientV3Mock.Setup(x => x.CreateBatchAsync(new BatchRequestDto(), null, CancellationToken.None))
                .ReturnsAsync(Guid.NewGuid);
            // Act
            var actual = await BffClient.PostAsJsonAsync(BaseUrl, requestDto);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        private void MockMarketParticipantClient()
        {
            MarketParticipantClientMock.Setup(d => d.GetGridAreasAsync()).ReturnsAsync(new List<GridAreaDto>
            {
                new(
                    Guid.NewGuid(),
                    GridAreaCode,
                    "GridAreaCodeName",
                    PriceAreaCode.Dk1,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now.AddDays(1)),
            });
        }
    }
}
