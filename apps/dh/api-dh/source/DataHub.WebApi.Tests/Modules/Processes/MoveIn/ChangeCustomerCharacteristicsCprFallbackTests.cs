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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Models;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetContactCpr.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V2;
using Energinet.DataHub.ElectricityMarket.Abstractions.Framework;
using Energinet.DataHub.ElectricityMarket.Abstractions.Shared;
using Energinet.DataHub.WebApi.Tests.TestServices;
using FluentAssertions;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

using EdiResult = Energinet.DataHub.EDI.B2CClient.Abstractions.Framework.Result<Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Models.RequestChangeCustomerCharacteristicsResponseV2>;

namespace Energinet.DataHub.WebApi.Tests.Modules.Processes.MoveIn;

/// <summary>
/// Tests that verify the CPR fallback logic in <c>ChangeCustomerCharacteristicsAsync</c>.
/// When the frontend sends a null CPR for a private customer (locked field), the BFF
/// should fetch the existing CPR from the metering point's contact data.
/// </summary>
public class ChangeCustomerCharacteristicsCprFallbackTests
{
    private const string MeteringPointId = "571313180000000005";
    private const string ExistingFirstCpr = "0101901234";
    private const string ExistingSecondCpr = "0202905678";
    private static readonly Guid JuridicalContactId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid SecondaryContactId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    [Fact]
    public async Task WhenCprIsNull_ForPrivateCustomer_FetchesExistingCpr()
    {
        // Arrange
        var server = CreateTestServer();
        SetupMeteringPointWithContacts(server);
        SetupCprFetch(server, JuridicalContactId, ExistingFirstCpr);
        SetupEdiSuccess(server);

        RequestChangeCustomerCharacteristicsCommandV2? capturedCommand = null;
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV2>(), It.IsAny<CancellationToken>()))
            .Returns((RequestChangeCustomerCharacteristicsCommandV2 cmd, CancellationToken _) =>
            {
                capturedCommand = cmd;
                return Task.FromResult(EdiResult.Success(new RequestChangeCustomerCharacteristicsResponseV2("ok")));
            });

        // Act - send mutation with null firstCustomerCpr (private customer, no CVR)
        var result = await ExecuteMutation(server, firstCustomerCpr: null, firstCustomerCvr: null, firstCustomerName: "Test Name");

        // Assert
        var queryResult = (OperationResult)result;
        queryResult.Errors.Should().BeNullOrEmpty();
        capturedCommand.Should().NotBeNull();
        capturedCommand!.RequestChangeCustomerCharacteristicsRequest.FirstCustomerCpr.Should().Be(ExistingFirstCpr);
    }

    [Fact]
    public async Task WhenCprIsProvided_ForPrivateCustomer_DoesNotFetchCpr()
    {
        // Arrange
        var server = CreateTestServer();
        SetupEdiSuccess(server);

        RequestChangeCustomerCharacteristicsCommandV2? capturedCommand = null;
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV2>(), It.IsAny<CancellationToken>()))
            .Returns((RequestChangeCustomerCharacteristicsCommandV2 cmd, CancellationToken _) =>
            {
                capturedCommand = cmd;
                return Task.FromResult(EdiResult.Success(new RequestChangeCustomerCharacteristicsResponseV2("ok")));
            });

        // Act - send mutation with CPR already provided
        var result = await ExecuteMutation(server, firstCustomerCpr: "1234567890", firstCustomerCvr: null, firstCustomerName: "Test Name");

        // Assert
        var queryResult = (OperationResult)result;
        queryResult.Errors.Should().BeNullOrEmpty();
        capturedCommand.Should().NotBeNull();
        capturedCommand!.RequestChangeCustomerCharacteristicsRequest.FirstCustomerCpr.Should().Be("1234567890");

        // Should NOT have called GetMeteringPointQueryV2 or GetContactCprQueryV1
        server.ElectricityMarketClientMock.Verify(
            x => x.SendAsync(It.IsAny<GetContactCprQueryV1>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task WhenCprIsNull_ForBusinessCustomer_DoesNotFetchCpr()
    {
        // Arrange
        var server = CreateTestServer();
        SetupEdiSuccess(server);

        RequestChangeCustomerCharacteristicsCommandV2? capturedCommand = null;
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV2>(), It.IsAny<CancellationToken>()))
            .Returns((RequestChangeCustomerCharacteristicsCommandV2 cmd, CancellationToken _) =>
            {
                capturedCommand = cmd;
                return Task.FromResult(EdiResult.Success(new RequestChangeCustomerCharacteristicsResponseV2("ok")));
            });

        // Act - send mutation with CVR (business customer), null CPR
        var result = await ExecuteMutation(server, firstCustomerCpr: null, firstCustomerCvr: "12345678", firstCustomerName: "Business Corp");

        // Assert
        var queryResult = (OperationResult)result;
        queryResult.Errors.Should().BeNullOrEmpty();
        capturedCommand.Should().NotBeNull();
        capturedCommand!.RequestChangeCustomerCharacteristicsRequest.FirstCustomerCpr.Should().BeNull();

        // Should NOT have called GetContactCprQueryV1
        server.ElectricityMarketClientMock.Verify(
            x => x.SendAsync(It.IsAny<GetContactCprQueryV1>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task WhenSecondCustomerCprIsNull_WithSecondCustomerName_FetchesSecondCpr()
    {
        // Arrange
        var server = CreateTestServer();
        SetupMeteringPointWithContacts(server);
        SetupCprFetch(server, JuridicalContactId, ExistingFirstCpr);
        SetupCprFetch(server, SecondaryContactId, ExistingSecondCpr);
        SetupEdiSuccess(server);

        RequestChangeCustomerCharacteristicsCommandV2? capturedCommand = null;
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV2>(), It.IsAny<CancellationToken>()))
            .Returns((RequestChangeCustomerCharacteristicsCommandV2 cmd, CancellationToken _) =>
            {
                capturedCommand = cmd;
                return Task.FromResult(EdiResult.Success(new RequestChangeCustomerCharacteristicsResponseV2("ok")));
            });

        // Act - null CPR for both first and second customers
        var result = await ExecuteMutation(
            server,
            firstCustomerCpr: null,
            firstCustomerCvr: null,
            firstCustomerName: "Primary",
            secondCustomerCpr: null,
            secondCustomerName: "Secondary");

        // Assert
        var queryResult = (OperationResult)result;
        queryResult.Errors.Should().BeNullOrEmpty();
        capturedCommand.Should().NotBeNull();
        capturedCommand!.RequestChangeCustomerCharacteristicsRequest.FirstCustomerCpr.Should().Be(ExistingFirstCpr);
        capturedCommand.RequestChangeCustomerCharacteristicsRequest.SecondCustomerCpr.Should().Be(ExistingSecondCpr);
    }

    [Fact]
    public async Task WhenMeteringPointHasNoContacts_ThrowsGraphQLException()
    {
        // Arrange
        var server = CreateTestServer();
        SetupMeteringPointWithoutContacts(server);
        SetupEdiSuccess(server);

        // Act
        var result = await ExecuteMutation(server, firstCustomerCpr: null, firstCustomerCvr: null, firstCustomerName: "Test");

        // Assert - should return a GraphQL error since contacts could not be found
        var queryResult = (OperationResult)result;
        queryResult.Errors.Should().NotBeNullOrEmpty();
        queryResult.Errors!.First().Message.Should().Contain("no customer contacts found");

        // EDI should NOT have been called
        server.EdiB2CClientMock.Verify(
            x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV2>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    #region Test Helpers

    private static GraphQLTestService CreateTestServer()
    {
        var server = new GraphQLTestService();

        // Setup HttpContext with user claims for actor info
        var httpContext = new DefaultHttpContext();
        httpContext.User = new System.Security.Claims.ClaimsPrincipal(
            new System.Security.Claims.ClaimsIdentity(
            [
                new System.Security.Claims.Claim("azp", "5790001330552"),
                new System.Security.Claims.Claim("actornumber", "5790001330552"),
                new System.Security.Claims.Claim("marketroles", "EnergySupplier"),
            ],
            "MockedAuthenticationType"));
        server.HttpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

        return server;
    }

    private static void SetupMeteringPointWithContacts(GraphQLTestService server)
    {
        var contacts = new List<MeteringPointDtoV2.ContactDto>
        {
            new(
                Id: JuridicalContactId,
                IsProtectedName: false,
                RelationType: RelationType.Juridical,
                Name: "Primary Customer",
                Cvr: null,
                LegalContact: null,
                TechnicalContact: null),
            new(
                Id: SecondaryContactId,
                IsProtectedName: false,
                RelationType: RelationType.Secondary,
                Name: "Secondary Customer",
                Cvr: null,
                LegalContact: null,
                TechnicalContact: null),
        };

        var energySupplierPeriod = new MeteringPointDtoV2.EnergySupplierPeriodDto(
            ValidFrom: DateTimeOffset.UtcNow.AddYears(-1),
            ValidTo: DateTimeOffset.UtcNow.AddYears(1),
            Contacts: contacts);

        var commercialRelation = new MeteringPointDtoV2.CommercialRelationDto(
            ValidFrom: DateTimeOffset.UtcNow.AddYears(-1),
            ValidTo: DateTimeOffset.UtcNow.AddYears(1),
            EnergySupplierId: "5790001330552",
            ActiveEnergySupplierPeriod: energySupplierPeriod,
            ActiveElectricalHeatingPeriod: null,
            EnergySupplierPeriods: [energySupplierPeriod],
            ElectricalHeatingPeriods: []);

        var meteringPointPeriod = CreateDummyMeteringPointPeriod();

        var meteringPoint = new MeteringPointDtoV2(
            MeteringPointId: MeteringPointId,
            MeteringPointPeriod: meteringPointPeriod,
            CommercialRelation: commercialRelation,
            MeteringPointPeriods: [meteringPointPeriod],
            CommercialRelations: [commercialRelation]);

        server.ElectricityMarketClientMock
            .Setup(x => x.SendAsync(It.IsAny<GetMeteringPointQueryV2>(), It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(Result<GetMeteringPointResultDtoV2>.Success(new GetMeteringPointResultDtoV2(meteringPoint))));
    }

    private static void SetupMeteringPointWithoutContacts(GraphQLTestService server)
    {
        var meteringPointPeriod = CreateDummyMeteringPointPeriod();

        var meteringPoint = new MeteringPointDtoV2(
            MeteringPointId: MeteringPointId,
            MeteringPointPeriod: meteringPointPeriod,
            CommercialRelation: null,
            MeteringPointPeriods: [meteringPointPeriod],
            CommercialRelations: []);

        server.ElectricityMarketClientMock
            .Setup(x => x.SendAsync(It.IsAny<GetMeteringPointQueryV2>(), It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(Result<GetMeteringPointResultDtoV2>.Success(new GetMeteringPointResultDtoV2(meteringPoint))));
    }

    private static void SetupCprFetch(GraphQLTestService server, Guid contactId, string cpr)
    {
        server.ElectricityMarketClientMock
            .Setup(x => x.SendAsync(
                It.Is<GetContactCprQueryV1>(q => q.ContactId == contactId),
                It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(Result<GetContactCprResultDtoV1>.Success(new GetContactCprResultDtoV1(cpr))));
    }

    private static void SetupEdiSuccess(GraphQLTestService server)
    {
        server.EdiB2CClientMock
            .Setup(x => x.SendAsync(It.IsAny<RequestChangeCustomerCharacteristicsCommandV2>(), It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(EdiResult.Success(new RequestChangeCustomerCharacteristicsResponseV2("ok"))));
    }

    private static MeteringPointDtoV2.MeteringPointPeriodDto CreateDummyMeteringPointPeriod()
    {
        return new MeteringPointDtoV2.MeteringPointPeriodDto(
            ValidFrom: DateTimeOffset.UtcNow.AddYears(-1),
            ValidTo: DateTimeOffset.UtcNow.AddYears(1),
            Type: MeteringPointType.Consumption,
            SubType: MeteringPointSubType.Physical,
            TimeResolution: TimeResolution.QuarterHourly,
            EnergyUnit: EnergyUnit.KWh,
            GridAreaId: "804",
            ConnectionState: ConnectionState.Connected,
            ConnectionType: null,
            DisconnectionType: null,
            ParentMeteringPointId: null,
            MeterId: null,
            SettlementMethod: null,
            Product: null,
            ProductionObligation: null,
            AssetType: null,
            AssetCapacity: null,
            PowerLimitKw: null,
            PowerLimitAmperes: null,
            SettlementGroup: null,
            SettlementDate: null,
            FromGridAreaId: null,
            ToGridAreaId: null,
            PowerPlantGsrn: null,
            InstallationAddress: null);
    }

    private static async Task<IExecutionResult> ExecuteMutation(
        GraphQLTestService server,
        string? firstCustomerCpr,
        string? firstCustomerCvr,
        string? firstCustomerName,
        string? secondCustomerCpr = null,
        string? secondCustomerName = null)
    {
        var operation =
            """
            mutation (
              $meteringPointId: String!
              $businessReason: BusinessReasonV2!
              $electricalHeating: Boolean!
              $firstCustomerCpr: String
              $firstCustomerCvr: String
              $firstCustomerName: String
              $secondCustomerCpr: String
              $secondCustomerName: String
            ) {
              changeCustomerCharacteristics(input: {
                meteringPointId: $meteringPointId,
                businessReason: $businessReason,
                electricalHeating: $electricalHeating,
                firstCustomerCpr: $firstCustomerCpr,
                firstCustomerCvr: $firstCustomerCvr,
                firstCustomerName: $firstCustomerName,
                secondCustomerCpr: $secondCustomerCpr,
                secondCustomerName: $secondCustomerName
              }) {
                boolean
              }
            }
            """;

        return await server.ExecuteRequestAsync(builder =>
        {
            builder.SetDocument(operation);
            builder.SetUser(new System.Security.Claims.ClaimsPrincipal(
                new System.Security.Claims.ClaimsIdentity(
                [
                    new System.Security.Claims.Claim("azp", "5790001330552"),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "metering-point:move-in"),
                    new System.Security.Claims.Claim("marketparticipant-number", "5790001330552"),
                    new System.Security.Claims.Claim("marketparticipant-market-role", "EnergySupplier"),
                ],
                "MockedAuthenticationType")));
            builder.SetVariableValues(new Dictionary<string, object?>
            {
                { "meteringPointId", MeteringPointId },
                { "businessReason", "UPDATE_MASTER_DATA_CONSUMER" },
                { "electricalHeating", false },
                { "firstCustomerCpr", firstCustomerCpr },
                { "firstCustomerCvr", firstCustomerCvr },
                { "firstCustomerName", firstCustomerName },
                { "secondCustomerCpr", secondCustomerCpr },
                { "secondCustomerName", secondCustomerName },
            });
        });
    }

    #endregion
}
