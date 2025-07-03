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
using System.Threading.Tasks;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.Traits;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class MeasurementRevisionLogTests
{
    [Fact]
    [RevisionLogTest("MeasurementOperations.SendMeasurementsAsync")]
    public async Task SendMeasurementsAsync()
    {
        var operation =
            $$"""
              mutation($input: SendMeasurementsRequestV1Input!) {
                sendMeasurements(input: $input)
              }
            """;

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            operation,
            new()
            {
                {
                    "input",
                    new SendMeasurementsRequestV1
                    {
                        MeteringPointId = "1234567890",
                        Measurements = [],
                        Start = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                        End = new DateTime(2025, 1, 2, 0, 0, 0, DateTimeKind.Utc),
                        MeteringPointType = MeteringPointType2.Exchange,
                        Resolution = Resolution.Hourly,
                    }
                },
            });
    }
}
