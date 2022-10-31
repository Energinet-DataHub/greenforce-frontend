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
using Energinet.DataHub.Charges.Clients.Charges;
using Energinet.DataHub.Charges.Contracts.Charge;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class ChargesControllerTests : ControllerTestsBase<IChargesClient>
    {
        public ChargesControllerTests(BffWebApiFixture bffWebApiFixture, WebApiFactory factory, ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task GetChargesAsync_WhenMeteringPointIdHasChargeLinks_ReturnsOk(List<ChargeV1Dto> list)
        {
            // Arrange
            var requestUrl = $"/v1/Charges";

            DomainClientMock
                .Setup(m => m.GetChargesAsync())
                .ReturnsAsync(list);

            // Act
            var actual = await BffClient.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
