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
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Exceptions;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Organization;
using Xunit;
using Xunit.Categories;
using ActorStatus = Energinet.DataHub.MarketParticipant.Integration.Model.Dtos.ActorStatus;
using EicFunction = Energinet.DataHub.MarketParticipant.Integration.Model.Dtos.EicFunction;

namespace Energinet.DataHub.MarketParticipant.Libraries.Tests.Parsers
{
    [UnitTest]
    public class SharedIntegrationEventParserTests
    {
        [Fact]
        public void ParseCorrectlyWith_ActorUpdatedIntegrationEventParser()
        {
            // arrange
            var input = new ActorUpdatedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ActorUpdatedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                new ActorNumber("0123456789012", ActorNumberType.Gln),
                ActorStatus.Active,
                new[] { BusinessRoleCode.Ddk, BusinessRoleCode.Ddm },
                new[] { new ActorMarketRole(EicFunction.Agent, new[] { new ActorGridArea(Guid.NewGuid(), new[] { "t1" }) }) });

            // act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // assert
            Assert.IsType<ActorUpdatedIntegrationEvent>(actualEventObject);
            var actualTyped = actualEventObject as ActorUpdatedIntegrationEvent;
            Assert.Equal(@event.ActorId, actualTyped!.ActorId);
        }

        [Fact]
        public void ParseCorrectlyWith_ActorCreatedIntegrationEventParser()
        {
            // arrange
            var input = new ActorCreatedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ActorCreatedIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                ActorStatus.Active,
                new ActorNumber("0123456789012", ActorNumberType.Gln),
                "ActorName",
                new[] { BusinessRoleCode.Ddk, BusinessRoleCode.Ddm },
                new[] { new Integration.Model.Dtos.ActorMarketRole(EicFunction.Agent, new[] { new Integration.Model.Dtos.ActorGridArea(Guid.NewGuid(), new[] { "t1" }) }) },
                DateTime.UtcNow);

            // act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // assert
            Assert.IsType<ActorCreatedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_ActorExternalIdChangedIntegrationEventParser()
        {
            // arrange
            var input = new ActorExternalIdChangedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ActorExternalIdChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid());

            // act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // assert
            Assert.IsType<ActorExternalIdChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_ActorStatusChangedIntegrationEventParser()
        {
            // arrange
            var input = new ActorStatusChangedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ActorStatusChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                Guid.NewGuid(),
                ActorStatus.Active);

            // act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // assert
            Assert.IsType<ActorStatusChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_ActorNameChangedIntegrationEventParser()
        {
            // arrange
            var input = new ActorNameChangedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ActorNameChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                Guid.NewGuid(),
                "ActorName");

            // act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // assert
            Assert.IsType<ActorNameChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_GridAreaUpdatedIntegrationEventParser()
        {
            // Arrange
            var input = new GridAreaUpdatedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new GridAreaUpdatedIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                "TestArea",
                "123",
                PriceAreaCode.DK1,
                Guid.NewGuid());

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<GridAreaUpdatedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationUpdatedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationUpdatedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new OrganizationUpdatedIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                "TestOrg",
                "12345678",
                new Address(
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value"));

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationUpdatedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_GridAreaCreatedIntegrationEventParser()
        {
            // Arrange
            var input = new GridAreaIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new GridAreaCreatedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                "TestArea",
                "123",
                PriceAreaCode.DK1,
                Guid.NewGuid());

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<GridAreaCreatedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_GridAreaNameChangedIntegrationEventParser()
        {
            // Arrange
            var input = new GridAreaNameChangedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new GridAreaNameChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                "TestArea");

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<GridAreaNameChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationCreatedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationCreatedIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new OrganizationCreatedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                "TestOrg",
                "12345678",
                new Address(
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value",
                    "fake_value"),
                OrganizationStatus.New);

            @event.Comment = "fake_comment";

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationCreatedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationNameChangedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationNameChangedIntegrationEventParser();
            var sharedIntegrationParser = new SharedIntegrationEventParser();

