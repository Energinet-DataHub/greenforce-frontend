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

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi
{
    /// <summary>
    /// Startup class used by the <seealso cref="SwaggerHostFactory"/> to ensure that no health endpoint is defined.
    /// In the parent Startup class, configuration is used to setup health endpoints, but no configuration is available
    /// when the Swashbuckle CLI tool is executed.
    /// </summary>
    public class SwaggerStartup : Startup
    {
        public SwaggerStartup(IConfiguration configuration, IWebHostEnvironment environment)
            : base(configuration, environment)
        {
        }

        protected override void SetupHealthEndpoints(IServiceCollection services, ApiClientSettings apiClientSettings)
        {
        }
    }
}
