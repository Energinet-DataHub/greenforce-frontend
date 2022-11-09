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

using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Common.SimpleInjector;
using Microsoft.Extensions.Hosting;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.Organization
{
    public static class Program
    {
        public static async Task Main()
        {
#pragma warning disable CA2000 // Dispose objects before losing scope
            var startup = new Startup();
#pragma warning restore CA2000 // Dispose objects before losing scope

            await using (startup.ConfigureAwait(false))
            {
                var host = new HostBuilder()
                    .ConfigureFunctionsWorkerDefaults(options => options.UseMiddleware<SimpleInjectorScopedRequest>())
                    .ConfigureServices((context, services) => startup.Initialize(context.Configuration, services))
                    .Build()
                    .UseSimpleInjector(startup.Container);

                await host.RunAsync().ConfigureAwait(false);
            }
        }
    }
}
