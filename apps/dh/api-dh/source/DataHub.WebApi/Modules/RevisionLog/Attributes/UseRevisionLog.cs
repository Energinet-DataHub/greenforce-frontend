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
using System.Runtime.CompilerServices;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Middleware;
using HotChocolate.Types.Descriptors;

namespace Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;

public class UseRevisionLogAttribute : ObjectFieldDescriptorAttribute
{
    public UseRevisionLogAttribute([CallerLineNumber] int order = 0)
    {
        Order = order;
    }

    protected override void OnConfigure(
        IDescriptorContext context,
        IObjectFieldDescriptor descriptor,
        MemberInfo member)
    {
        var affectedEntityType = GetAffectedEntityType(member);
        descriptor.Use((_, next) => new RevisionLogMiddleware(next, affectedEntityType));
    }

    private string[] _suffixes = [
        "Node",
        "Operations",
        "Queries",
        "Mutations",
        "Subscriptions",
    ];

    private string GetAffectedEntityType(MemberInfo member)
    {
        var declaringClass = member.DeclaringType?.Name;

        if (declaringClass is null)
        {
            throw new NotSupportedException("Attribute must be used on a member of a class.");
        }

        foreach (var suffix in _suffixes)
        {
            if (declaringClass.EndsWith(suffix, StringComparison.Ordinal))
            {
                return declaringClass.Substring(0, declaringClass.Length - suffix.Length);
            }
        }

        throw new NotSupportedException($"Declaring class must end with one of: {string.Join(", ", _suffixes)}.");
    }
}
