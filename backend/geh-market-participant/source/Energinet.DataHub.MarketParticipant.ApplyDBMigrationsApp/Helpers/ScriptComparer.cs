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

namespace Energinet.DataHub.MarketParticipant.ApplyDBMigrationsApp.Helpers
{
    /// <summary>
    /// Compare sql script file names
    /// </summary>
    public sealed class ScriptComparer : Comparer<string>
    {
        private static readonly IComparer<string> _stringComparer = StringComparer.Ordinal;

#pragma warning disable 8765 // Nullable doesn't match overriden, because of nullable.
        public override int Compare(string x, string y)
        {
            var first = NamingConvention.Regex.Match(x);
            var second = NamingConvention.Regex.Match(y);

            if (first.Groups["timestamp"].Value == second.Groups["timestamp"].Value)
            {
                return first.Groups["type"].Value == second.Groups["type"].Value
                    ? _stringComparer.Compare(first.Groups["name"].Value, second.Groups["name"].Value)
                    : _stringComparer.Compare(first.Groups["type"].Value, second.Groups["type"].Value);
            }

            return _stringComparer.Compare(first.Groups["timestamp"].Value, second.Groups["timestamp"].Value);
        }
    }
}
