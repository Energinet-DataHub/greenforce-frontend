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
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.GridAreaIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Infrastructure
{
    [UnitTest]
    public sealed class GridAreaNameChangedEventDispatcherTests
    {
        [Fact]
        public async Task GridAreaNameChanged_IntegrationEventDispatcher_CanReadEvent()
        {
            // arrange
            await using var serviceBusSenderMock = new MockedServiceBusSender();
            var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
            serviceBusClient.Setup(x => x.CreateSender()).Returns(serviceBusSenderMock);

            var gridAreaEventParser = new GridAreaNameChangedIntegrationEventParser();
            var eventParser = new SharedIntegrationEventParser();
            var target = new GridAreaNameChangedEventDispatcher(gridAreaEventParser, serviceBusClient.Object);

            var integrationEvent = new GridAreaNameChangedIntegrationEvent
            {
                GridAreaId = new GridAreaId(Guid.NewGuid()),
                Name = new GridAreaName("new_fake_value")
            };

            // act
            var actual = await target.TryDispatchAsync(integrationEvent).ConfigureAwait(false);
            var actualMessage = serviceBusSenderMock.SentMessages.Single();
            var actualEvent = eventParser.Parse(actualMessage.Body.ToArray()) as MarketParticipant.Integration.Model.Dtos.GridAreaNameChangedIntegrationEvent;

            // assert
            Assert.True(actual);
            Assert.NotNull(actualEvent);
            Assert.Equal(integrationEvent.Id, actualEvent!.Id);
            Assert.Equal(integrationEvent.Name.Value, actualEvent.Name);
        }

        [Fact]
        public async Task GridAreaNameChangedIntegrationEventDispatcher_WrongEventType_ReturnsFalse()
        {
            // arrange
            await using var serviceBusSenderMock = new MockedServiceBusSender();
            var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
            serviceBusClient.Setup(x => x.CreateSender()).Returns(serviceBusSenderMock);

            var eventParser = new GridAreaNameChangedIntegrationEventParser();
            var target = new GridAreaNameChangedEventDispatcher(eventParser, serviceBusClient.Object);

            var integrationEvent = new GridAreaCreatedIntegrationEvent()
            {
                GridAreaId = new GridAreaId(Guid.NewGuid()),
                Name = new GridAreaName("fake_value"),
                Code = new GridAreaCode("123"),
                PriceAreaCode = PriceAreaCode.Dk1,
                GridAreaLinkId = new GridAreaLinkId(Guid.NewGuid())
            };

            // act
            var actual = await target.TryDispatchAsync(integrationEvent).ConfigureAwait(false);

            // assert
            Assert.False(actual);
        }
    }
}
