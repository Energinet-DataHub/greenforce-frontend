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
using Microsoft.Extensions.Hosting;

namespace Energinet.DataHub.WebApi
{
    /// <summary>
    /// Swashbuckle CLI tool call this factory to setup the host used when generating the Swagger configuration.
    /// See documentation: https://github.com/domaindrivendev/Swashbuckle.AspNetCore#use-the-cli-tool-with-a-custom-host-configuration
    /// </summary>
    public class SwaggerHostFactory
    {
        public static IHost CreateHost()
        {
            return CreateHostBuilder(new string[0]).Build();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<SwaggerStartup>();
        });
    }
}
