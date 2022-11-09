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

using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Application.Commands.Organization;
using Energinet.DataHub.MarketParticipant.IntegrationTests.Fixtures;
using FluentValidation;
using MediatR;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.IntegrationTests.Hosts.WebApi;

[Collection("IntegrationTest")]
[IntegrationTest]
public sealed class CreateOrganizationIntegrationTests
{
    private readonly MarketParticipantDatabaseFixture _fixture;

    public CreateOrganizationIntegrationTests(MarketParticipantDatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task CreateOrganization_InvalidCommand_ThrowsException()
    {
        // Arrange
        const string blankValue = "  ";

        await using var host = await WebApiIntegrationTestHost.InitializeAsync(_fixture);
        await using var scope = host.BeginScope();
        var mediator = scope.GetInstance<IMediator>();

        var organizationDto = new CreateOrganizationDto(
            blankValue,
            blankValue,
            new AddressDto(null, null, null, null, "DK"),
            blankValue);

        var command = new CreateOrganizationCommand(organizationDto);

        // Act + Assert
        await Assert.ThrowsAsync<ValidationException>(() => mediator.Send(command));
    }
}
