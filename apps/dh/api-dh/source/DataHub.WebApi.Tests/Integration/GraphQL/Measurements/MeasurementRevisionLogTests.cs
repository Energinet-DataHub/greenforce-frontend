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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Measurements;

public class MeasurementRevisionLogTests
{
    [Fact]
    [RevisionLogTest("MeasurementOperations.SendMeasurementsAsync")]
    public async Task SendMeasurementsAsync()
    {
        var operation =
            $$"""
              mutation($input: SendMeasurementsInput!) {
                sendMeasurements(input: $input)
              }
            """;

        var server = new GraphQLTestService();
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                {
                    "input",
                    new Dictionary<string, object>
                    {
                        { "meteringPointId", "1234567890" },
                        { "meteringPointType", "EXCHANGE" },
                        { "measurementUnit", "KILOWATT_HOUR" },
                        { "resolution", "HOURLY" },
                        { "start", new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                        { "end", new DateTime(2025, 1, 2, 0, 0, 0, DateTimeKind.Utc) },
                        { "measurements", new List<object>() },
                    }
                },
            });
    }
}
