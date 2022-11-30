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

using System.Net;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.MeteringPoints.Client.Abstractions.Models;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class MeteringPointControllerTests : ControllerTestsBase
    {
        public MeteringPointControllerTests(BffWebApiFixture bffWebApiFixture, WebApiFactory factory, ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task When_MeteringPoint_Requested_And_Found_Then_StatusCode_IsOK(MeteringPointCimDto meteringPointDto)
        {
            // Arrange
            const string gsrn = "574591757409421563";
            var requestUrl = $"/v1/MeteringPoint/GetByGsrn?gsrnNumber={gsrn}";

            MeteringPointClientMock
                .Setup(mock => mock.GetMeteringPointByGsrnAsync(gsrn))
                .ReturnsAsync(meteringPointDto);

            // Act
            var actual = await BffClient.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task When_MeteringPoint_Requested_And_Not_Found_Then_StatusCode_IsNotFound()
        {
            // Arrange
            const string gsrn = "non-existing-gsrn-number";
            var requestUrl = $"/v1/meteringpoint/getbygsrn?gsrnNumber={gsrn}";

            MeteringPointClientMock
                .Setup(mock => mock.GetMeteringPointByGsrnAsync(gsrn))
                .Returns(Task.FromResult<MeteringPointCimDto?>(null));

            // Act
            var actual = await BffClient.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
