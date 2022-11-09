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
using System.Net;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Flurl.Http;
using Flurl.Http.Configuration;
using Flurl.Http.Testing;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Libraries.Tests.Clients
{
    [UnitTest]
    public sealed class MarketParticipantClientTests
    {
        private readonly AddressDto _validAddress = new(
            "Testvej",
            "2",
            "4321",
            "Testby",
            "Testland");

        private readonly string _validBusinessRegisterIdentifier = "87654321";

        [Theory]
        [InlineData(HttpStatusCode.Forbidden)]
        [InlineData(HttpStatusCode.Unauthorized)]
        public async Task GetOrganizationsAsync_Unauthorized_ThrowsException(HttpStatusCode code)
        {
            // Arrange
            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith("unauthorized", (int)code);

            // Act + Assert
            var exception = await Assert
                .ThrowsAsync<MarketParticipantException>(() => target.GetOrganizationsAsync())
                .ConfigureAwait(false);
            Assert.Equal((int)code, exception.StatusCode);
        }

        [Fact]
        public async Task GetOrganizationsAsync_All_ReturnsOrganization()
        {
            // Arrange
            const string incomingJson = @"
[
        {
            ""OrganizationId"": ""fb6665a1-b7be-4744-a8ce-08da0272c916"",
            ""Name"": ""unit test"",
            ""Actors"": [
                {
                    ""ActorId"": ""8a46b5ac-4c7d-48c0-3f16-08da0279759b"",
                    ""ExternalActorId"": ""75ea715f-381e-46fd-831b-5b61b9db7862"",
                    ""ActorNumber"": {
                        ""Value"": ""9656626091925""
                    },
                    ""Status"": ""Active"",
                    ""MarketRoles"": [
                        {
                            ""EicFunction"": ""Consumer"",
                            ""GridAreas"": [
                                {
                                    ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                    ""MeteringPointTypes"": [
                                        ""D01VeProduction""
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            ""BusinessRegisterIdentifier"": ""87654321"",
            ""address"": {
                ""streetName"": ""Testvej"",
                ""number"": ""2"",
                ""zipCode"": ""4321"",
                ""city"": ""Testby"",
                ""country"": ""Testland""
            },
            ""comment"": ""Test Comment""
        }
    ]}";
            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetOrganizationsAsync().ConfigureAwait(false);

            // Assert
            var actualOrganization = actual.Single();
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), actualOrganization.OrganizationId);
            Assert.Equal("unit test", actualOrganization.Name);

            var actualActor = actualOrganization.Actors.Single();
            Assert.Equal(Guid.Parse("8a46b5ac-4c7d-48c0-3f16-08da0279759b"), actualActor.ActorId);
            Assert.Equal(Guid.Parse("75ea715f-381e-46fd-831b-5b61b9db7862"), actualActor.ExternalActorId);
            Assert.Equal("9656626091925", actualActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, actualActor.Status);
            Assert.Equal(_validBusinessRegisterIdentifier, actualOrganization.BusinessRegisterIdentifier);
            Assert.Equal(_validAddress.City, actualOrganization.Address.City);
            Assert.Equal(_validAddress.Country, actualOrganization.Address.Country);
            Assert.Equal(_validAddress.Number, actualOrganization.Address.Number);
            Assert.Equal(_validAddress.StreetName, actualOrganization.Address.StreetName);
            Assert.Equal(_validAddress.ZipCode, actualOrganization.Address.ZipCode);
            Assert.Equal("Test Comment", actualOrganization.Comment);

            var actualMarketRole = actualActor.MarketRoles.Single();
            Assert.Equal(EicFunction.Consumer, actualMarketRole.EicFunction);
        }

        [Fact]
        public async Task GetOrganizationsAsync_All_Returns2Organizations()
        {
            // Arrange
            const string incomingJson = @"
                [
                    {
                        ""OrganizationId"": ""fb6665a1-b7be-4744-a8ce-08da0272c916"",
                        ""Name"": ""unit test"",
                        ""Actors"": [
                            {
                                ""ActorId"": ""8a46b5ac-4c7d-48c0-3f16-08da0279759b"",
                                ""ExternalActorId"": ""75ea715f-381e-46fd-831b-5b61b9db7862"",
                                ""ActorNumber"": {
                                    ""Value"": ""9656626091925""
                                },
                                ""Status"": ""Active"",
                                ""MarketRoles"": [
                                    {
                                        ""EicFunction"": ""Consumer"",
                                        ""GridAreas"": [
                                            {
                                                ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                                ""MeteringPointTypes"": [
                                                    ""D01VeProduction""
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        ""BusinessRegisterIdentifier"": ""87654321"",
                        ""address"": {
                            ""streetName"": ""Testvej"",
                            ""number"": ""2"",
                            ""zipCode"": ""4321"",
                            ""city"": ""Testby"",
                            ""country"": ""Testland""
                        },
                        ""comment"": ""Test Comment""
                    },
                    {
                        ""OrganizationId"": ""c4d950f7-0acf-439b-9bb6-610255218c6e"",
                        ""Name"": ""unit test 2"",
                        ""Actors"": [
                            {
                                ""ActorId"": ""f6792b0b-7dee-4e70-b9d9-46b727e6748b"",
                                ""ExternalActorId"": ""dfef92e2-923e-43aa-8706-ac7445cddfb3"",
                                ""ActorNumber"": {
                                    ""Value"": ""8574664796620""
                                },
                                ""Status"": ""New"",
                                ""MarketRoles"": [
                                    {
                                        ""EicFunction"": ""Producer"",
                                        ""GridAreas"": [
                                            {
                                                ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                                ""MeteringPointTypes"": [
                                                    ""D01VeProduction""
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        ""BusinessRegisterIdentifier"": ""87654321"",
                        ""address"": {
                            ""streetName"": ""Testvej"",
                            ""number"": ""2"",
                            ""zipCode"": ""4321"",
                            ""city"": ""Testby"",
                            ""country"": ""Testland""
                        },
                        ""comment"": ""Test Comment 2""
                    }
                ]";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetOrganizationsAsync().ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
            actual = actual.ToList();
            Assert.Equal(2, actual.Count());
            var firstOrganization = actual.First();
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), firstOrganization.OrganizationId);
            Assert.Equal("unit test", firstOrganization.Name);
            Assert.Equal(_validBusinessRegisterIdentifier, firstOrganization.BusinessRegisterIdentifier);
            Assert.Equal(_validAddress.City, firstOrganization.Address.City);
            Assert.Equal(_validAddress.Country, firstOrganization.Address.Country);
            Assert.Equal(_validAddress.Number, firstOrganization.Address.Number);
            Assert.Equal(_validAddress.StreetName, firstOrganization.Address.StreetName);
            Assert.Equal(_validAddress.ZipCode, firstOrganization.Address.ZipCode);
            Assert.Equal("Test Comment", firstOrganization.Comment);

            var firstActor = firstOrganization.Actors.Single();
            Assert.Equal(Guid.Parse("8a46b5ac-4c7d-48c0-3f16-08da0279759b"), firstActor.ActorId);
            Assert.Equal(Guid.Parse("75ea715f-381e-46fd-831b-5b61b9db7862"), firstActor.ExternalActorId);
            Assert.Equal("9656626091925", firstActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, firstActor.Status);

            var firstMarketRole = firstActor.MarketRoles.Single();
            Assert.Equal(EicFunction.Consumer, firstMarketRole.EicFunction);

            var secondOrganization = actual.Skip(1).First();
            Assert.Equal(Guid.Parse("c4d950f7-0acf-439b-9bb6-610255218c6e"), secondOrganization.OrganizationId);
            Assert.Equal("unit test 2", secondOrganization.Name);
            Assert.Equal(_validBusinessRegisterIdentifier, secondOrganization.BusinessRegisterIdentifier);
            Assert.Equal(_validAddress.City, secondOrganization.Address.City);
            Assert.Equal(_validAddress.Country, secondOrganization.Address.Country);
            Assert.Equal(_validAddress.Number, secondOrganization.Address.Number);
            Assert.Equal(_validAddress.StreetName, secondOrganization.Address.StreetName);
            Assert.Equal(_validAddress.ZipCode, secondOrganization.Address.ZipCode);
            Assert.Equal("Test Comment 2", secondOrganization.Comment);

            var secondActor = secondOrganization.Actors.Single();
            Assert.Equal(Guid.Parse("f6792b0b-7dee-4e70-b9d9-46b727e6748b"), secondActor.ActorId);
            Assert.Equal(Guid.Parse("dfef92e2-923e-43aa-8706-ac7445cddfb3"), secondActor.ExternalActorId);
            Assert.Equal("8574664796620", secondActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.New, secondActor.Status);

            var secondMarketRole = secondActor.MarketRoles.Single();
            Assert.Equal(EicFunction.Producer, secondMarketRole.EicFunction);
        }

        [Fact]
        public async Task GetOrganizationAsync_ReturnsOrganization()
        {
            // Arrange
            const string incomingJson = @"
                {
	                ""OrganizationId"": ""fb6665a1-b7be-4744-a8ce-08da0272c916"",
	                ""Name"": ""unit test"",
	                ""Actors"": [
		                {
			                ""ActorId"": ""8a46b5ac-4c7d-48c0-3f16-08da0279759b"",
			                ""ExternalActorId"": ""75ea715f-381e-46fd-831b-5b61b9db7862"",
			                ""ActorNumber"": {
				                ""Value"": ""9656626091925""
			                },
			                ""Status"": ""Active"",
                            ""MarketRoles"": [
                                {
                                    ""EicFunction"": ""Consumer"",
                                    ""GridAreas"": [
                                        {
                                            ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                            ""MeteringPointTypes"": [
                                                ""D01VeProduction""
                                            ]
                                        }
                                    ]
                                }
                            ]
		                }
                    ],
                    ""BusinessRegisterIdentifier"": ""87654321"",
                    ""address"": {
                        ""streetName"": ""Testvej"",
                        ""number"": ""2"",
                        ""zipCode"": ""4321"",
                        ""city"": ""Testby"",
                        ""country"": ""Testland""
                    },
                    ""comment"": ""Test Comment""
                }";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetOrganizationAsync(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916")).ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), actual.OrganizationId);
            Assert.Equal("unit test", actual.Name);
            Assert.Equal(_validBusinessRegisterIdentifier, actual.BusinessRegisterIdentifier);
            Assert.Equal(_validAddress.City, actual.Address.City);
            Assert.Equal(_validAddress.Country, actual.Address.Country);
            Assert.Equal(_validAddress.Number, actual.Address.Number);
            Assert.Equal(_validAddress.StreetName, actual.Address.StreetName);
            Assert.Equal(_validAddress.ZipCode, actual.Address.ZipCode);
            Assert.Equal("Test Comment", actual.Comment);

            var actualActor = actual.Actors.Single();
            Assert.Equal(Guid.Parse("8a46b5ac-4c7d-48c0-3f16-08da0279759b"), actualActor.ActorId);
            Assert.Equal(Guid.Parse("75ea715f-381e-46fd-831b-5b61b9db7862"), actualActor.ExternalActorId);
            Assert.Equal("9656626091925", actualActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, actualActor.Status);

            var actualMarketRole = actualActor.MarketRoles.Single();
            Assert.Equal(EicFunction.Consumer, actualMarketRole.EicFunction);
        }

        [Fact]
        public async Task CreateOrganizationAsync_ReturnsOrganizationId_CanReadBack()
        {
            // Arrange
            const string incomingOrgJson = @"
                {
	                ""OrganizationId"": ""fb6665a1-b7be-4744-a8ce-08da0272c916"",
	                ""Name"": ""unit test"",
	                ""Actors"": [
		                {
			                ""ActorId"": ""8a46b5ac-4c7d-48c0-3f16-08da0279759b"",
			                ""ExternalActorId"": ""75ea715f-381e-46fd-831b-5b61b9db7862"",
			                ""ActorNumber"": {
				                ""Value"": ""9656626091925""
			                },
			                ""Status"": ""Active"",
                            ""MarketRoles"": [
                                {
                                    ""EicFunction"": ""Consumer"",
                                    ""GridAreas"": [
                                        {
                                            ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                            ""MeteringPointTypes"": [
                                                ""D01VeProduction""
                                            ]
                                        }
                                    ]
                                }
                            ]
		                }
                    ],
                    ""BusinessRegisterIdentifier"": ""87654321"",
                    ""address"": {
                        ""streetName"": ""Testvej"",
                        ""number"": ""2"",
                        ""zipCode"": ""4321"",
                        ""city"": ""Testby"",
                        ""country"": ""Testland""
                    },
                    ""comment"": ""Test Comment""
                }";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith("fb6665a1-b7be-4744-a8ce-08da0272c916");
            httpTest.RespondWith(incomingOrgJson);

            // Act
            var orgId = await target
                .CreateOrganizationAsync(new CreateOrganizationDto("Created", _validBusinessRegisterIdentifier, _validAddress, "Test Comment"))
                .ConfigureAwait(false);

            var createdOrg = await target
                .GetOrganizationAsync(orgId)
                .ConfigureAwait(false);

            // Assert
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), orgId);
            Assert.NotNull(createdOrg);
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), createdOrg.OrganizationId);
            Assert.Equal("unit test", createdOrg.Name);
            Assert.Equal(_validBusinessRegisterIdentifier, createdOrg.BusinessRegisterIdentifier);
            Assert.Equal(_validAddress.City, createdOrg.Address.City);
            Assert.Equal(_validAddress.Country, createdOrg.Address.Country);
            Assert.Equal(_validAddress.Number, createdOrg.Address.Number);
            Assert.Equal(_validAddress.StreetName, createdOrg.Address.StreetName);
            Assert.Equal(_validAddress.ZipCode, createdOrg.Address.ZipCode);
            Assert.Equal("Test Comment", createdOrg.Comment);

            var actualActor = createdOrg.Actors.Single();
            Assert.Equal(Guid.Parse("8a46b5ac-4c7d-48c0-3f16-08da0279759b"), actualActor.ActorId);
            Assert.Equal(Guid.Parse("75ea715f-381e-46fd-831b-5b61b9db7862"), actualActor.ExternalActorId);
            Assert.Equal("9656626091925", actualActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, actualActor.Status);

            var actualMarketRole = actualActor.MarketRoles.Single();
            Assert.Equal(EicFunction.Consumer, actualMarketRole.EicFunction);
        }

        [Fact]
        public async Task UpdateOrganizationAsync_CanReadBack()
        {
            // Arrange
            const string incomingOrgJson = @"
                {
	                ""OrganizationId"": ""fb6665a1-b7be-4744-a8ce-08da0272c916"",
	                ""Name"": ""unit test 2"",
	                ""Actors"": [
		                {
			                ""ActorId"": ""8a46b5ac-4c7d-48c0-3f16-08da0279759b"",
			                ""ExternalActorId"": ""75ea715f-381e-46fd-831b-5b61b9db7862"",
			                ""ActorNumber"": {
				                ""Value"": ""9656626091925""
			                },
			                ""Status"": ""Active"",
                            ""MarketRoles"": [
                                {
                                    ""EicFunction"": ""Consumer"",
                                    ""GridAreas"": [
                                        {
                                            ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                            ""MeteringPointTypes"": [
                                                ""D01VeProduction""
                                            ]
                                        }
                                    ]
                                }
                            ]
		                }
                    ],
                    ""BusinessRegisterIdentifier"": ""87654321"",
                    ""address"": {
                        ""streetName"": ""Testvej"",
                        ""number"": ""2"",
                        ""zipCode"": ""1234"",
                        ""city"": ""Testby"",
                        ""country"": ""Testland""
                    },
                    ""comment"": ""Test Comment 2"",
                    ""status"": ""Active""
                }";
            var orgId = Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916");
            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(string.Empty);
            httpTest.RespondWith(incomingOrgJson);

            var changedAddress = _validAddress with { ZipCode = "1234" };

            // Act
            await target
                .UpdateOrganizationAsync(orgId, new ChangeOrganizationDto("unit test 2", _validBusinessRegisterIdentifier, changedAddress, "Test Comment 2", OrganizationStatus.Active))
                .ConfigureAwait(false);

            var changedOrg = await target
                .GetOrganizationAsync(orgId)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(changedOrg);
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), changedOrg.OrganizationId);
            Assert.Equal("unit test 2", changedOrg.Name);
            Assert.Equal(_validBusinessRegisterIdentifier, changedOrg.BusinessRegisterIdentifier);
            Assert.Equal(_validAddress.City, changedOrg.Address.City);
            Assert.Equal(_validAddress.Country, changedOrg.Address.Country);
            Assert.Equal(_validAddress.Number, changedOrg.Address.Number);
            Assert.Equal(_validAddress.StreetName, changedOrg.Address.StreetName);
            Assert.Equal(changedAddress.ZipCode, changedOrg.Address.ZipCode);
            Assert.Equal("Test Comment 2", changedOrg.Comment);
            Assert.Equal(OrganizationStatus.Active, changedOrg.Status);

            var actualActor = changedOrg.Actors.Single();
            Assert.Equal(Guid.Parse("8a46b5ac-4c7d-48c0-3f16-08da0279759b"), actualActor.ActorId);
            Assert.Equal(Guid.Parse("75ea715f-381e-46fd-831b-5b61b9db7862"), actualActor.ExternalActorId);
            Assert.Equal("9656626091925", actualActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, actualActor.Status);

            var actualMarketRole = actualActor.MarketRoles.Single();
            Assert.Equal(EicFunction.Consumer, actualMarketRole.EicFunction);
        }

        [Fact]
        public async Task GetActorAsync_ReturnsActor()
        {
            // Arrange
            const string incomingJson = @"
                {
                    ""actorId"": ""361fb10a-4204-46b6-bf9e-171ab2e61a59"",
                    ""externalActorId"": ""c7e6c6d1-a23a-464b-bebd-c1a9c5ceebe1"",
                    ""actorNumber"": {
                        ""value"": ""123456""
                    },
                    ""name"": {
                        ""value"": ""ActorName""
                    },
                    ""status"": ""New"",
                    ""marketRoles"": []
                }";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetActorAsync(
                Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"),
                Guid.Parse("361fb10a-4204-46b6-bf9e-171ab2e61a59"))
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
            Assert.Equal(Guid.Parse("361fb10a-4204-46b6-bf9e-171ab2e61a59"), actual.ActorId);
            Assert.Equal(Guid.Parse("c7e6c6d1-a23a-464b-bebd-c1a9c5ceebe1"), actual.ExternalActorId);
            Assert.Equal("123456", actual.ActorNumber.Value);
            Assert.Equal(ActorStatus.New, actual.Status);
            Assert.Equal("ActorName", actual.Name.Value);
            Assert.True(actual.MarketRoles.Count == 0);
        }

        [Fact]
        public async Task GetActorsAsync_ReturnsActors()
        {
            // Arrange
            const string incomingJson = @"
                [
                    {
                        ""actorId"": ""a03774de-e867-47a4-317d-08da0cc07910"",
                        ""externalActorId"": ""41df62f6-67dc-42de-9ab3-dfeb7d7a7aab"",
                        ""actorNumber"": {
                          ""value"": ""5790000555550""
                        },
                        ""name"": {
                          ""value"": ""name1""
                        },
                        ""status"": ""New"",
                        ""MarketRoles"": [
                            {
                                ""EicFunction"": ""MarketOperator"",
                                ""GridAreas"": [
                                    {
                                        ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                        ""MeteringPointTypes"": [
                                            ""D01VeProduction""
                                        ]
                                    }
                                ]
                            }
                        ]
                      },
                    {
                        ""actorId"": ""02f0d6c9-96f5-4078-a754-fcc589b04937"",
                        ""externalActorId"": ""5a20e113-4d17-44ec-8014-4d032b700a73"",
                        ""actorNumber"": {
                          ""value"": ""5790000701414""
                        },
                        ""name"": {
                          ""value"": ""name2""
                        },
                        ""status"": ""Active"",
                        ""MarketRoles"": [
                            {
                                ""EicFunction"": ""EnergySupplier"",
                                ""GridAreas"": [
                                    {
                                        ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                        ""MeteringPointTypes"": [
                                            ""D01VeProduction""
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetActorsAsync(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"))
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
            actual = actual.ToList();
            Assert.Equal(2, actual.Count());

            var firstActor = actual.First();
            Assert.Equal(Guid.Parse("a03774de-e867-47a4-317d-08da0cc07910"), firstActor.ActorId);
            Assert.Equal(Guid.Parse("41df62f6-67dc-42de-9ab3-dfeb7d7a7aab"), firstActor.ExternalActorId);
            Assert.Equal("5790000555550", firstActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.New, firstActor.Status);
            Assert.Equal("name1", firstActor.Name.Value);
            Assert.True(firstActor.MarketRoles.Count == 1);

            var firstMarketRole = firstActor.MarketRoles[0];
            Assert.Equal(EicFunction.MarketOperator, firstMarketRole.EicFunction);

            var secondActor = actual.Skip(1).First();
            Assert.Equal(Guid.Parse("02f0d6c9-96f5-4078-a754-fcc589b04937"), secondActor.ActorId);
            Assert.Equal(Guid.Parse("5a20e113-4d17-44ec-8014-4d032b700a73"), secondActor.ExternalActorId);
            Assert.Equal("5790000701414", secondActor.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, secondActor.Status);
            Assert.Equal("name2", secondActor.Name.Value);
            Assert.True(secondActor.MarketRoles.Count == 1);

            var secondMarketRole = secondActor.MarketRoles[0];
            Assert.Equal(EicFunction.EnergySupplier, secondMarketRole.EicFunction);
        }

        [Fact]
        public async Task CreateActorAsync_CanReadBackActor()
        {
            // Arrange
            const string createdActorJson = @"
                {
                    ""actorId"": ""361fb10a-4204-46b6-bf9e-171ab2e61a59"",
                    ""externalActorId"": ""c7e6c6d1-a23a-464b-bebd-c1a9c5ceebe1"",
                    ""actorNumber"": {
                        ""value"": ""123456""
                    },
                    ""name"": {
                        ""value"": ""ActorName""
                    },
                    ""status"": ""New"",
                    ""MarketRoles"": [
                        {
                            ""EicFunction"": ""EnergySupplier"",
                            ""GridAreas"": [
                                {
                                    ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                    ""MeteringPointTypes"": [
                                        ""D01VeProduction""
                                    ]
                                }
                            ]
                        }
                    ]
                }";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            var orgId = Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916");
            httpTest.RespondWith("361fb10a-4204-46b6-bf9e-171ab2e61a59");
            httpTest.RespondWith(createdActorJson);

            // Act
            var createdActorId = await target.CreateActorAsync(
                    orgId,
                    new CreateActorDto(
                        new ActorNumberDto("123456"),
                        new ActorNameDto("ActorName"),
                        Array.Empty<ActorMarketRoleDto>()))
                .ConfigureAwait(false);

            var actual = await target
                .GetActorAsync(orgId, createdActorId)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
            Assert.Equal(Guid.Parse("361fb10a-4204-46b6-bf9e-171ab2e61a59"), actual.ActorId);
            Assert.Equal(Guid.Parse("c7e6c6d1-a23a-464b-bebd-c1a9c5ceebe1"), actual.ExternalActorId);
            Assert.Equal("123456", actual.ActorNumber.Value);
            Assert.Equal(ActorStatus.New, actual.Status);
            Assert.Equal("ActorName", actual.Name.Value);
            Assert.True(actual.MarketRoles.Count == 1);

            var marketRole = actual.MarketRoles[0];
            Assert.Equal(EicFunction.EnergySupplier, marketRole.EicFunction);
        }

        [Fact]
        public async Task UpdateActorAsync_CanReadBackActor()
        {
            // Arrange
            const string createdActorJson = @"
                {
                    ""actorId"": ""361fb10a-4204-46b6-bf9e-171ab2e61a59"",
                    ""externalActorId"": ""c7e6c6d1-a23a-464b-bebd-c1a9c5ceebe1"",
                    ""actorNumber"": {
                        ""value"": ""1234567""
                    },
                    ""name"": {
                        ""value"": """"
                    },
                    ""status"": ""Active"",
                    ""MarketRoles"": [
                        {
                            ""EicFunction"": ""BillingAgent"",
                            ""GridAreas"": [
                                {
                                    ""Id"": ""1436B548-927B-4B3E-98BC-152FB8F48A88"",
                                    ""MeteringPointTypes"": [
                                        ""D01VeProduction""
                                    ]
                                }
                            ]
                        }
                    ]
                }";

            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            var orgId = Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916");
            var actorId = Guid.Parse("361fb10a-4204-46b6-bf9e-171ab2e61a59");
            httpTest.RespondWith(createdActorJson);

            // Act
            await target.UpdateActorAsync(
                    orgId,
                    actorId,
                    new ChangeActorDto(
                        ActorStatus.Active,
                        new ActorNameDto("ActorName"),
                        new[] { new ActorMarketRoleDto(EicFunction.EnergySupplier, Enumerable.Empty<ActorGridAreaDto>(), string.Empty) }))
                .ConfigureAwait(false);

            var actual = await target
                .GetActorAsync(orgId, actorId)
                .ConfigureAwait(false);

            // Assert
            Assert.NotNull(actual);
            Assert.Equal(Guid.Parse("361fb10a-4204-46b6-bf9e-171ab2e61a59"), actual.ActorId);
            Assert.Equal(Guid.Parse("c7e6c6d1-a23a-464b-bebd-c1a9c5ceebe1"), actual.ExternalActorId);
            Assert.Equal("1234567", actual.ActorNumber.Value);
            Assert.Equal(ActorStatus.Active, actual.Status);
            Assert.Equal(string.Empty, actual.Name.Value);
            Assert.True(actual.MarketRoles.Count == 1);

            var marketRole = actual.MarketRoles[0];
            Assert.Equal(EicFunction.BillingAgent, marketRole.EicFunction);
        }

        [Fact]
        public async Task GetContactsAsync_All_ReturnsContacts()
        {
            // Arrange
            const string incomingJson = @"
    [
        {
            ""ContactId"": ""fb6665a1-b7be-4744-a8ce-08da0272c916"",
            ""Category"": ""Default"",
            ""Name"": ""unit test"",
            ""Email"": ""unit@test.com"",
            ""Phone"": ""20202030""
        }
    ]}";
            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetContactsAsync(Guid.NewGuid(), Guid.NewGuid()).ConfigureAwait(false);

            // Assert
            var actualContact = actual.Single();
            Assert.Equal(Guid.Parse("fb6665a1-b7be-4744-a8ce-08da0272c916"), actualContact.ContactId);
            Assert.Equal(ContactCategory.Default, actualContact.Category);
            Assert.Equal("unit test", actualContact.Name);
            Assert.Equal("unit@test.com", actualContact.Email);
            Assert.Equal("20202030", actualContact.Phone);
        }

        [Fact]
        public async Task CreateContactAsync_ValidContact_ReturnsId()
        {
            // Arrange
            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            const string expectedContactId = "361fb10a-4204-46b6-bf9e-171ab2e61a59";
            httpTest.RespondWith(expectedContactId);

            // Act
            var contactId = await target.CreateContactAsync(
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    new CreateActorContactDto("unit test", ContactCategory.Charges, "email", "phone"))
                .ConfigureAwait(false);

            // Assert
            Assert.Equal(Guid.Parse(expectedContactId), contactId);
        }

        [Fact]
        public async Task GetGridAreasAsync_All_ReturnsGridAreas()
        {
            // Arrange
            const string incomingJson = @"
    [
        {
            ""Id"": ""2ac38237-9612-4ea5-8cf5-bac3734c10fd"",
            ""Code"": ""Code"",
            ""Name"": ""Name"",
            ""PriceAreaCode"": ""Dk2""
        }
    ]}";
            using var httpTest = new HttpTest();
            using var clientFactory = new PerBaseUrlFlurlClientFactory();
            var target = new MarketParticipantClient(clientFactory.Get("https://localhost"));
            httpTest.RespondWith(incomingJson);

            // Act
            var actual = await target.GetGridAreasAsync().ConfigureAwait(false);

            // Assert
            var actualContact = actual.Single();
            Assert.Equal(Guid.Parse("2ac38237-9612-4ea5-8cf5-bac3734c10fd"), actualContact.Id);
            Assert.Equal("Code", actualContact.Code);
            Assert.Equal("Name", actualContact.Name);
            Assert.Equal(PriceAreaCode.Dk2, actualContact.PriceAreaCode);
        }
    }
}
