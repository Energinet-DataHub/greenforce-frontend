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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_015.CustomQueries;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Client;

/// <summary>
/// Client for interacting with move-in processes in the Process Manager.
/// </summary>
public interface IMoveInClient
{
    /// <summary>
    /// Get temporary storage data for a given metering point and process.
    /// </summary>
    Task<RequestTemporaryStorageResult?> GetTemporaryStorageDataAsync(
        string meteringPointId,
        string processId,
        CancellationToken ct = default);

    /// <summary>
    /// Get the start date for a given process.
    /// </summary>
    Task<DateTimeOffset?> GetStartDateAsync(
        string processId,
        CancellationToken ct = default);
}
