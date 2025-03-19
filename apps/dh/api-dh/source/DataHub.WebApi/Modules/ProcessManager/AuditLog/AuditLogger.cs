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

using System.Text.Json;
using Energinet.DataHub.ProcessManager.Abstractions.Api.Model.OrchestrationInstance;
using Energinet.DataHub.RevisionLog.Integration;
using Energinet.DataHub.WebApi.Modules.ProcessManager.AuditLog.Models;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.AuditLog;

public class AuditLogger(IClock clock, IRevisionLogClient revisionLogClient) : IAuditLogger
{
    private static readonly Guid _bffSystemId = Guid.Parse("D71145AC-4060-41DD-BC09-D695FE97CDA6");

    private readonly IClock _clock = clock;
    private readonly IRevisionLogClient _revisionLogClient = revisionLogClient;

    public async Task LogAsync(
        AuditLogActivity activity,
        string origin,
        object? payload,
        AuditLogEntityType? affectedEntityType,
        Guid? affectedEntityKey,
        UserIdentityDto currentUser)
    {
        var payloadAsJson = payload switch
        {
            null => string.Empty,
            string p => p,
            _ => JsonSerializer.Serialize(payload),
        };

        var log = new RevisionLogEntry(
            logId: Guid.NewGuid(),
            systemId: _bffSystemId, // TODO: What is BFF system id?
            activity: activity.Identifier,
            occurredOn: _clock.GetCurrentInstant(),
            origin: origin,
            payload: payloadAsJson,
            userId: currentUser.UserId,
            actorId: Guid.NewGuid(),
            actorNumber: currentUser.ActorNumber.Value,
            marketRoles: currentUser.ActorRole.Name,
            permissions: "permissions", // TODO: How to get permissions?
            affectedEntityType: affectedEntityType?.Identifier,
            affectedEntityKey: affectedEntityKey?.ToString());

        await _revisionLogClient.LogAsync(log).ConfigureAwait(false);
    }
}
