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
using Energinet.DataHub.WebApi.Modules.Common.Utilities;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Helpers;

public static class EnumerationTestHelper
{
    public static void TestFromName<T>(Type type)
         where T : Enumeration<T> => TestCustomFrom(type, Enumeration<T>.FromName);

    public static void TestCustomFrom<T>(Type type, Func<string, T> fromOrThrow)
    {
        foreach (var e in Enum.GetNames(type))
        {
            var name = e.ToString();
            Assert.NotNull(name);

            try
            {
                var instance = fromOrThrow(name);
                Assert.IsType<T>(instance);
            }
            catch (Exception)
            {
                Assert.Fail($"""

                    Unable to make "{typeof(T).Name}" instance from "{type.Name}" with name "{name}".
                    Did you forget to add "{name}" to "{typeof(T).Name}"?

                """);
            }
        }
    }

    public static void TestCast<T>(Type type)
        where T : Enumeration<T> => TestCustomCast<T>(type, r => r.Cast(type));

    public static void TestCustomCast<T>(Type type, Func<T, object> castOrThrow)
        where T : Enumeration<T>
    {
        foreach (var option in Enumeration<T>.GetAll())
        {
            try
            {
                castOrThrow(option);
            }
            catch (Exception)
            {
                Assert.Fail($"""

                    Unable to cast "{option.Name}" to "{type.Name}".
                    Has there been any changes to "{type.Name}"?

                """);
            }
        }
    }
}
