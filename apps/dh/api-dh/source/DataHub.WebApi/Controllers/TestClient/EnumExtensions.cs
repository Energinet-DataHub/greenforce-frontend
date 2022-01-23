// Copyright 2021 Energinet DataHub A/S
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
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;

namespace ENDK.DataHub.Common.Extensions
{
    public static class EnumExtensions
    {
        public static T GetEnumFromString<T>(this string value)
        {
            return GetEnumFromString<T>(value, false);
        }

        public static T GetEnumFromString<T>(this string value, bool ignoreCase)
        {
            return GetEnumFromString<T>(value, ignoreCase, false);
        }

        public static T GetEnumFromString<T>(this string value, bool ignoreCase, object defaultEnum)
        {
            return GetEnumFromString<T>(value, ignoreCase, false, defaultEnum);
        }

        public static T GetEnumFromString<T>(this string value, bool ignoreCase, bool ignoreNull)
        {
            return GetEnumFromString<T>(value, ignoreCase, ignoreNull, null);
        }

        public static T GetEnumFromString<T>(this string value, bool ignoreCase, bool ignoreNull, object? defaultEnum)
        {
            if (defaultEnum != null && !defaultEnum.GetType().Equals(typeof(T)))
            {
                throw new ApplicationException("Type of the specified default doesn't match T");
            }

            try
            {
                if (value != null)
                {
                    return (T)Enum.Parse(typeof(T), value, ignoreCase);
                }

                return ignoreNull && defaultEnum != null
                    ? (T)defaultEnum
                    : throw new ApplicationException(string.Format("No enum found for value '{0}'", value));
            }
            catch
            {
                if (defaultEnum != null)
                {
                    return (T)defaultEnum;
                }

                throw new ApplicationException(string.Format("No enum found for value '{0}'", value));
            }
        }

        public static string EnumToString(this Enum obj)
        {
            return obj.ToString();
        }
    }
}
