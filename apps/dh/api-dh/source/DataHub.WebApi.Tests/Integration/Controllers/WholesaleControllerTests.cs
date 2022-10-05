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

using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoFixture;
using Energinet.Charges.Contracts.ChargeLink;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.Wholesale.Application.Batches;
using Energinet.DataHub.Wholesale.Client;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class WholesaleControllerTests : ControllerTestsBase<IWholesaleClient>
    {
        public WholesaleControllerTests(BffWebApiFixture bffWebApiFixture, WebApiFactory factory, ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        [Fact]
        public async Task CreateAsync_ReturnsOk()
        {
            // Arrange
            var batchRequest = new BatchRequestDto();
            var requestUrl = $"/v1/wholesalebatch";
            var list = new List<ChargeLinkV1Dto>
            {
                DtoFixture.Create<ChargeLinkV1Dto>(),
            };

            ApiClientMock
                .Setup(m => m.CreateBatchAsync(batchRequest))
                .ReturnsAsync(list);

            // Act
            var actual = await Client.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        // [Fact]
        // public async Task PostAsync_WhenMeteringPointIdHasNoChargeLink_ReturnsNotFound()
        // {
        //     // Arrange
        //     var meteringPointId = "metering-point-has-no-links";
        //     var requestUrl = $"/v1/wholesalebatch/search";
        //     var list = new List<ChargeLinkV1Dto>();
        //
        //     ApiClientMock
        //         .Setup(m => m.GetChargeLinksAsync(meteringPointId))
        //         .ReturnsAsync(list);
        //
        //     // Act
        //     var actual = await Client.GetAsync(requestUrl);
        //
        //     // Arrange
        //     actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
        // }
    }
}
