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

using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using MediatR;
using MediatR.Pipeline;
using SimpleInjector;

namespace Energinet.DataHub.MarketParticipant.Common.MediatR
{
    internal static class SimpleInjectorMediatorContainerExtensions
    {
        public static void BuildMediator(this Container container, Assembly[] applicationAssemblies)
        {
            var assemblies = GetMediatorAssemblies().Union(applicationAssemblies).ToArray();
            container.RegisterSingleton<IMediator, Mediator>();
            container.Register(typeof(IRequestHandler<,>), assemblies);

            RegisterHandlers(container, typeof(INotificationHandler<>), assemblies);
            RegisterHandlers(container, typeof(IRequestExceptionAction<,>), assemblies);
            RegisterHandlers(container, typeof(IRequestExceptionHandler<,,>), assemblies);

            // Add built-in pipeline behaviors
            var builtInBehaviors = new[]
            {
                typeof(RequestExceptionProcessorBehavior<,>),
                typeof(RequestExceptionActionProcessorBehavior<,>),
                typeof(RequestPreProcessorBehavior<,>),
                typeof(RequestPostProcessorBehavior<,>),
                typeof(ValidationPipelineBehaviour<,>)
            };

            container.Collection.Register(typeof(IPipelineBehavior<,>), builtInBehaviors);
            container.Collection.Register(typeof(IRequestPreProcessor<>), new[] { typeof(EmptyRequestPreProcessor<>) });
            container.Collection.Register(typeof(IRequestPostProcessor<,>), new[] { typeof(EmptyRequestPostProcessor<,>) });

            container.Register(() => new ServiceFactory(container.GetInstance), Lifestyle.Singleton);
        }

        private static void RegisterHandlers(Container container, System.Type collectionType, Assembly[] assemblies)
        {
            // we have to do this because by default, generic type definitions (such as the Constrained Notification Handler) won't be registered
            var handlerTypes = container.GetTypesToRegister(collectionType, assemblies, new TypesToRegisterOptions { IncludeGenericTypeDefinitions = true, IncludeComposites = false });

            container.Collection.Register(collectionType, handlerTypes);
        }

        private static IEnumerable<Assembly> GetMediatorAssemblies()
        {
            yield return typeof(IMediator).GetTypeInfo().Assembly;
        }
    }
}
