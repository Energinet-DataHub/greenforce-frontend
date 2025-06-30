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
using System.Text.Json;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using FluentAssertions;
using HotChocolate.Execution;
using Moq;

namespace Energinet.DataHub.WebApi.Tests.Helpers;

public static class RevisionLogTestHelper
{
    public static async Task ExecuteAndAssertAsync(
        string sourceText,
        Dictionary<string, object?>? variables = null)
    {
        var server = new GraphQLTestService();
        var results = new Dictionary<string, string>();

        server.RevisionLogClientMock
            .Setup(x => x.LogAsync(It.IsAny<string>(), It.IsAny<object?>(), It.IsAny<string?>(), It.IsAny<Guid?>()))
            .Returns<string, object?, string, Guid?>(async (activity, payload, affectedEntityType, affectedEntityKey) =>
            {
                var resultJson = JsonSerializer.Serialize(
                    new { activity, payload, affectedEntityType, affectedEntityKey },
                    new JsonSerializerOptions { WriteIndented = true });

                results.Add(activity, resultJson);
                await Task.CompletedTask;
            });

        var response = await server.ExecuteRequestAsync(b => b
            .SetDocument(sourceText)
            .SetVariableValues(variables)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        response.ExpectOperationResult().Errors.Should().BeNullOrEmpty();
        results.Count.Should().BeGreaterThan(0, "at least one log entry is expected");

        foreach (var result in results)
        {
            await result.Value.MatchSnapshotAsync(
                extension: "json",
                name: result.Key);
        }
    }
}
