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

using System.Diagnostics.CodeAnalysis;
using Microsoft.FeatureManagement;

namespace Energinet.DataHub.WebApi.Extensions;

[SuppressMessage("Usage", "VSTHRD002", Justification = "Only used once on startup")]
public static class ConfigurationExtensions
{
    public static bool IsFeatureEnabled(this IConfiguration configuration, string feature)
    {
        var featureServices = new ServiceCollection();
        featureServices.AddFeatureManagement(configuration);
        using var provider = featureServices.BuildServiceProvider();
        var manager = provider.GetRequiredService<IFeatureManager>();
        return manager.IsEnabledAsync(feature).GetAwaiter().GetResult();
    }
}
