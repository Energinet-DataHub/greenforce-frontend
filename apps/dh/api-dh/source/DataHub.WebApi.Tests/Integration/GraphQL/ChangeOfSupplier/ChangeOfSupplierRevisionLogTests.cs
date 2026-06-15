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
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.EDI.B2CClient.Abstractions.Framework;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestRollbackChangeOfSupplier.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestRollbackChangeOfSupplier.V1.Models;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.ChangeOfSupplier;

public class ChangeOfSupplierRevisionLogTests
{
    [Fact]
    [RevisionLogTest("ChangeOfSupplierOperations.InitiateChangeOfSupplierAsync")]
    public async Task InitiateChangeOfSupplierAsync()
    {
        var operation =
            $$"""
              mutation (
                $meteringPointId: String!
                $startDate: DateTime!
                $customerType: String!
                $cpr: String
                $cvr: String
              ) {
                initiateChangeOfSupplier(input: {
                  meteringPointId: $meteringPointId,
                  startDate: $startDate,
                  customerType: $customerType,
                  cpr: $cpr,
                  cvr: $cvr
                }) {
                  boolean
                }
              }
            """;

        var user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim("actornumber", "5790001330552"),
                },
                "MockedAuthenticationType"));

        var server = new GraphQLTestService();
        server.HttpContextAccessorMock
            .Setup(x => x.HttpContext)
            .Returns(new DefaultHttpContext { User = user });

        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeOfSupplierCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<RequestChangeOfSupplierResponseV1>.Success(new RequestChangeOfSupplierResponseV1("test")));

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "meteringPointId", "571313180400000005" },
                { "startDate", "2025-01-01T00:00:00Z" },
                { "customerType", "private" },
                { "cpr", "1234567890" },
                { "cvr", null },
            });
    }

    [Fact]
    [RevisionLogTest("ChangeOfSupplierOperations.RequestIncorrectChangeOfSupplierAsync")]
    public async Task RequestIncorrectChangeOfSupplierAsync()
    {
        var operation =
            $$"""
              mutation (
                $processId: UUID!
                $meteringPointId: String!
                $cutoffDate: DateTime!
                $reason: String
              ) {
                requestIncorrectChangeOfSupplier(input: {
                  processId: $processId,
                  meteringPointId: $meteringPointId,
                  cutoffDate: $cutoffDate,
                  reason: $reason
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestRollbackChangeOfSupplierCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<RequestRollbackChangeOfSupplierResponseV1>.Success(new RequestRollbackChangeOfSupplierResponseV1("test")));

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "processId", Guid.Parse("504821ca-8a67-448b-8b34-4488f23b819f") },
                { "meteringPointId", "571313180000000005" },
                { "cutoffDate", "2025-12-31T23:00:00Z" },
                { "reason", "Incorrect change of supplier reason" },
            });
    }
}
