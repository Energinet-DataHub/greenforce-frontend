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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.Framework;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeAccountingPointCharacteristics.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeAccountingPointCharacteristics.V1.Models;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Disconnection;
using FluentAssertions;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Modules.Processes.Disconnection;

public class DisconnectMeteringPointOperationsTests
{
    [Theory]
    [InlineData(ConnectionState.New, ConnectionStateV1.New)]
    [InlineData(ConnectionState.Connected, ConnectionStateV1.Disconnected)]
    [InlineData(ConnectionState.Disconnected, ConnectionStateV1.Disconnected)]
    [InlineData(ConnectionState.ClosedDown, ConnectionStateV1.Disconnected)]
    [InlineData(ConnectionState.NotUsed, ConnectionStateV1.Disconnected)]
    public async Task DisconnectMeteringPointAsync_MapsCurrentConnectionStateToCommand(
        ConnectionState currentConnectionState,
        ConnectionStateV1 expectedConnectionState)
    {
        var meteringPointId = "571313180100000001";
        var processId = Guid.NewGuid();
        var validityDate = new DateTimeOffset(2025, 12, 31, 23, 0, 0, TimeSpan.Zero);
        var ediB2CClient = new Mock<IB2CClient>();
        RequestForChangeOfConnectionStatusCommandV1? sentCommand = null;

        ediB2CClient
            .Setup(x => x.SendAsync(
                It.IsAny<Command<RequestForChangeOfConnectionStatusResponseV1>>(),
                It.IsAny<CancellationToken>()))
            .Callback<Command<RequestForChangeOfConnectionStatusResponseV1>, CancellationToken>(
                (command, _) => sentCommand = command as RequestForChangeOfConnectionStatusCommandV1)
            .ReturnsAsync(Result<RequestForChangeOfConnectionStatusResponseV1>.Success(
                new RequestForChangeOfConnectionStatusResponseV1("ok")));

        var result = await DisconnectMeteringPointOperations.DisconnectMeteringPointAsync(
            meteringPointId,
            processId,
            validityDate,
            currentConnectionState,
            ediB2CClient.Object,
            CancellationToken.None);

        result.Should().BeTrue();
        sentCommand.Should().NotBeNull();
        sentCommand!.RequestForChangeOfConnectionStatus.Should().Be(
            new RequestForChangeOfConnectionStatusV1(
                MeteringPointId: meteringPointId,
                BusinessReason: BusinessReasonV1.EndOfSupply,
                ProcessReference: processId,
                ValidityDate: validityDate,
                ConnectionState: expectedConnectionState));
    }
}
