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

using Energinet.DataHub.Charges.Client.Extensions.DependencyInjection;
using Energinet.DataHub.Measurements.Client.Extensions.DependencyInjection;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.Charges.Client;
using Energinet.DataHub.WebApi.Modules.Common.Utilities;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Client;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Models;
using HotChocolate.Execution.Configuration;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public class ElectricityMarketModule : IModule
{
    public IServiceCollection RegisterModule(
        IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddMeasurementsClient();
        services.AddChargesClient();

        services.AddClient<IElectricityMarketClient_V1>(baseUrls => baseUrls.ElectricityMarketBaseUrl, (baseUrl, client) => new ElectricityMarketClient_V1(baseUrl, client));
        services.AddScoped<IChargeLinkClient, ChargeLinkClient>();
        services.AddScoped<IChargesClient, ChargesClient>();

        return services;
    }

    public IRequestExecutorBuilder AddGraphQLConfiguration(IRequestExecutorBuilder builder) =>
        builder
            .BindRuntimeType<ChargeLinkId, StringType>()
            .AddTypeConverter<ChargeLinkId, string>(JsonBase64Converter.Serialize)
            .AddTypeConverter<string, ChargeLinkId>(JsonBase64Converter.Deserialize<ChargeLinkId>);
}
