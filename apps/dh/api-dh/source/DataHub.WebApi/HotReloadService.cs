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

using HotChocolate.Execution;

#if DEBUG
[assembly: System.Reflection.Metadata.MetadataUpdateHandlerAttribute(typeof(Energinet.DataHub.WebApi.HotReloadService))]

namespace Energinet.DataHub.WebApi;

public static class HotReloadService
{
    public static IServiceProvider? Services { get; set; }

    internal static void UpdateApplication(Type[]? types)
    {
        var resolver = Services?.GetRequiredService<IRequestExecutorResolver>();
        if (resolver is null)
        {
            Console.WriteLine("Hot Reload Service - Unable to find IRequestExecutorResolver");
            return;
        }

        IDisposable? disposable = null;
        disposable = resolver.Events.Subscribe(e =>
        {
            // Wait for the new executor to be available before generating the schema file
            if (e.Type == RequestExecutorEventType.Created)
            {
                var sdl = e.Executor.Schema.ToString();
                var fileName = System.IO.Path.Combine(Environment.CurrentDirectory, "../../../../../libs/dh/shared/data-access-graphql/schema.graphql");
                File.WriteAllText(fileName, sdl);
                disposable?.Dispose();
            }
        });

        // Force rebuild of RequestExecutor (schema)
        resolver.EvictRequestExecutor();
    }
}
#endif
