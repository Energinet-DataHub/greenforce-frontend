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
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.ServiceMocks;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public sealed class MarketParticipantControllerTests : ControllerTestsBase
    {
        public MarketParticipantControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, InstallServiceMock(factory), testOutputHelper)
        {
        }

        private const string GetFilterActorsUrl = "v1/MarketParticipant/Organization/GetFilterActors";

        [Theory]
        [InlineAutoMoqData]
        public async Task GetFilterActorsUrl_NotFas_ReturnsSingleActor(OrganizationDto organization, ActorDto actor, Guid actorId)
        {
            // Arrange
            JwtAuthenticationServiceMock.AddAuthorizationHeader(BffClient, actorId);

            MarketParticipantClientMock
                .Setup(client => client.GetOrganizationsAsync())
                .ReturnsAsync(new List<OrganizationDto>
                {
                    organization with { Actors = new[] { actor with { ActorId = actorId }, actor with { ActorId = Guid.NewGuid() } } },
                });

            // Act
            var actual = await BffClient.GetAsync(GetFilterActorsUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await actual.Content.ReadAsAsync<IEnumerable<ActorDto>>();
            result.Should().ContainSingle(returnedActor => returnedActor.ActorId == actorId);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task GetFilterActorsUrl_IsFas_ReturnsAllActors(OrganizationDto organization, ActorDto actor, Guid actorId)
        {
            // Arrange
            JwtAuthenticationServiceMock.AddAuthorizationHeader(BffClient, actorId, new Claim("membership", "fas"));

            var organizations = new List<OrganizationDto>
            {
                organization with { Actors = new[] { actor with { ActorId = actorId }, actor with { ActorId = Guid.NewGuid() } } },
            };

            MarketParticipantClientMock
                .Setup(client => client.GetOrganizationsAsync())
                .ReturnsAsync(organizations);

            // Act
            var actual = await BffClient.GetAsync(GetFilterActorsUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await actual.Content.ReadAsAsync<IEnumerable<ActorDto>>();
            result.Should().BeEquivalentTo(organizations.SelectMany(org => org.Actors));
        }

        private static WebApiFactory InstallServiceMock(WebApiFactory webApiFactory)
        {
            webApiFactory.AddServiceMock(new JwtAuthenticationServiceMock());
            return webApiFactory;
        }
    }
}
