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

using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.MeasurementsReports;

public class MeasurementsReportRevisionLogTests
{
    [Fact]
    [RevisionLogTest("MeasurementsReportOperations.GetMeasurementsReportsAsync")]
    public async Task GetMeasurementsReportsAsync()
    {
        var operation =
            $$"""
              query {
                measurementsReports {
                  id
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation);
    }

    [Fact]
    [RevisionLogTest("MeasurementsReportOperations.RequestMeasurementsReportAsync")]
    public async Task RequestMeasurementsReportAsync()
    {
        var operation =
            $$"""
              mutation {
                requestMeasurementsReport(requestMeasurementsReportInput: {
                  period: { start: "2024-01-01T00:00:00.000Z", end: "2024-01-31T23:59:59.999Z" }
                  gridAreaCodes: ["543"]
                  resolution: SUM_OF_DAY
                  meteringPointTypes: [Consumption, Production]
                  energySupplier: "5790001330552"
                  requestAsMarketRole: ENERGY_SUPPLIER
                  requestAsActorId: "5790001330552"
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation);
    }

    [Fact]
    [RevisionLogTest("MeasurementsReportOperations.CancelMeasurementsReportAsync")]
    public async Task CancelMeasurementsReportAsync()
    {
        var operation =
            $$"""
              mutation {
                cancelMeasurementsReport(input: {
                  requestId: { id: "12345678-1234-1234-1234-123456789012" }
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(server, operation);
    }
}
