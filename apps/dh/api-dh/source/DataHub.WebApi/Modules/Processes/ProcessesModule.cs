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

using Energinet.DataHub.Core.App.Common.Extensions.Builder;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.ProcessManager.Client.Extensions.DependencyInjection;
using Energinet.DataHub.ProcessManager.Client.Extensions.Options;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Types;
using Energinet.DataHub.WebApi.Registration;
using HotChocolate.Execution.Configuration;

namespace Energinet.DataHub.WebApi.Modules.Processes;

public class ProcessesModule : IModule
{
    public IRequestExecutorBuilder AddGraphQLConfiguration(IRequestExecutorBuilder builder) =>
        builder.AddType<OrchestrationInstanceType<IInputParameterDto>>();

    public IServiceCollection RegisterModule(
        IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        // Client and adapters
        services.AddProcessManagerHttpClients();

        // HACK: This is a hack to enable settlement report workaround. Remove with "UseProcessManager" flag.
        services.AddSingleton(configuration);

        // Only use the new calculations client if the process manager is enabled, falling back to wholesale client
        var useProcessManager = configuration.IsFeatureEnabled(nameof(FeatureFlags.Names.UseProcessManager));
        if (useProcessManager)
        {
            services.AddScoped<ICalculationsClient, CalculationsClient>();
        }
        else
        {
            services.AddScoped<ICalculationsClient, WholesaleClientAdapter>();
        }

        services.AddScoped<IRequestsClient, RequestsClient>();

        // Health Checks
        var processManagerClientOptions = configuration
            .GetSection(ProcessManagerHttpClientsOptions.SectionName)
            .Get<ProcessManagerHttpClientsOptions>();

        // Until we remove the feature flag "UseProcessManager" we allow skipping the configuration of the Process Manager
        if (processManagerClientOptions != null)
        {
            services.AddHealthChecks()
                .AddServiceHealthCheck(
                    "ProcessManager General endpoints",
                    HealthEndpointRegistrationExtensions.CreateHealthEndpointUri(
                        processManagerClientOptions.GeneralApiBaseAddress,
                        isAzureFunction: true))
                .AddServiceHealthCheck(
                    "ProcessManager Orchestrations endpoints",
                    HealthEndpointRegistrationExtensions.CreateHealthEndpointUri(
                        processManagerClientOptions.OrchestrationsApiBaseAddress,
                        isAzureFunction: true));
        }

        return services;
    }
}
