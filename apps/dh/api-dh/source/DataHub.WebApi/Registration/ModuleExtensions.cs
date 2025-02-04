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

using Energinet.DataHub.WebApi.Common;
using HotChocolate.Execution.Configuration;

public static class ModuleExtensions
{
    private static readonly List<IModule> RegisteredModules = new List<IModule>();

    public static IServiceCollection RegisterModules(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var modules = DiscoverModules();

        foreach (var module in modules)
        {
            module.RegisterModule(services, configuration);
            RegisteredModules.Add(module);
        }

        return services;
    }

    public static IRequestExecutorBuilder AddModules(this IRequestExecutorBuilder builder)
    {
        foreach (var module in RegisteredModules)
        {
            module.AddGraphQLConfiguration(builder);
        }

        return builder;
    }

    private static IEnumerable<IModule> DiscoverModules()
    {
        return typeof(IModule).Assembly
            .GetTypes()
            .Where(p => p.IsClass && p.IsAssignableTo(typeof(IModule)))
            .Select(Activator.CreateInstance)
            .Cast<IModule>();
    }
}
