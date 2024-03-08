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
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
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
        public async Task DownloadAsync_ReturnsOk()
        {
            // arrange
            const CalculationType calculationType = CalculationType.BalanceFixing;
            var gridAreaCodes = new List<string> { "123" };
            var gridAreaCodesString = string.Join(",", gridAreaCodes);
            var headerDictionary = new Dictionary<string, IEnumerable<string>>
            {
                { "Content-Disposition", new[] { "attachment; filename=SettlementReport.zip" } },
            };
            var fileResponse = new FileResponse(0, headerDictionary, new MemoryStream(), null, null);

            WholesaleClientV3Mock.Setup(x => x.DownloadAsync(
                    gridAreaCodes,
                    calculationType,
                    It.IsAny<DateTimeOffset>(),
                    It.IsAny<DateTimeOffset>(),
                    null,
                    null,
                    default))
                .ReturnsAsync(fileResponse);

            // act
            var actual = await BffClient.GetAsync($"/v1/WholesaleSettlementReport/download?gridAreaCodes={gridAreaCodesString}&calculationType={calculationType}&periodStart=2021-01-01&periodEnd=2021-01-01");

            // assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
