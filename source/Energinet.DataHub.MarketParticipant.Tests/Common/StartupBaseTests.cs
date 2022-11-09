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
using System.Net.Http;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Common;
using Energinet.DataHub.MarketParticipant.Common.Configuration;
using Energinet.DataHub.MarketParticipant.Domain;
using Energinet.DataHub.MarketParticipant.Domain.Services;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence;
using Energinet.DataHub.MarketParticipant.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph;
using Moq;
using SimpleInjector;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Common
{
    [UnitTest]
    public sealed class StartupBaseTests
    {
        [Fact]
        public async Task Startup_ConfigureServices_ShouldVerify()
        {
            // Arrange
            var configuration = BuildConfig();
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddSingleton(configuration);
            await using var target = new TestOfStartupBase();

            // Act
            target.Initialize(configuration, serviceCollection);
            await using var serviceProvider = serviceCollection.BuildServiceProvider();
            serviceProvider.UseSimpleInjector(target.Container);

            // Assert
            target.Container.Verify();
        }

        [Fact]
        public async Task Startup_ConfigureServices_ShouldCallConfigureContainer()
        {
            // Arrange
            var configuration = BuildConfig();
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddSingleton(configuration);
            var configureContainerMock = new Mock<Action>();
            await using var target = new TestOfStartupBase
            {
                ConfigureContainer = configureContainerMock.Object
            };

            // Act
            target.Initialize(configuration, serviceCollection);

            // Assert
            configureContainerMock.Verify(x => x(), Times.Once);
        }

        private static IConfiguration BuildConfig()
        {
            KeyValuePair<string, string>[] keyValuePairs =
            {
                new(Settings.ServiceBusTopicConnectionString.Key, "fake_value"),
                new(Settings.ServiceBusTopicName.Key, "fake_value"),
                new(Settings.B2CBackendServicePrincipalNameObjectId.Key, "fake_value"),
                new(Settings.B2CBackendObjectId.Key, "fake_value"),
                new(Settings.B2CBackendId.Key, "fake_value"),
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(keyValuePairs)
                .Build();
        }

        private sealed class TestOfStartupBase : StartupBase
        {
            public Action? ConfigureContainer { get; init; }

            protected override void Configure(IConfiguration configuration, IServiceCollection services)
            {
            }

            protected override void Configure(IConfiguration configuration, Container container)
            {
                AddMockConfiguration(container);
                ConfigureContainer?.Invoke();
            }

            private static void AddMockConfiguration(Container container)
            {
                container.Options.AllowOverridingRegistrations = true;

                container.Register(() => new Mock<IUnitOfWorkProvider>().Object);
                container.Register(() => new Mock<IMarketParticipantDbContext>().Object, Lifestyle.Scoped);
                container.Register(() => new Mock<IUserIdProvider>().Object, Lifestyle.Scoped);
                container.RegisterSingleton(() => new Mock<IMarketParticipantServiceBusClient>().Object);
                container.RegisterSingleton(() => new GraphServiceClient(new HttpClient()));
            }
        }
    }
}
