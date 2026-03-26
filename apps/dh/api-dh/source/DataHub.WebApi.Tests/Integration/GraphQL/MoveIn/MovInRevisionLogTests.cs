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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.EDI.B2CClient.Abstractions.Framework;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V1.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models;
using Energinet.DataHub.WebApi.Tests.Helpers;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Energinet.DataHub.WebApi.Tests.Traits;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.MoveIn;

public class MoveInRevisionLogTests
{
    [Fact]
    [RevisionLogTest("MoveInOperations.InitiateMoveInAsync")]
    public async Task InitiateMoveInAsync()
    {
        var operation =
            $$"""
              mutation (
                $meteringPointId: String!
                $businessReason: ChangeOfSupplierBusinessReason!
                $startDate: DateTime!
                $customerIdentification: CustomerIdentificationInput!
                $customerName: String!
                $energySupplier: String!
              ) {
                initiateMoveIn(input: {
                  meteringPointId: $meteringPointId,
                  businessReason: $businessReason,
                  startDate: $startDate,
                  customerIdentification: $customerIdentification,
                  customerName: $customerName,
                  energySupplier: $energySupplier
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeOfSupplierCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<RequestChangeOfSupplierResponseV1>.Success(new RequestChangeOfSupplierResponseV1("test")));

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "meteringPointId", "571313180000000005" },
                { "businessReason", "CUSTOMER_MOVE_IN" },
                { "startDate", "2025-01-01T00:00:00Z" },
                { "customerIdentification", new Dictionary<string, object?> { { "id", "1234567890" }, { "type", "cpr" } } },
                { "customerName", "Test Customer" },
                { "energySupplier", "5790001330552" },
            });
    }

    [Fact]
    [RevisionLogTest("MoveInOperations.ChangeCustomerCharacteristicsAsync")]
    public async Task ChangeCustomerCharacteristicsAsync()
    {
        var operation =
            $$"""
              mutation (
                $meteringPointId: String!
                $businessReason: ChangeCustomerCharacteristicsBusinessReason!
                $electricalHeating: Boolean!
              ) {
                changeCustomerCharacteristics(input: {
                  meteringPointId: $meteringPointId,
                  businessReason: $businessReason,
                  electricalHeating: $electricalHeating
                }) {
                  boolean
                }
              }
            """;

        var server = new GraphQLTestService();
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV1>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<RequestChangeCustomerCharacteristicsResponseV1>.Success(new RequestChangeCustomerCharacteristicsResponseV1("test")));

        await RevisionLogTestHelper.ExecuteAndAssertAsync(
            server,
            operation,
            new()
            {
                { "meteringPointId", "571313180000000005" },
                { "businessReason", "ELECTRICAL_HEATING" },
                { "electricalHeating", true },
            });
    }
}
