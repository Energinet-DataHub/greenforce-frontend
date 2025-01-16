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
using Energinet.DataHub.WebApi.Modules.ProcessManager.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Orchestrations.Types;
using Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Client;
using Energinet.DataHub.WebApi.Registration;
using HotChocolate.Execution.Configuration;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager;

public static class ProcessManagerModule
{
    // TODO: This can be automated:
    // https://timdeschryver.dev/blog/maybe-its-time-to-rethink-our-project-structure-with-dot-net-6#a-domain-driven-api?
    public static IRequestExecutorBuilder AddProcessManagerTypes(this IRequestExecutorBuilder builder) =>
        builder.AddType<OrchestrationInstanceType<IInputParameterDto>>();

    public static IServiceCollection AddProcessManagerClients(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        // Client and adapters
        services.AddProcessManagerHttpClients();
        services.AddScoped<ICalculationsClient, CalculationsClient>();
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
