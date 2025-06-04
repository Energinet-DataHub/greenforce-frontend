// Copyright 2024 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License");
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
using Microsoft.FeatureManagement;

namespace Energinet.DataHub.WebApi.Modules.ReleaseToggle;

public class ReleaseToggleService
{
    private readonly IFeatureManagerSnapshot _featureManager;

    public ReleaseToggleService(IFeatureManagerSnapshot featureManager)
    {
        _featureManager = featureManager;
    }

    public async Task<IEnumerable<string>> GetAllAsync()
    {
        var names = new List<string>();
        await foreach (var name in _featureManager.GetFeatureNamesAsync())
        {
            var enabled = await _featureManager.IsEnabledAsync(name);
            if (enabled)
            {
                names.Add(name);
            }
        }

        return names;
    }
}
