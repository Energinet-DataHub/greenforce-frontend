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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Repositories;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Repositories
{
    [UnitTest]
    public sealed class GridAreaRepositoryTests
    {
        [Fact]
        public async Task GetAsync_ArgumentNull_ThrowsException()
        {
            // Arrange
            var target = new GridAreaRepository(new Mock<MarketParticipantDbContext>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.GetAsync(null!))
                .ConfigureAwait(false);
        }

        [Fact]
        public async Task AddOrUpdateAsync_ArgumentNull_ThrowsException()
        {
            // Arrange
            var target = new GridAreaRepository(new Mock<MarketParticipantDbContext>().Object);

            // Act + Assert
            await Assert
                .ThrowsAsync<ArgumentNullException>(() => target.AddOrUpdateAsync(null!))
                .ConfigureAwait(false);
        }
    }
}
