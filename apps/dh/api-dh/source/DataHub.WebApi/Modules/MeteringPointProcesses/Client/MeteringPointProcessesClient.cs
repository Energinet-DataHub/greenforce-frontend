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

using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.ProcessManager.Client;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Models;

namespace Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Client;

/// <summary>
/// Client for querying metering point processes from Process Manager.
/// </summary>
public class MeteringPointProcessesClient(
    IProcessManagerClient processManagerClient,
    IHttpContextAccessor httpContextAccessor) : IMeteringPointProcessesClient
{
    /// <inheritdoc />
    public async Task<IMeteringPointProcess?> GetMeteringPointProcessByIdAsync(
        string id,
        string meteringPointId,
        CancellationToken ct = default)
    {
        var process = await MessageArchive.MeteringPointProcessNode
            .GetMeteringPointProcessByIdAsync(
                id,
                meteringPointId,
                processManagerClient,
                httpContextAccessor,
                ct)
            .ConfigureAwait(false);

        return process is null ? null : MapMeteringPointProcess(process);
    }

    /// <inheritdoc />
    public async Task<IMeteringPointProcess?> GetCancelledByProcessAsync(
        MeteringPointProcess process,
        CancellationToken ct = default)
    {
        var cancelledByProcess = await MessageArchive.MeteringPointProcessNode
            .GetCancelledByProcessAsync(
                process,
                processManagerClient,
                httpContextAccessor,
                ct)
            .ConfigureAwait(false);

        return cancelledByProcess is null ? null : MapMeteringPointProcess(cancelledByProcess);
    }

    /// <summary>
    /// Maps a metering point process to the most specific V2 process model currently available.
    /// </summary>
    private static IMeteringPointProcess MapMeteringPointProcess(MeteringPointProcess process)
        => process.BusinessReason switch
        {
            var b when b == BusinessReason.IncorrectMove => new IncorrectMoveInProcess(process),
            _ => new UnknownMeteringPointProcess(process),
        };
}
