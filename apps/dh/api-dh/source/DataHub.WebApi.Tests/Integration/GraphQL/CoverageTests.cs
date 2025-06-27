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
using System.Linq;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using Energinet.DataHub.WebApi.Tests.Traits;
using FluentAssertions;
using Xunit;
using Xunit.Sdk;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL;

public class CoverageTests
{
    [Fact]
    public void EnsureCoverageForMethodsWithUseRevisionLogAttribute()
    {
        var operations = typeof(IModule).Assembly
            .GetTypes()
            .SelectMany(t => t.GetMethods())
            .Where(m => m.CustomAttributes.Any(a => a.AttributeType.Equals(typeof(UseRevisionLogAttribute))))
            .Select(m => $"{m.DeclaringType?.Name}.{m.Name}")
            .ToHashSet();

        var tests = typeof(CoverageTests).Assembly
            .GetTypes()
            .SelectMany(t => t.GetMethods())
            .SelectMany(m => TraitHelper.GetTraits(m))
            .Where(t => t.Key == RevisionLogTestTraitDiscoverer.Key)
            .Select(t => t.Value)
            .ToHashSet();

        operations
            .Except(tests)
            .Should()
            .BeEmpty("methods with [UseRevisionLog] require an accompanying test");
    }
}
