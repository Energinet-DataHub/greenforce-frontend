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

using HotChocolate.Execution.Configuration;

namespace Energinet.DataHub.WebApi.Common;

/// <summary>
/// Marks the class as a module that will be automatically registered.
/// </summary>
public interface IModule
{
    /// <summary>
    /// Add configuration to the GraphQL request executor builder.
    /// </summary>
    IRequestExecutorBuilder AddGraphQLConfiguration(
        IRequestExecutorBuilder builder) => builder;

    /// <summary>
    /// Register the module with the service collection.
    /// </summary>
    IServiceCollection RegisterModule(
        IServiceCollection services,
        IConfiguration configuration) => services;
}
