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
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class WholesaleControllerTests : ControllerTestsBase<IWholesaleClient, IMarketParticipantClient>
    {
        public WholesaleControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        private const string BatchCreateUrl = "/v1/wholesalebatch";
        private const string BatchSearchUrl = "/v1/wholesalebatch/search";

        [Theory]
        [InlineAutoMoqData]
        public async Task CreateAsync_ReturnsOk(BatchRequestDto requestDto)
        {
            MockMarketParticipantClient();
            var actual = await BffClient.PostAsJsonAsync(BatchCreateUrl, requestDto);
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task PostAsync_WhenBatchesFound_ReturnsOk(BatchSearchDto searchDto)
        {
            var batches = new List<BatchDtoV2>
            {
                new(
                    Guid.NewGuid(),
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    BatchState.Completed,
                    true,
                    new[] { "805" }),
            };
            DomainClientMock
                .Setup(m => m.GetBatchesAsync(searchDto))
                .ReturnsAsync(batches);

            MockMarketParticipantClient();

            var actual = await BffClient.PostAsJsonAsync(BatchSearchUrl, searchDto);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task PostAsync_WhenNoBatchesFound_ReturnsOk(BatchSearchDto searchDto)
        {
            MockMarketParticipantClient();
            DomainClientMock
                .Setup(m => m.GetBatchesAsync(searchDto))
                .ReturnsAsync(new List<BatchDtoV2>());

            var actual = await BffClient.PostAsJsonAsync(BatchSearchUrl, searchDto);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        private void MockMarketParticipantClient()
        {
            DomainClientMock2.Setup(d => d.GetGridAreasAsync()).ReturnsAsync(new List<GridAreaDto>
            {
                new(
                    Guid.NewGuid(),
                    "805",
                    "name",
                    PriceAreaCode.Dk1,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now.AddDays(1)),
            });
        }
    }
}
