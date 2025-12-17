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
using System.Reflection;
using Energinet.DataHub.WebApi.Modules.Common.Utilities;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Helpers;

public static class EnumerationTestHelper
{
    public static void TestEnumerationFrom<T>(Type type, Func<string, T> makeOrThrow)
    {
        foreach (var e in Enum.GetNames(type))
        {
            var name = e.ToString();
            Assert.NotNull(name);

            try
            {
                var instance = makeOrThrow(name);
                Assert.IsType<T>(instance);
            }
            catch (Exception)
            {
                Assert.Fail($"Unable to make {typeof(T).FullName} instance from {type.FullName}");
            }
        }
    }

    public static void TestEnumerationCast<T>(Type type, Func<T, object> castOrThrow)
        where T : Enumeration<T>
    {
        var baseType = typeof(T);
        var options = baseType
            .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly)
            .Where(f => f.FieldType == baseType)
            .OrderBy(f => f.Name)
            .Select(field => field.GetValue(null) ?? throw new Exception())
            .Cast<T>()
            .ToList();

        foreach (var option in options)
        {
            try
            {
                castOrThrow(option);
            }
            catch (Exception)
            {
                Assert.Fail($"Unable to cast {option.Name} to {type.FullName}");
            }
        }
    }
}
