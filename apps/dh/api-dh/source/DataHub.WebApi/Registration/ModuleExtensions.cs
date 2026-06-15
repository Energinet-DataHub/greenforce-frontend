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

using System.Reflection;
using System.Runtime.ExceptionServices;
using Energinet.DataHub.WebApi.Common;
using HotChocolate.Execution.Configuration;

namespace Energinet.DataHub.WebApi.Registration;

public static class ModuleExtensions
{
    private const BindingFlags RegistrationMethodBindingFlags =
        BindingFlags.Instance |
        BindingFlags.Static |
        BindingFlags.Public |
        BindingFlags.NonPublic;

    public static IServiceCollection RegisterModules(
        this IServiceCollection services,
        IConfiguration configuration)
        => DiscoverMethods<RegisterServicesAttribute>()
            .Where(IsValidServiceRegistrationMethod)
            .Aggregate(services, (current, method)
                => method.GetParameters().Length == 1
                    ? Invoke<IServiceCollection>(method, current)
                    : Invoke<IServiceCollection>(method, current, configuration));

    public static IRequestExecutorBuilder AddModules(this IRequestExecutorBuilder builder)
        => DiscoverMethods<ConfigureGraphQLAttribute>()
            .Where(IsValidGraphQLConfigurationMethod)
            .Aggregate(builder, (current, method) => Invoke<IRequestExecutorBuilder>(method, current));

    private static IEnumerable<MethodInfo> DiscoverMethods<TAttribute>()
        where TAttribute : Attribute
        => typeof(ModuleExtensions).Assembly
            .GetTypes()
            .SelectMany(type => type.GetMethods(RegistrationMethodBindingFlags))
            .Where(method => method.GetCustomAttribute<TAttribute>() is not null)
            .OrderBy(method => method.DeclaringType?.FullName, StringComparer.Ordinal)
            .ThenBy(method => method.Name, StringComparer.Ordinal);

    private static bool IsValidServiceRegistrationMethod(MethodInfo method)
    {
        try
        {
            ValidateStaticMethod(method);
            ValidateReturnType<IServiceCollection>(method);
            if (HasParameterTypes(method, typeof(IServiceCollection))) return true;
            if (HasParameterTypes(method, typeof(IServiceCollection), typeof(IConfiguration))) return true;
            throw new InvalidOperationException(
                $"must have parameters: ({nameof(IServiceCollection)}) or " +
                $"({nameof(IServiceCollection)}, {nameof(IConfiguration)}).");
        }
        catch (InvalidOperationException ex)
        {
            throw new InvalidOperationException(
                $"Method '{GetDisplayName(method)}' has [{typeof(RegisterServicesAttribute).Name}] but {ex.Message}",
                ex);
        }
    }

    private static bool IsValidGraphQLConfigurationMethod(MethodInfo method)
    {
        try
        {
            ValidateStaticMethod(method);
            ValidateReturnType<IRequestExecutorBuilder>(method);
            if (HasParameterTypes(method, typeof(IRequestExecutorBuilder))) return true;
            throw new InvalidOperationException(
                $"must have parameters: ({nameof(IRequestExecutorBuilder)}).");
        }
        catch (InvalidOperationException ex)
        {
            throw new InvalidOperationException(
                $"Method '{GetDisplayName(method)}' has [{typeof(ConfigureGraphQLAttribute).Name}] but {ex.Message}",
                ex);
        }
    }

    private static void ValidateReturnType<TReturn>(MethodInfo method)
    {
        if (!typeof(TReturn).IsAssignableFrom(method.ReturnType))
        {
            throw new InvalidOperationException($"does not return {typeof(TReturn).Name}.");
        }
    }

    private static void ValidateStaticMethod(MethodInfo method)
    {
        if (!method.IsStatic)
        {
            throw new InvalidOperationException("must be static.");
        }

        if (method.ContainsGenericParameters)
        {
            throw new InvalidOperationException("must not be generic.");
        }
    }

    private static bool HasParameterTypes(MethodInfo method, params Type[] expectedParameterTypes)
        => method.GetParameters()
            .Select(parameter => parameter.ParameterType)
            .SequenceEqual(expectedParameterTypes);

    private static string GetDisplayName(MethodInfo method)
        => $"{method.DeclaringType?.FullName}.{method.Name}";

    private static TResult Invoke<TResult>(MethodInfo method, params object[] parameters)
    {
        try
        {
            return method.Invoke(null, parameters) is TResult result
                ? result
                : throw new InvalidOperationException($"Method '{GetDisplayName(method)}' returned null.");
        }
        catch (TargetInvocationException ex) when (ex.InnerException is not null)
        {
            ExceptionDispatchInfo.Capture(ex.InnerException).Throw();
            throw;
        }
    }
}
