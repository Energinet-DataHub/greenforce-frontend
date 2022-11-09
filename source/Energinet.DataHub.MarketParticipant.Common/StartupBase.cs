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
using Energinet.DataHub.MarketParticipant.Application;
using Energinet.DataHub.MarketParticipant.Common.ActiveDirectory;
using Energinet.DataHub.MarketParticipant.Common.MediatR;
using Energinet.DataHub.MarketParticipant.Common.SimpleInjector;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.Common
{
    public abstract class StartupBase : IAsyncDisposable
    {
        protected StartupBase()
        {
            Container = new Container();
        }

        public Container Container { get; }

        public async ValueTask DisposeAsync()
        {
            await DisposeAsyncCore().ConfigureAwait(false);
            GC.SuppressFinalize(this);
        }

        public void Initialize(IConfiguration configuration, IServiceCollection services)
        {
            services.AddDbContexts(Container);
            services.AddLogging();

            Configure(configuration, services);
            ConfigureSimpleInjector(services);

            Container.AddApplicationServices();
            Container.AddDbContextInterfaces();
            Container.AddRepositories();
            Container.AddServiceBus();
            Container.AddServices();
            Container.AddUnitOfWorkProvider();
            Container.AddAzureAdConfiguration();
            Container.AddGraphServiceClient();
            Container.AddActiveDirectoryRoles();

            // Add MediatR
            Container.BuildMediator(new[] { typeof(ApplicationAssemblyReference).Assembly });

            Configure(configuration, Container);
        }

#pragma warning disable VSTHRD200
        protected virtual ValueTask DisposeAsyncCore()
#pragma warning restore VSTHRD200
        {
            return Container.DisposeAsync();
        }

        protected abstract void Configure(IConfiguration configuration, IServiceCollection services);
        protected abstract void Configure(IConfiguration configuration, Container container);

        protected virtual void ConfigureSimpleInjector(IServiceCollection services)
        {
            var descriptor = new ServiceDescriptor(
                typeof(IFunctionActivator),
                typeof(SimpleInjectorActivator),
                ServiceLifetime.Singleton);

            services.Replace(descriptor);
            services.AddSimpleInjector(Container, x =>
            {
                x.DisposeContainerWithServiceProvider = false;
                x.AddLogging();
            });
        }
    }
}
