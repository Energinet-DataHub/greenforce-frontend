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
using Energinet.DataHub.MarketParticipant.Application.Services;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Repositories;

[Collection("IntegrationTest")]
[IntegrationTest]
public sealed class ExternalActorSynchronizationRepositoryTests
{
    private readonly MarketParticipantDatabaseFixture _fixture;

    public ExternalActorSynchronizationRepositoryTests(MarketParticipantDatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task DequeueNextAsync_NoSync_ReturnsNull()
    {
        // Arrange
        await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
        await using var scope = host.BeginScope();
        var target = scope.GetInstance<IExternalActorSynchronizationRepository>();

        // Act + Assert
        var next = await target.DequeueNextAsync();

        // Assert
        Assert.Null(next);
    }

    [Fact]
    public async Task DequeueNextAsync_OneSync_IsReturned()
    {
        // Arrange
        await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
        await using var scope = host.BeginScope();
        var target = scope.GetInstance<IExternalActorSynchronizationRepository>();

        var organizationId = new OrganizationId(Guid.NewGuid());
        var actorId = Guid.NewGuid();

        await target.ScheduleAsync(organizationId, actorId);

        // Act + Assert
        var next = await target.DequeueNextAsync();

        // Assert
        Assert.NotNull(next);
        Assert.Equal(organizationId, next.Value.OrganizationId);
        Assert.Equal(actorId, next.Value.ActorId);
    }

    [Fact]
    public async Task DequeueNextAsync_TillEmpty_ReturnsNull()
    {
        // Arrange
        await using var host = await OrganizationIntegrationTestHost.InitializeAsync(_fixture);
        await using var scope = host.BeginScope();
        var target = scope.GetInstance<IExternalActorSynchronizationRepository>();

        var organizationId = new OrganizationId(Guid.NewGuid());
        var actorId = Guid.NewGuid();

        await target.ScheduleAsync(organizationId, actorId);
        await target.ScheduleAsync(organizationId, actorId);
        await target.ScheduleAsync(organizationId, actorId);

        // Act + Assert
        var next1 = await target.DequeueNextAsync();
        var next2 = await target.DequeueNextAsync();
        var next3 = await target.DequeueNextAsync();
        var next4 = await target.DequeueNextAsync();

        // Assert
        Assert.NotNull(next1);
        Assert.NotNull(next2);
        Assert.NotNull(next3);
        Assert.Null(next4);
    }
}
