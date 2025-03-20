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
using Energinet.DataHub.RevisionLog.Integration;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Models;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.RevisionLog;

public class RevisionLogClient(
    DataHub.RevisionLog.Integration.IRevisionLogClient revisionLogClient,
    IHttpContextAccessor httpContextAccessor) : IRevisionLogClient
{
    private IHttpContextAccessor HttpContextAccessor { get; } = httpContextAccessor;

    private static readonly Guid _bffSystemId = Guid.Parse("D71145AC-4060-41DD-BC09-D695FE97CDA6");
    private readonly DataHub.RevisionLog.Integration.IRevisionLogClient _revisionLogClient = revisionLogClient;

    public async Task LogAsync(
        RevisionLogActivity activity,
        string? origin,
        object? payload,
        RevisionLogEntityType? affectedEntityType,
        Guid? affectedEntityKey)
    {
        var payloadAsJson = payload switch
        {
            null => string.Empty,
            string p => p,
            _ => JsonSerializer.Serialize(payload),
        };

        var newLogEntry = new RevisionLogEntry(
            logId: Guid.NewGuid(),
            systemId: _bffSystemId,
            activity: activity.Identifier,
            occurredOn: SystemClock.Instance.GetCurrentInstant(),
            origin: origin ?? HttpContextAccessor.GetRequestUrl(),
            payload: payloadAsJson,
            userId: HttpContextAccessor.GetUserId(),
            actorId: HttpContextAccessor.GetAssociatedActorId(),
            actorNumber: HttpContextAccessor.GetUserActorNumber(),
            marketRoles: HttpContextAccessor.GetUserActorRole(),
            permissions: string.Join(',', HttpContextAccessor.GetUserPermissions()),
            affectedEntityType: affectedEntityType?.Identifier,
            affectedEntityKey: affectedEntityKey?.ToString());

        await _revisionLogClient.LogAsync(newLogEntry).ConfigureAwait(false);
    }
}
