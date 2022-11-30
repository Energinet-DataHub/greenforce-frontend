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
using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.Charges.Contracts.Charge;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class ChargesControllerTests : ControllerTestsBase
    {
        public ChargesControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task SearchAsync_WhenChargesExists_ReturnsOk(
            List<ChargeV1Dto> data,
            ChargeSearchCriteriaV1Dto searchCriteriaV1Dto)
        {
            // Arrange
            var requestUrl = $"/v1/Charges/SearchAsync";

            ChargeClientMock
                .Setup(m => m.SearchChargesAsync(It.IsAny<ChargeSearchCriteriaV1Dto>()))
                .ReturnsAsync(data);

            // Act
            var actual = await BffClient.PostAsJsonAsync(requestUrl, searchCriteriaV1Dto);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
