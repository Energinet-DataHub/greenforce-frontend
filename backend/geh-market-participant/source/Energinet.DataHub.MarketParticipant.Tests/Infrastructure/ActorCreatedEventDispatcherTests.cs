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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.ActorIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents.OrganizationIntegrationEvents;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor;
using Energinet.DataHub.MarketParticipant.Tests.Common;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Infrastructure
{
    [UnitTest]
    public sealed class ActorCreatedEventDispatcherTests
    {
        [Fact]
        public async Task ActorCreated_IntegrationEventDispatcher_CanReadEvent()
        {
            // arrange
            await using var serviceBusSenderMock = new MockedServiceBusSender();
            var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
            serviceBusClient.Setup(x => x.CreateSender()).Returns(serviceBusSenderMock);
            var actorEventParser = new ActorCreatedIntegrationEventParser();
            var eventParser = new SharedIntegrationEventParser();
            var target = new ActorCreatedEventDispatcher(actorEventParser, serviceBusClient.Object);

            var integrationEvent = new ActorCreatedIntegrationEvent
            {
                ActorId = Guid.NewGuid(),
                OrganizationId = new OrganizationId(Guid.NewGuid()),
                ActorNumber = new MockedGln(),
                Status = ActorStatus.Active,
                Name = new ActorName("ActorName")
            };
            integrationEvent.BusinessRoles.Add(BusinessRoleCode.Ddk);

            var meteringPointType = MeteringPointType.D03NotUsed;
            var actorGridArea = new ActorGridAreaEventData(Guid.NewGuid(), new List<string> { meteringPointType.ToString() });
            var marketRole = new ActorMarketRoleEventData(EicFunction.Consumer, new List<ActorGridAreaEventData> { actorGridArea });
            integrationEvent.ActorMarketRoles.Add(marketRole);

            // act
            var actual = await target.TryDispatchAsync(integrationEvent).ConfigureAwait(false);
            var actualMessage = serviceBusSenderMock.SentMessages.Single();
            var actualEvent = (MarketParticipant.Integration.Model.Dtos.ActorCreatedIntegrationEvent)eventParser.Parse(actualMessage.Body.ToArray());
            var actualMarketRole = actualEvent.ActorMarketRoles.Single();
            var actualGridArea = actualMarketRole.GridAreas.Single();
            var actualMeteringPoint = actualGridArea.MeteringPointTypes.Single();

            // assert
            Assert.True(actual);
            Assert.NotNull(actualEvent);
            Assert.Equal(integrationEvent.Id, actualEvent.Id);
            Assert.Equal(integrationEvent.OrganizationId.Value, actualEvent.OrganizationId);
            Assert.Equal(integrationEvent.ActorNumber.Value, actualEvent.ActorNumber.Value);
            Assert.Equal((int)integrationEvent.ActorNumber.Type, (int)actualEvent.ActorNumber.Type);
            Assert.Equal(integrationEvent.Name.Value, actualEvent.Name);
            Assert.Equal((int)integrationEvent.Status, (int)actualEvent.Status);
            Assert.Equal((int)integrationEvent.BusinessRoles.Single(), (int)actualEvent.BusinessRoles.Single());
            Assert.Equal((int)marketRole.Function, (int)actualMarketRole.Function);
            Assert.Equal(actorGridArea.Id, actualGridArea.Id);
            Assert.Equal(meteringPointType.ToString(), actualMeteringPoint);
        }

        [Fact]
        public async Task ActorCreatedIntegrationEventDispatcher_WrongEventType_ReturnsFalse()
        {
            // arrange
            await using var serviceBusSenderMock = new MockedServiceBusSender();
            var serviceBusClient = new Mock<IMarketParticipantServiceBusClient>();
            serviceBusClient.Setup(x => x.CreateSender()).Returns(serviceBusSenderMock);

            var eventParser = new ActorCreatedIntegrationEventParser();
            var target = new ActorCreatedEventDispatcher(eventParser, serviceBusClient.Object);

            var integrationEvent = new OrganizationCreatedIntegrationEvent
            {
                Address = new Address(
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value"),
                Name = "fake_value",
                OrganizationId = new OrganizationId(Guid.NewGuid()),
                BusinessRegisterIdentifier = new BusinessRegisterIdentifier("12345678")
            };

            // act
            var actual = await target.TryDispatchAsync(integrationEvent).ConfigureAwait(false);

            // assert
            Assert.False(actual);
        }
    }
}
