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
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Infrastructure
{
    [UnitTest]
    public sealed class GridAreaCreatedEventDispatcherTests
    {
        [Fact]
        public async Task GridAreaCreated_IntegrationEventDispatcher_CanReadEvent()
        {
            // arrange
            await using var serviceBusSenderMock = new MockedServiceBusSender();
            var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
            serviceBusClient.Setup(x => x.CreateSender()).Returns(serviceBusSenderMock);

            var gridAreaEventParser = new GridAreaIntegrationEventParser();
            var eventParser = new SharedIntegrationEventParser();
            var target = new GridAreaCreatedEventDispatcher(gridAreaEventParser, serviceBusClient.Object);

            var integrationEvent = new GridAreaCreatedIntegrationEvent
            {
                GridAreaId = new GridAreaId(Guid.NewGuid()),
                Name = new GridAreaName("fake_value"),
                Code = new GridAreaCode("123"),
                PriceAreaCode = PriceAreaCode.Dk1,
                GridAreaLinkId = new GridAreaLinkId(Guid.NewGuid())
            };

            // act
            var actual = await target.TryDispatchAsync(integrationEvent).ConfigureAwait(false);
            var actualMessage = serviceBusSenderMock.SentMessages.Single();
            var actualEvent = eventParser.Parse(actualMessage.Body.ToArray()) as MarketParticipant.Integration.Model.Dtos.GridAreaCreatedIntegrationEvent;

            // assert
            Assert.True(actual);
            Assert.NotNull(actualEvent);
            Assert.Equal(integrationEvent.Id, actualEvent!.Id);
            Assert.Equal(integrationEvent.Name.Value, actualEvent.Name);
            Assert.Equal(integrationEvent.Code.Value, actualEvent.Code);
            Assert.Equal(integrationEvent.PriceAreaCode, (PriceAreaCode)actualEvent.PriceAreaCode);
            Assert.Equal(integrationEvent.GridAreaLinkId.Value, actualEvent.GridAreaLinkId);
        }

        [Fact]
        public async Task GridAreaUpdatedIntegrationEventDispatcher_WrongEventType_ReturnsFalse()
        {
            // arrange
            await using var serviceBusSenderMock = new MockedServiceBusSender();
            var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
            serviceBusClient.Setup(x => x.CreateSender()).Returns(serviceBusSenderMock);

            var eventParser = new GridAreaIntegrationEventParser();
            var target = new GridAreaCreatedEventDispatcher(eventParser, serviceBusClient.Object);

            var integrationEvent = new ActorUpdatedIntegrationEvent
            {
                ActorNumber = new MockedGln(),
                Status = ActorStatus.Active,
                ActorId = Guid.NewGuid(),
                BusinessRoles = { BusinessRoleCode.Ddk },
                OrganizationId = new OrganizationId(Guid.NewGuid()),
                ExternalActorId = new ExternalActorId(Guid.NewGuid())
            };

            // act
            var actual = await target.TryDispatchAsync(integrationEvent).ConfigureAwait(false);

            // assert
            Assert.False(actual);
        }
    }
}
