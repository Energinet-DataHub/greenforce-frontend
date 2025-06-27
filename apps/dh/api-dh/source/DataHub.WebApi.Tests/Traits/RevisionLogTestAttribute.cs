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
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace Energinet.DataHub.WebApi.Tests.Traits;

/// <summary>
/// Attribute that is applied to a method to indicate that it is a test that covers the
/// usage of the "[UseRevisionLog]" attribute on a specific operation. Used to satisfy
/// the coverage check in "EnsureCoverageForMethodsWithUseRevisionLogAttribute".
/// </summary>
[TraitDiscoverer(RevisionLogTestTraitDiscoverer.FullyQualifiedName, RevisionLogTestTraitDiscoverer.Namespace)]
[AttributeUsage(AttributeTargets.Method)]
public class RevisionLogTestAttribute(string method) : Attribute, ITraitAttribute
{
    public string Method { get; } = method;
}

[SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleType", Justification = "Reviewed.")]
public class RevisionLogTestTraitDiscoverer : ITraitDiscoverer
{
    public const string Key = "RevisionLogTest";

    public const string Namespace = "Energinet.DataHub.WebApi.Tests";

    public const string FullyQualifiedName = $"{Namespace}.Traits.RevisionLogTestTraitDiscoverer";

    public IEnumerable<KeyValuePair<string, string>> GetTraits(IAttributeInfo traitAttribute)
    {
        var ctorArgs = traitAttribute.GetConstructorArguments().ToList();
        yield return new KeyValuePair<string, string>(Key, ctorArgs[0].ToString() ?? string.Empty);
    }
}
