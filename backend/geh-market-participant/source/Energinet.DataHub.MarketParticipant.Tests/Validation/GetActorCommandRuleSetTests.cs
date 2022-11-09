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
using Energinet.DataHub.MarketParticipant.Application.Commands.Actor;
using Energinet.DataHub.MarketParticipant.Application.Validation;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation
{
    [UnitTest]
    public sealed class GetActorCommandRuleSetTests
    {
        private static readonly Guid _validOrganizationId = Guid.NewGuid();
        private static readonly Guid _validActorId = Guid.NewGuid();

        [Fact]
        public async Task Validate_OrganizationId_ValidatesProperty()
        {
            // Arrange
            const string propertyName = nameof(GetSingleActorCommand.OrganizationId);

            var target = new GetSingleActorCommandRuleSet();
            var command = new GetSingleActorCommand(_validActorId, Guid.Empty);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }

        [Fact]
        public async Task Validate_ActorId_ValidatesProperty()
        {
            // Arrange
            const string propertyName = nameof(GetSingleActorCommand.ActorId);

            var target = new GetSingleActorCommandRuleSet();
            var command = new GetSingleActorCommand(Guid.Empty, _validOrganizationId);

            // Act
            var result = await target.ValidateAsync(command).ConfigureAwait(false);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(propertyName, result.Errors.Select(x => x.PropertyName));
        }
    }
}
