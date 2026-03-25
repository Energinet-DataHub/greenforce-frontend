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

namespace Energinet.DataHub.WebApi.Modules.Charges.Client;

/// <summary>
/// Service for resolving the active SystemOperator actor number.
/// </summary>
public interface ISystemOperatorService
{
    /// <summary>
    /// Returns the actor number of the active SystemOperator.
    /// The result is cached to avoid fetching the full actor list on every call.
    /// </summary>
    Task<string> GetSystemOperatorActorNumberAsync(CancellationToken ct = default);
}
