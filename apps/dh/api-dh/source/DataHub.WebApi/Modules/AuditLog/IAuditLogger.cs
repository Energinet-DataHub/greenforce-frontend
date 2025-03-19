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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.WebApi.Modules.AuditLog.Models;

namespace Energinet.DataHub.WebApi.Modules.AuditLog;

/// <summary>
/// Interface for logging audit log entries.
/// </summary>
public interface IAuditLogger
{
    /// <summary>
    /// Logs an audit log entry.
    /// </summary>
    /// <param name="activity"></param>
    /// <param name="origin"></param>
    /// <param name="payload"></param>
    /// <param name="affectedEntityType"></param>
    /// <param name="affectedEntityKey"></param>
    /// <param name="currentUser"></param>
    /// <returns>A <see cref="Task"/> representing the result of the asynchronous operation.</returns>
    Task LogAsync(
        AuditLogActivity activity,
        string origin,
        object? payload,
        AuditLogEntityType? affectedEntityType,
        Guid? affectedEntityKey,
        UserIdentityDto currentUser);
}
