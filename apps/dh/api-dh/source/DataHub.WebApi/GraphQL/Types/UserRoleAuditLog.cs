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
using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using HotChocolate;

namespace Energinet.DataHub.WebApi.GraphQL;

public class UserRoleAuditLog
{
    [GraphQLIgnore]
    public Guid AuditIdentityId { get; set; }

    public Guid UserRoleId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public IEnumerable<string> Permissions { get; set; } = Array.Empty<string>();

    public EicFunction? EicFunction { get; set; }

    public UserRoleStatus Status { get; set; }

    public UserRoleChangeType ChangeType { get; set; }

    public DateTimeOffset Timestamp { get; set; }

    public Task<string> GetChangedByUserNameAsync(AuditIdentityCacheDataLoader dataLoader)
    {
        return dataLoader
            .LoadAsync(AuditIdentityId)
            .Then(x => x.DisplayName);
    }
}
