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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public sealed class WholesaleSettlementReportControllerTests : ControllerTestsBase
    {
        public WholesaleSettlementReportControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        [Fact]
        public async Task CreateAsync_ReturnsOk()
        {
            // arrange
            var batchId = Guid.NewGuid();
            const string gridAreaCode = "123";

            WholesaleClientV3Mock.Setup(x => x.GetSettlementReportAsStreamAsync(batchId, gridAreaCode))
                .ReturnsAsync(Stream.Null);

            // act
            var actual = await BffClient.GetAsync($"/v1/WholesaleSettlementReport?batchId={batchId}&gridAreaCode={gridAreaCode}");

            // assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
