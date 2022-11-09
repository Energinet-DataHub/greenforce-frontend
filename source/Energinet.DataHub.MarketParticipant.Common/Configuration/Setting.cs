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
using Microsoft.Extensions.Configuration;

namespace Energinet.DataHub.MarketParticipant.Common.Configuration;

public record Setting<T>(string Key)
{
    public Setting(string key, T fallback)
        : this(key)
    {
        ArgumentNullException.ThrowIfNull(fallback, nameof(fallback));
        Fallback = fallback;
    }

    public T? Fallback { get; }

    public virtual T? GetValue(IConfiguration configuration)
    {
        var value = configuration.GetValue<T>(Key);

        // Strings are almost the default type, so coalesce is built-in.
        if (value is string str && string.IsNullOrWhiteSpace(str))
        {
            value = default;
        }

        return value ?? Fallback;
    }
}
