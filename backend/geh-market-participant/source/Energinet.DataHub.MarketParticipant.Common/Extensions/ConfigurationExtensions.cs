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
using Energinet.DataHub.MarketParticipant.Common.Configuration;
using Microsoft.Extensions.Configuration;

namespace Energinet.DataHub.MarketParticipant.Common.Extensions;

public static class ConfigurationExtensions
{
    public static T GetSetting<T>(this IConfiguration? configuration, Setting<T> setting)
    {
        ArgumentNullException.ThrowIfNull(configuration, nameof(configuration));
        ArgumentNullException.ThrowIfNull(setting, nameof(setting));

        return setting.GetValue(configuration) ??
               throw new InvalidOperationException($"The configuration is incomplete. Setting {setting.Key} is missing or invalid.");
    }

    public static T? GetOptionalSetting<T>(this IConfiguration? configuration, Setting<T> setting)
    {
        ArgumentNullException.ThrowIfNull(configuration, nameof(configuration));
        ArgumentNullException.ThrowIfNull(setting, nameof(setting));

        return setting.GetValue(configuration);
    }
}