            var @event = new OrganizationNameChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                "TestOrg");

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = sharedIntegrationParser.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationNameChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationStatusChangedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationStatusChangedIntegrationEventParser();
            var sharedIntegrationParser = new SharedIntegrationEventParser();

            var @event = new OrganizationStatusChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                OrganizationStatus.Active);

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = sharedIntegrationParser.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationStatusChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationCommentChangedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationCommentChangedIntegrationEventParser();
            var sharedIntegrationParser = new SharedIntegrationEventParser();

            var @event = new OrganizationCommentChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                "TestComment");

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = sharedIntegrationParser.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationCommentChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationBusinessRegisterIdentifierChangedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationBusinessRegisterIdentifierChangedIntegrationEventParser();
            var sharedIntegrationParser = new SharedIntegrationEventParser();

            var @event = new OrganizationBusinessRegisterIdentifierChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                "BusinessIdentifier");

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = sharedIntegrationParser.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationBusinessRegisterIdentifierChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_OrganizationAddressChangedIntegrationEventParser()
        {
            // Arrange
            var input = new OrganizationAddressChangedIntegrationEventParser();
            var sharedIntegrationParser = new SharedIntegrationEventParser();

            var @event = new OrganizationAddressChangedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                Guid.NewGuid(),
                new Address(
                    "fake_street",
                    "fake_number",
                    "fake_zip",
                    "fake_city",
                    "fake_country"));

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = sharedIntegrationParser.Parse(actualBytes);

            // Assert
            Assert.IsType<OrganizationAddressChangedIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_MeteringPointTypeAddedToActorIntegrationEventParser()
        {
            // Arrange
            var input = new MeteringPointTypeAddedToActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new MeteringPointTypeAddedToActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                EicFunction.Agent,
                Guid.NewGuid(),
                DateTime.UtcNow,
                "123");

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<MeteringPointTypeAddedToActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_MeteringPointTypeRemovedFromActorIntegrationEventParser()
        {
            // Arrange
            var input = new MeteringPointTypeRemovedFromActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new MeteringPointTypeRemovedFromActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                EicFunction.Agent,
                Guid.NewGuid(),
                "123",
                DateTime.UtcNow);

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<MeteringPointTypeRemovedFromActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_GridAreaAddedToActorIntegrationEventParser()
        {
            // Arrange
            var input = new GridAreaAddedToActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new GridAreaAddedToActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                DateTime.UtcNow,
                EicFunction.Agent,
                Guid.NewGuid(),
                Guid.NewGuid());

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<GridAreaAddedToActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_GridAreaRemovedFromActorIntegrationEventParser()
        {
            // Arrange
            var input = new GridAreaRemovedFromActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new GridAreaRemovedFromActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                DateTime.UtcNow,
                EicFunction.Agent,
                Guid.NewGuid(),
                Guid.NewGuid());

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<GridAreaRemovedFromActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_MarketRoleRemovedFromActorIntegrationEventParser()
        {
            // Arrange
            var input = new MarketRoleRemovedFromActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new MarketRoleRemovedFromActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                BusinessRoleCode.Ddk,
                EicFunction.Agent,
                DateTime.UtcNow);

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<MarketRoleRemovedFromActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_MarketRoleAddedToActorIntegrationEventParser()
        {
            // Arrange
            var input = new MarketRoleAddedToActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new MarketRoleAddedToActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                BusinessRoleCode.Ddk,
                EicFunction.Agent,
                DateTime.UtcNow);

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<MarketRoleAddedToActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_ContactAddedToActorIntegrationEventParser()
        {
            // Arrange
            var input = new ContactAddedToActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ContactAddedToActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                DateTime.UtcNow,
                new ActorContact(
                    "fake_name",
                    "fake_email@me.dk",
                    ContactCategory.Default,
                    "34343434"));

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<ContactAddedToActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseCorrectlyWith_ContactRemovedFromActorIntegrationEventParser()
        {
            // Arrange
            var input = new ContactRemovedFromActorIntegrationEventParser();
            var findAndParse = new SharedIntegrationEventParser();

            var @event = new ContactRemovedFromActorIntegrationEvent(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                DateTime.UtcNow,
                new ActorContact(
                    "fake_name",
                    "fake_email@me.dk",
                    ContactCategory.Default,
                    "34343434"));

            // Act
            var actualBytes = input.ParseToSharedIntegrationEvent(@event);
            var actualEventObject = findAndParse.Parse(actualBytes);

            // Assert
            Assert.IsType<ContactRemovedFromActorIntegrationEvent>(actualEventObject);
        }

        [Fact]
        public void ParseException_FallThrough()
        {
            // Arrange
            var findAndParse = new SharedIntegrationEventParser();

            var actualBytes = System.Text.Encoding.ASCII.GetBytes("unknown");

            // Act + Assert
            Assert.Throws<MarketParticipantException>(() => findAndParse.Parse(actualBytes));
        }
    }
}
