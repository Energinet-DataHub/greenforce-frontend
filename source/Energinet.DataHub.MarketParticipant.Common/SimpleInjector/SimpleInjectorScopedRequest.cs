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

using System;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using SimpleInjector;
using SimpleInjector.Lifestyles;

namespace Energinet.DataHub.MarketParticipant.Common.SimpleInjector
{
    public sealed class SimpleInjectorScopedRequest : IFunctionsWorkerMiddleware
    {
        private readonly Container _container;

        public SimpleInjectorScopedRequest(Container container)
        {
            _container = container;
        }

        public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
        {
            ArgumentNullException.ThrowIfNull(context, nameof(context));
            ArgumentNullException.ThrowIfNull(next, nameof(next));

            var scope = AsyncScopedLifestyle.BeginScope(_container);

            await using (scope.ConfigureAwait(false))
            {
                context.InstanceServices = new SimpleInjectorServiceProviderAdapter(scope.Container!);
                await next(context).ConfigureAwait(false);
            }
        }
    }
}
