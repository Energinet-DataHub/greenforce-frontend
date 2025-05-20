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

using Energinet.DataHub.WebApi.Modules.Common.Models;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<IEnumerable<FeatureToggleDto>> GetReleaseTogglesAsync(
        [Service] Energinet.DataHub.WebApi.Modules.Common.FeatureFlagService featureFlagService)
    {
        return await featureFlagService.GetAllFeatureTogglesAsync();
    }
}
