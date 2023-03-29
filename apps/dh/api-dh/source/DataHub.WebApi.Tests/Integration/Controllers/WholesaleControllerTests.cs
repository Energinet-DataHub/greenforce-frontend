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
using BatchDto = Energinet.DataHub.WebApi.Controllers.Wholesale.Dto.BatchDto;
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
            MockMarketParticipantClient();
            var actual = await BffClient.PostAsJsonAsync(BaseUrl, requestDto);
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task GetAsync_ReturnsBatch_WithGridAreaNames(Guid batchId)
        {
            MockMarketParticipantClient();
            var batchDtoV3 = new BatchDtoV3(
                true,
                Guid.NewGuid(),
                BatchState.Completed,
                DateTimeOffset.Now,
                DateTimeOffset.Now,
                new[] { GridAreaCode },
                DateTimeOffset.Now,
                DateTimeOffset.Now,
                ProcessType.BalanceFixing,
                string.Empty,
                null,
                string.Empty);

            WholesaleClientV3Mock
                .Setup(m => m.GetBatchAsync(batchId, null, CancellationToken.None))
                .ReturnsAsync(batchDtoV3);
            var responseMessage = await BffClient.GetAsync($"{BaseUrl}/{batchId}");

            var actual = await responseMessage.Content.ReadAsAsync<BatchDto>();
            foreach (var gridAreaDto in actual.GridAreas)
            {
                Assert.NotNull(gridAreaDto.Name);
            }
        }

        [Fact]
        public async Task SearchAsync_WhenBatchesFound_ReturnsOk()
        {
            var batches = new List<BatchDtoV3>
            {
                new BatchDtoV3(
                    true,
                    Guid.NewGuid(),
                    BatchState.Completed,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    new[] { GridAreaCode },
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    ProcessType.BalanceFixing,
                    string.Empty,
                    null,
                    string.Empty),
            };
            WholesaleClientV3Mock
                .Setup(m => m.SearchBatchesAsync(It.IsAny<ICollection<string>>(), null, null, null, null, null, null, CancellationToken.None))
                .ReturnsAsync(batches);

            MockMarketParticipantClient();

            var actual = await BffClient.GetAsync(BaseUrl);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task SearchAsync_WhenNoBatchesFound_ReturnsOk()
        {
            MockMarketParticipantClient();
            WholesaleClientV3Mock
                .Setup(m => m.SearchBatchesAsync(It.IsAny<ICollection<string>>(), null, null, null, null, null, null, CancellationToken.None))
                .ReturnsAsync(new List<BatchDtoV3>());

            var actual = await BffClient.GetAsync(BaseUrl);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task SearchAsync_WhenBatchesFound_GridAreasHaveNames()
        {
            var batches = new List<BatchDtoV3>
            {
                new BatchDtoV3(
                    true,
                    Guid.NewGuid(),
                    BatchState.Completed,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    new[] { GridAreaCode },
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    ProcessType.BalanceFixing,
                    string.Empty,
                    null,
                    string.Empty),
            };
            WholesaleClientV3Mock
                .Setup(m => m.SearchBatchesAsync(It.IsAny<ICollection<string>>(), null, null, null, null, null, null, CancellationToken.None))
                .ReturnsAsync(batches);

            MockMarketParticipantClient();

            var responseMessage = await BffClient.GetAsync(BaseUrl);
            var actual = await responseMessage.Content.ReadAsAsync<IEnumerable<BatchDto>>();
            foreach (var batchDto in actual)
            {
                foreach (var gridAreaDto in batchDto.GridAreas)
                {
                    Assert.NotNull(gridAreaDto.Name);
                }
            }
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task GetAsync_WhenProcessStepResultIsFound_ReturnsOk(
            Guid batchId,
            string gridAreaCode,
            string? energySupplierGln,
            string? balanceResponsiblePartyGln,
            ProcessStepResultDto processStepResultDto)
        {
            var timeSeriesType = TimeSeriesType.Production;
            WholesaleClientV3Mock
                .Setup(m => m.GetProcessStepResultAsync(batchId, gridAreaCode, timeSeriesType, energySupplierGln, balanceResponsiblePartyGln, null, CancellationToken.None))
                .ReturnsAsync(processStepResultDto);

            var actual = await BffClient.GetAsync($"{BaseUrl}/{batchId}/processes/{gridAreaCode}/time-series-types/{timeSeriesType}");

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
