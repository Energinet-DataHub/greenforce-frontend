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
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Moq;
using NodaTime.Text;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Infrastructure;

[UnitTest]
public sealed class EventDispatcherBaseTests
{
    [Fact]
    public async Task Dispatch_WithEvent_AssignsIntegrationEventMetadata()
    {
        // Arrange
        await using var serviceBusSenderMock = new MockedServiceBusSender();

        var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
        serviceBusClient
            .Setup(x => x.CreateSender())
            .Returns(serviceBusSenderMock);

        var integrationEventGuid = Guid.NewGuid();
        var target = new TestEventDispatcher(serviceBusClient.Object, integrationEventGuid);

        // Act
        await target.TryDispatchAsync(new Mock<IIntegrationEvent>().Object).ConfigureAwait(false);

        // Assert
        var actualMessage = serviceBusSenderMock.SentMessages.Single();
        var properties = actualMessage.ApplicationProperties;

        var actualTimestamp = (string)properties["OperationTimestamp"];
        Assert.NotNull(actualTimestamp);
        Assert.True(InstantPattern.General.Parse(actualTimestamp).Success);

        var actualCorrelationId = Guid.Parse((string)properties["OperationCorrelationId"]);
        Assert.NotEqual(Guid.Empty, actualCorrelationId);

        Assert.Equal(integrationEventGuid.ToString(), properties["EventIdentification"]);
        Assert.Equal(1, properties["MessageVersion"]);
        Assert.Equal("TestBaseIntegrationEvent", properties["MessageType"]);
    }

    [Fact]
    public async Task Dispatch_WithEvent_AssignsEventMetadata()
    {
        // Arrange
        await using var serviceBusSenderMock = new MockedServiceBusSender();

        var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
        serviceBusClient
            .Setup(x => x.CreateSender())
            .Returns(serviceBusSenderMock);

        var integrationEventGuid = Guid.NewGuid();
        var target = new TestEventDispatcher(serviceBusClient.Object, integrationEventGuid);

        // Act
        await target.TryDispatchAsync(new Mock<IIntegrationEvent>().Object).ConfigureAwait(false);

        // Assert
        var actualMessage = serviceBusSenderMock.SentMessages.Single();
        var properties = actualMessage.ApplicationProperties;

        Assert.Equal("TestBaseIntegrationEvent", properties["IntegrationEventType"]);
    }

    private sealed class TestEventDispatcher : EventDispatcherBase
    {
        private readonly Guid _testIntegrationEventGuid;

        public TestEventDispatcher(
            IMarketParticipantServiceBusClient serviceBusClient,
            Guid testIntegrationEventGuid)
            : base(serviceBusClient)
        {
            _testIntegrationEventGuid = testIntegrationEventGuid;
        }

        public override async Task<bool> TryDispatchAsync(IIntegrationEvent integrationEvent)
        {
            var outboundIntegrationEvent = new TestBaseIntegrationEvent(
                _testIntegrationEventGuid,
                DateTime.UtcNow);

            await DispatchAsync(outboundIntegrationEvent, Array.Empty<byte>());
            return true;
        }
    }

    private sealed record TestBaseIntegrationEvent : BaseIntegrationEvent
    {
        public TestBaseIntegrationEvent(Guid id, DateTime eventCreated)
            : base(id, eventCreated)
        {
        }
    }
}
