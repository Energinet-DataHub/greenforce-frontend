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
using Energinet.DataHub.ProcessManager.Client.Extensions.DependencyInjection;
using Energinet.DataHub.ProcessManager.Client.Extensions.Options;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Modules.Processes.Calculations.Client;
using Energinet.DataHub.WebApi.Modules.Processes.Requests.Client;
using Energinet.DataHub.WebApi.Registration;

namespace Energinet.DataHub.WebApi.Modules.Processes;

public class ProcessManagerModule : IModule
{
    public IServiceCollection RegisterModule(
        IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        // Client and adapters
        services.AddProcessManagerHttpClients();
        services.AddScoped<ICalculationsClient, CalculationsClient>();
        services.AddScoped<IRequestsClient, RequestsClient>();

        var processManagerClientOptions = configuration
            .GetRequiredSection(ProcessManagerHttpClientsOptions.SectionName)
            .Get<ProcessManagerHttpClientsOptions>();

        ArgumentNullException.ThrowIfNull(processManagerClientOptions);

        // Health Checks
        services
            .AddHealthChecks()
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

        return services;
    }
}
