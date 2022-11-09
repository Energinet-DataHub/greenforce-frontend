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
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Validation;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Xunit;
using Xunit.Categories;
namespace Energinet.DataHub.MarketParticipant.Tests.Validation
{
    [UnitTest]
    public sealed class CreateActorCommandRuleSetTests
    {
        private const string ValidId = "6AF7D019-06A7-465B-AF9E-983BF0C7A907";
        private const string ValidGln = "5790000555550";
        [Fact]
        public async Task Validate_ActorDto_ValidatesProperty()
        {
            // Arrange
            const string propertyName = nameof(CreateActorCommand.Actor);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), null!);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Theory]
        [InlineData("8F9B8218-BAE6-412B-B91B-0C78A55FF128", true)]
        public async Task Validate_OrganizationId_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            const string propertyName = nameof(CreateActorCommand.OrganizationId);

            var validMeteringPointTypes = new[] { MeteringPointType.D05NetProduction.ToString() };
            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), validMeteringPointTypes) };
            var marketRole = new List<ActorMarketRoleDto> { new("CapacityTrader", validGridAreas, string.Empty) };

            var actorDto = new CreateActorDto(new ActorNameDto("fake_name"), new ActorNumberDto(ValidGln), marketRole);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(value), actorDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }

        [Theory]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("  ", false)]
        [InlineData("5790000555550", true)]
        public async Task Validate_ActorGln_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            var propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.ActorNumber)}";

            var validMeteringPointTypes = new[] { MeteringPointType.D05NetProduction.ToString() };
            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), validMeteringPointTypes) };
            var marketRole = new List<ActorMarketRoleDto> { new("CapacityTrader", validGridAreas, string.Empty) };

            var actorDto = new CreateActorDto(new ActorNameDto("fake_name"), new ActorNumberDto(value), marketRole);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), actorDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }

        [Fact]
        public async Task Validate_MarketRole_ValidatesProperty()
        {
            // Arrange
            const string propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}";

            var createActorDto = new CreateActorDto(new ActorNameDto("fake_name"), new ActorNumberDto(ValidGln), null!);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), createActorDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Fact]
        public async Task Validate_NullMarketRole_ValidatesProperty()
        {
            // Arrange
            const string propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}[0]";

            var createActorDto = new CreateActorDto(new ActorNameDto("fake_name"), new ActorNumberDto(ValidGln), new ActorMarketRoleDto[] { null! });

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), createActorDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Theory]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("  ", false)]
        [InlineData("GridAccessProvider", true)]
        [InlineData("ProductionResponsibleParty", true)]
        [InlineData("Consumer", true)]
        [InlineData("CONSUMER", true)]
        [InlineData("ConsumerXyz", false)]
        public async Task Validate_MarketRoleFunction_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            const string propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}[0].{nameof(ActorMarketRoleDto.EicFunction)}";

            var validMeteringPointTypes = new[] { MeteringPointType.D05NetProduction.ToString() };
            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), validMeteringPointTypes) };

            var organizationRoleDto = new CreateActorDto(
                new ActorNameDto("fake_name"),
                new ActorNumberDto(ValidGln),
                new[] { new ActorMarketRoleDto(value, validGridAreas, string.Empty) });

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), organizationRoleDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }

        [Fact]
        public async Task Validate_MeteringPointTypes_ValidatesProperty()
        {
            // Arrange
            const string propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}[0].GridAreas[0].MeteringPointTypes";

            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), null!) };
            var marketRole = new List<ActorMarketRoleDto> { new("CapacityTrader", validGridAreas, string.Empty) };

            var organizationRoleDto = new CreateActorDto(
                new ActorNameDto("fake_name"),
                new ActorNumberDto(ValidGln),
                marketRole);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), organizationRoleDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Fact]
        public async Task Validate_NoMeteringPointTypes_ValidatesProperty()
        {
            // Arrange
            const string propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}[0].GridAreas[0].MeteringPointTypes";

            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), Array.Empty<string>()) };
            var marketRole = new List<ActorMarketRoleDto> { new("CapacityTrader", validGridAreas, string.Empty) };

            var organizationRoleDto = new CreateActorDto(
                new ActorNameDto("fake_name"),
                new ActorNumberDto(ValidGln),
                marketRole);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), organizationRoleDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Fact]
        public async Task Validate_NullMeteringPointTypes_ValidatesProperty()
        {
            // Arrange
            const string propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}[0].GridAreas[0].MeteringPointTypes[0]";

            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), new string[] { null! }) };
            var marketRole = new List<ActorMarketRoleDto> { new("CapacityTrader", validGridAreas, string.Empty) };

            var organizationRoleDto = new CreateActorDto(
                new ActorNameDto("fake_name"),
                new ActorNumberDto(ValidGln),
                marketRole);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), organizationRoleDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Theory]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("  ", false)]
        [InlineData("D06SupplyToGrid", true)]
        [InlineData("D07ConsumptionFromGrid", true)]
        [InlineData("D09OwnProduction", true)]
        [InlineData("D09OWNPRODUCTION", true)]
        [InlineData("D09OwnProductionXyz", false)]
        public async Task Validate_MeteringPointType_ValidatesProperty(string value, bool isValid)
        {
            // Arrange
            var propertyName = $"{nameof(CreateActorCommand.Actor)}.{nameof(CreateActorDto.MarketRoles)}[0].GridAreas[0].MeteringPointTypes[0]";

            var validGridAreas = new List<ActorGridAreaDto> { new(Guid.NewGuid(), new[] { value }) };
            var marketRole = new List<ActorMarketRoleDto> { new("CapacityTrader", validGridAreas, string.Empty) };

            var createActorDto = new CreateActorDto(
                new ActorNameDto("fake_name"),
                new ActorNumberDto(ValidGln),
                marketRole);

            var target = new CreateActorCommandRuleSet();
            var command = new CreateActorCommand(Guid.Parse(ValidId), createActorDto);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            if (isValid)
            {
                Assert.True(result.IsValid);
                Assert.DoesNotContain(propertyName, result.Errors.Select(x => x.PropertyName));
            }
            else
            {
                Assert.False(result.IsValid);
                Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
            }
        }
    }
}
