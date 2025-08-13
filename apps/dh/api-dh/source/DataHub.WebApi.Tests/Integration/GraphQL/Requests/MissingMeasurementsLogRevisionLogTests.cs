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
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Enums;
using Energinet.DataHub.WebApi.Modules.Processes.MissingMeasurementsLog.Types;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using NodaTime;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class MissingMeasurementsLogRevisionLogTests
{
    [Fact]
    [RevisionLogTest("MissingMeasurementsLogOperations.RequestMissingMeasurementsLogAsync")]
    public async Task RequestMissingMeasurementsLogAsync()
    {
        var operation =
            $$"""
              mutation requestMissingMeasurementsLog($input: RequestMissingMeasurementsLogInput!) {
                requestMissingMeasurementsLog(input: $input) {
                  success: boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        var period = new Interval(Instant.FromUtc(2022, 1, 1, 0, 0), Instant.FromUtc(2022, 1, 2, 0, 0));
        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new() { { "input", new RequestMissingMeasurementsLogInput(period, []) } });
    }
}
