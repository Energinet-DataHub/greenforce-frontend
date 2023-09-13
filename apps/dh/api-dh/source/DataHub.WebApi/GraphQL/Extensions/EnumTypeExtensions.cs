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
using HotChocolate.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public static class EnumTypeExtensions
    {
        internal static void AsIsCase<T>(this IEnumTypeDescriptor<T> descriptor)
            where T : Enum
        {
            descriptor.BindValuesExplicitly();

            foreach (T value in typeof(T).GetEnumValues())
            {
                descriptor.Value(value).Name(Enum.GetName(typeof(T), value));
            }
        }

        internal static void AsLowerCase<T>(this IEnumTypeDescriptor<T> descriptor)
            where T : Enum
        {
            descriptor.BindValuesExplicitly();

            foreach (T value in typeof(T).GetEnumValues())
            {
                descriptor.Value(value).Name(Enum.GetName(typeof(T), value)?.ToLower());
            }
        }
    }
}
